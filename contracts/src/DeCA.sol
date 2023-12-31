// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// import {IERC20} from 'forge-std/interfaces/IERC20.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

library DCAStructs {

    struct BuyEpochInfo {
        uint256 amountBought;
        uint256 amountPaid;
        uint256 keeperFeePaid;
        uint256 addCliff;
        uint256 subtractCliff;
    }

    struct UserBuyInfo {
        uint256 perBuyAmount;
        uint256 buyBalance;
        uint256 enteringEpochId;
        uint256 lastBuyAmountForTransitoryEpoch;
    }

    struct ExternalReadUserInfo {
        uint256 perBuyAmount;
        uint256 originalPaymentBalance;
        uint256 enteringEpochId;
        uint256 lastBuyAmountForTransitoryEpoch;
        uint256 buyingTokenOwed;
        uint256 payingBalanceRemaining;
        address paymentToken;
        address buyingToken;
    }

    struct DCAStrategy {
        address paymentToken;
        address buyingToken;
        uint256 perPeriodBuy;
        uint256 blocksPerPeriod;
        uint256 buysPerEpoch;
        uint256 buyCounter;
        uint256 paymentBalance;
        uint256 buyingBalance;
        uint256 poolFee;
        bool disabled;
        bool depositsDisabled;
        uint256 lastBuyBlock;
        uint256 minUserBuy;
    }
}

contract DeCA {
    uint256 public strategyCounter;
    address public owner;
    mapping(uint256 => DCAStructs.DCAStrategy) public strategies;
    mapping(address => mapping(uint256 => DCAStructs.UserBuyInfo)) public userBuyInfos;
    mapping(uint256 => mapping(uint256 => DCAStructs.BuyEpochInfo)) buyEpochs;
    mapping(address => bool) allowedTriggerStrategyAddresses;
    event Log(string message);
    
    event NewStrategy(uint256 strategyId, DCAStructs.DCAStrategy strategy);

    ISwapRouter public immutable uniswapRouter;

    constructor() {
        owner = msg.sender;
        uniswapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
        allowedTriggerStrategyAddresses[msg.sender] = true;
        // PAY WMATIC, BUY WETH ON MUMBAI TESTNET
        createNewStrategy(0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889, 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa, 30, 1, 30, 1000000000000);
        // bool approve = IERC20(0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889).approve(address(uniswapRouter), 100000000000000000000000000000);
        // require(approve, "pre-swap approve fail");
    }

    function listStrategies(uint256 firstStrategyId, uint256 numStrategies) external view returns (DCAStructs.DCAStrategy[] memory strategyData) {
        require(strategyCounter >= firstStrategyId + numStrategies, "not that many strategies exist");
        strategyData = new DCAStructs.DCAStrategy[](numStrategies);
        for (uint256 i = 0; i < numStrategies; i++) {
            strategyData[i] = strategies[firstStrategyId + i];
        }
    }

    function listUserPositions(address user) external view returns (DCAStructs.ExternalReadUserInfo[] memory userPositions) {
        uint256 amountFound = 0;
        for (uint256 i = 0; i < strategyCounter; i++) {
            if (userBuyInfos[user][i].perBuyAmount > 0 || userBuyInfos[user][i].lastBuyAmountForTransitoryEpoch > 0) {
                amountFound++;
            }
        }
        userPositions = new DCAStructs.ExternalReadUserInfo[](amountFound);
        uint256 foundInd = 0;
        for (uint256 i = 0; i < strategyCounter; i++) {
            if (userBuyInfos[user][i].perBuyAmount > 0 || userBuyInfos[user][i].lastBuyAmountForTransitoryEpoch > 0) {
                DCAStructs.UserBuyInfo memory foundData = userBuyInfos[user][i];
                DCAStructs.DCAStrategy memory strategy = strategies[i];
                (uint256 amountSpent, uint256 amountOwed) = calculatePurchasesOwedAndBalanceSpent(i, user);
                userPositions[foundInd] = DCAStructs.ExternalReadUserInfo({
                    perBuyAmount: foundData.perBuyAmount,
                    originalPaymentBalance: foundData.buyBalance,
                    enteringEpochId: foundData.enteringEpochId,
                    lastBuyAmountForTransitoryEpoch: foundData.lastBuyAmountForTransitoryEpoch,
                    buyingTokenOwed: amountOwed,
                    payingBalanceRemaining: foundData.buyBalance - amountSpent,
                    paymentToken: address(strategy.paymentToken),
                    buyingToken: address(strategy.buyingToken)
                });
                foundInd++;
            }
        }
        return userPositions;
    }

    function updateAllowedTriggerStrategyAddress(address triggererAddress, bool updateTo) public {
        require(msg.sender == owner, "only owner");
        allowedTriggerStrategyAddresses[triggererAddress] = updateTo;
    }

    uint256 totalBps = 10000;

    function swap(address paymentToken, address buyingToken, uint256 amountToPay, uint24 poolFee) internal returns (uint256 amountBought, uint256 feePaid) {
        if (amountToPay == 0) {
            return (0, 0);
        }

        TransferHelper.safeApprove(paymentToken, address(uniswapRouter), amountToPay);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: paymentToken,
                tokenOut: buyingToken,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp + 1000000000,
                amountIn: amountToPay,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        try uniswapRouter.exactInputSingle(params) returns (uint256 ab) {
            emit Log("uniswap success!");
            amountBought = ab;
        } catch {
            emit Log("uniswap failed!");
        }
        require(amountBought > 0, "uniswap returned 0");
        return (amountBought, (amountToPay * poolFee) / totalBps);
    }

    function triggerStrategyBuy(uint256 strategyId) public {
        require(allowedTriggerStrategyAddresses[msg.sender], "address not allowed to trigger strategies");
        require(strategyCounter > strategyId, "strategy does not exist");
        DCAStructs.DCAStrategy storage strategy = strategies[strategyId];
        require(!strategy.disabled, "strategy disabled");
        require(block.number >= strategy.lastBuyBlock + strategy.blocksPerPeriod, "buy too early");
        uint256 currentEpochId = getCurrentEpoch(strategy);
        DCAStructs.BuyEpochInfo memory currentEpochBuyInfo = buyEpochs[strategyId][currentEpochId];
        if (strategy.buyCounter % strategy.buysPerEpoch == 0) {
            strategy.perPeriodBuy += currentEpochBuyInfo.addCliff;
            strategy.perPeriodBuy -= currentEpochBuyInfo.subtractCliff;
        }
        require(strategy.perPeriodBuy > 0, "can't swap 0!");
        require(IERC20(strategy.paymentToken).balanceOf(address(this)) >= strategy.perPeriodBuy, "contract doesn't hold enough balance to swap");
        (uint256 amountBought, uint256 feePaid) = swap(strategy.paymentToken, strategy.buyingToken, strategy.perPeriodBuy, uint24(strategy.poolFee));
        currentEpochBuyInfo.amountBought += amountBought;
        currentEpochBuyInfo.amountPaid += strategy.perPeriodBuy;
        currentEpochBuyInfo.keeperFeePaid += feePaid;
        strategy.buyCounter += 1;
        strategy.lastBuyBlock = block.number;
        strategy.paymentBalance -= strategy.perPeriodBuy;
        strategy.buyingBalance += amountBought;
    }

    function createNewStrategy(address paymentToken, address buyingToken, uint256 blocksPerPeriod, uint256 buysPerEpoch, uint256 poolFee, uint256 minUserBuy) public {
        require(msg.sender == owner, "only owner");
        require(buysPerEpoch >= 1, "invalid epoch length");
        require(blocksPerPeriod >= 1, "invalid period length");
        require(minUserBuy >= 1, "invalid min buy");
        // TODO confirm tokens are IERC20
        strategies[strategyCounter] = DCAStructs.DCAStrategy({
            paymentToken: paymentToken,
            buyingToken: buyingToken,
            perPeriodBuy: 0,
            blocksPerPeriod: blocksPerPeriod,
            buysPerEpoch: buysPerEpoch,
            buyCounter: 0,
            buyingBalance: 0,
            paymentBalance: 0,
            poolFee: poolFee,
            disabled: false,
            depositsDisabled: false,
            lastBuyBlock: 0,
            minUserBuy: minUserBuy
        });
        strategyCounter += 1;
    }

    function calculateUserCut(uint256 userAmountPaid, DCAStructs.BuyEpochInfo memory epochInfo) internal pure returns (uint256) {
        if (epochInfo.amountBought == 0) {
            return 0;
        }
        return (userAmountPaid * epochInfo.amountBought) / epochInfo.amountPaid;
    }

    /*
        This function only calculates balances for completed epochs.

        Gets strategy and user info
        gets current epoch
        checks for transitory epoch for user and adds to balance
        checks how many epochs user could buy, then calcs owed for each
        returns WITHOUT STATE UPDATES
    */
    function calculatePurchasesOwedAndBalanceSpent(uint256 strategyId, address withdrawer) public view returns (uint256 amountOwed, uint256 amountSpent) {
        require(strategyId < strategyCounter, "invalid strategyId");
        DCAStructs.DCAStrategy memory strategy = strategies[strategyId];
        DCAStructs.UserBuyInfo memory userInfo = userBuyInfos[withdrawer][strategyId];
        require(userInfo.perBuyAmount > 0 || userInfo.lastBuyAmountForTransitoryEpoch > 0, "no buys set, nothing to withdraw");
        uint256 currentEpoch = getCurrentEpoch(strategy);
        // if at least entering next epoch, then the transitory epoch has completed
        if (userInfo.lastBuyAmountForTransitoryEpoch != 0 && currentEpoch >= userInfo.enteringEpochId) {
            DCAStructs.BuyEpochInfo memory transitoryEpochInfo = buyEpochs[strategyId][userInfo.enteringEpochId - 1];
            amountOwed += calculateUserCut(userInfo.lastBuyAmountForTransitoryEpoch * strategy.buysPerEpoch, transitoryEpochInfo);
            amountSpent += userInfo.lastBuyAmountForTransitoryEpoch * strategy.buysPerEpoch;
        }

        uint256 userBalanceAfterTransitory = userInfo.buyBalance - (userInfo.lastBuyAmountForTransitoryEpoch * strategy.buysPerEpoch);
        uint256 finalBuyableEpoch = (userBalanceAfterTransitory / (userInfo.perBuyAmount * strategy.buysPerEpoch)) + userInfo.enteringEpochId;
        // if finalBuyable is 23, current is 20, then loop cutoff 20
        // if finalBuyable is 20, current is 23, then cutoff is 20
        uint256 loopCutoff = finalBuyableEpoch > currentEpoch ? currentEpoch : finalBuyableEpoch;

        for (uint256 epochId = userInfo.enteringEpochId; epochId < loopCutoff; epochId++) {
            DCAStructs.BuyEpochInfo memory epochInfo = buyEpochs[strategyId][epochId];
            amountOwed += calculateUserCut(userInfo.perBuyAmount * strategy.buysPerEpoch, epochInfo);
            amountSpent += userInfo.perBuyAmount * strategy.buysPerEpoch;
        }
        return (amountOwed, amountSpent);
    }

    function isEpochComplete(DCAStructs.DCAStrategy memory strategy, uint256 epochId) pure internal  returns (bool) {
        return (strategy.buyCounter >= strategy.buysPerEpoch * (epochId + 1));
    }

    function isInMiddleOfEpoch(DCAStructs.DCAStrategy memory strategy) pure internal returns (bool) {
        return (strategy.buyCounter % strategy.buysPerEpoch != 0);
    }

    function getFinalBuyEpochIdForUser(uint256 strategyId, address withdrawer) public view returns (uint256) {
        DCAStructs.DCAStrategy storage strategy = strategies[strategyId];
        DCAStructs.UserBuyInfo storage userInfo = userBuyInfos[withdrawer][strategyId];
        uint256 userBuysPerEpoch = userInfo.perBuyAmount * strategy.buysPerEpoch;
        uint256 buyableEpochs = userInfo.buyBalance / userBuysPerEpoch;
        return userInfo.enteringEpochId + buyableEpochs;
    }

    /*
        Updates strategy per epoch buy reduction cliffs based on a user exiting the strategy
        PRE-EXISTING:
            the epoch after the users last buy has a buy reduction for the users buy.
            EG:
                if user was buying .1 ETH per buy, and their last epoch was 20, epoch 21 would have a subtraction cliff of .1
                this is so that the protocol does not buy for the user when they no longer have a balance
        DESIRED OUTCOME:
            IF the users final epoch has already passed or has been started, the cliff was/will be used properly and no cliff moving is needed
            ELSE
            find the new users final buy epoch and move the subtraction there.  This will either be the current epoch if no buys have occured yet,
            OR the epoch after that if the current epoch has already started.
            EG:
                if user was buying .1 ETH per buy, and their last epoch was 20, epoch 21 would have a subtraction cliff of .1
                ex 1: 
                    current epoch is 23
                    the strategies buy was updated when epoch 21 started using its cliffs, so the users cliffs have already been updated. nothing needed.
                ex 2: 
                    current epoch is 20, and has started
                    the epoch cliff at 21 will still be used correctly, no changes are needed
                ex 3: 
                    current epoch is 15, and has started.
                    epoch 21 no longer needs the subtraction cliff for the user, so that subtraction cliff is reduced by .1
                    epoch 15 has started so the buy for this epoch should not be subtracted.
                    epoch 16 will no longer have the user buying, so it should have a subtraction cliff of .1 (moved from 21)
                ex 4: 
                    current epoch is 15, and has NOT started.
                    epoch 21 no longer needs the subtraction cliff for the user, so that subtraction cliff is reduced by .1
                    epoch 15 has NOT started so the buy for this epoch should have a subtraction cliff of .1 (moved from 21)
    */
    function updateCliffsFromWithdraw(uint256 strategyId, address withdrawer) internal {
        DCAStructs.DCAStrategy storage strategy = strategies[strategyId];
        DCAStructs.UserBuyInfo storage userInfo = userBuyInfos[withdrawer][strategyId];
        uint256 currentEpoch = getCurrentEpoch(strategy);
        uint256 originalFinalUserBuyEpochId = getFinalBuyEpochIdForUser(strategyId, withdrawer);
        bool isInMiddleOfCurrentEpoch = isInMiddleOfEpoch(strategy);
        // if cliffs are passed already OR if cliff is about to be used and cannot be removed, no need to update
        if (currentEpoch > originalFinalUserBuyEpochId /* ex1 */ || (currentEpoch == originalFinalUserBuyEpochId && isInMiddleOfCurrentEpoch /* ex2 */)) {
            return;
        }
        DCAStructs.BuyEpochInfo storage finalBuyEpochToUpdate = buyEpochs[strategyId][originalFinalUserBuyEpochId+1];
        if (isInMiddleOfCurrentEpoch) { //ex3
            DCAStructs.BuyEpochInfo storage nextBuyEpochToUpdate = buyEpochs[strategyId][currentEpoch+1];
            nextBuyEpochToUpdate.subtractCliff += userInfo.perBuyAmount;
        } else { //ex4
            DCAStructs.BuyEpochInfo storage unstartedCurrentBuyEpochToUpdate = buyEpochs[strategyId][currentEpoch];
            unstartedCurrentBuyEpochToUpdate.subtractCliff += userInfo.perBuyAmount;
        }
        finalBuyEpochToUpdate.subtractCliff -= userInfo.perBuyAmount;  
    }

    function updateCliffsFromAddStrategy(uint256 strategyId, uint256 amountPerBuy, uint256 epochsToBuy) internal {
        DCAStructs.DCAStrategy storage strategy = strategies[strategyId];
        uint256 currentEpoch = getCurrentEpoch(strategy);
        bool isInMiddleOfCurrentEpoch = isInMiddleOfEpoch(strategy);
        if (isInMiddleOfCurrentEpoch) {
            DCAStructs.BuyEpochInfo storage nextBuyEpochToUpdate = buyEpochs[strategyId][currentEpoch + 1];
            nextBuyEpochToUpdate.addCliff += amountPerBuy;
            DCAStructs.BuyEpochInfo storage finalEpochToUpdate = buyEpochs[strategyId][currentEpoch + 1 + epochsToBuy];
            finalEpochToUpdate.subtractCliff += amountPerBuy;
        } else {            
            DCAStructs.BuyEpochInfo storage unstartedCurrentBuyEpochToUpdate = buyEpochs[strategyId][currentEpoch];
            unstartedCurrentBuyEpochToUpdate.addCliff += amountPerBuy;
            DCAStructs.BuyEpochInfo storage finalEpochToUpdate = buyEpochs[strategyId][currentEpoch + epochsToBuy];
            finalEpochToUpdate.subtractCliff += amountPerBuy;
        }
    }

    /*
        calculate amount owed
            loop through past epochs, find percentage of buys owned, DO NOT WITHDRAW FROM ACTIVE EPOCH
        update cliffs
            remove cliff change from the further out cliff (eg if there was 30 epochs left, remove cliff there, move to next + 1)
    */
    function withdrawOrCollect(uint256 strategyId, address withdrawer, bool shouldWithdrawRemaining) public {
        require(msg.sender == withdrawer, "can't withdraw for someone else!");
        require(strategyId < strategyCounter, "invalid strategyId");
        DCAStructs.DCAStrategy storage strategy = strategies[strategyId];
        DCAStructs.UserBuyInfo storage userInfo = userBuyInfos[withdrawer][strategyId];
        (uint256 amountOwed, uint256 amountSpent) = calculatePurchasesOwedAndBalanceSpent(strategyId, withdrawer);
        userInfo.buyBalance -= amountSpent;
        uint256 currentEpoch = getCurrentEpoch(strategy);
        if (shouldWithdrawRemaining) {
            updateCliffsFromWithdraw(strategyId, withdrawer);
            if (isInMiddleOfEpoch(strategy) && userInfo.buyBalance > 0) { // IN TRANSITORY EPOCH
                userInfo.lastBuyAmountForTransitoryEpoch = userInfo.perBuyAmount;
                userInfo.enteringEpochId = currentEpoch + 1;
                uint256 returnedBalanceExceptingForTransitory = userInfo.buyBalance - (userInfo.perBuyAmount * strategy.buysPerEpoch);
                userInfo.buyBalance = userInfo.perBuyAmount * strategy.buysPerEpoch;
                strategy.paymentBalance -= returnedBalanceExceptingForTransitory;
                IERC20(strategy.paymentToken).transferFrom(address(this), msg.sender, returnedBalanceExceptingForTransitory);
            } else {
                userInfo.lastBuyAmountForTransitoryEpoch = 0;
                userInfo.enteringEpochId = currentEpoch;
                uint256 returnedBalance = userInfo.buyBalance;
                userInfo.buyBalance = 0;
                strategy.paymentBalance -= returnedBalance;
                IERC20(strategy.paymentToken).transferFrom(address(this), msg.sender, returnedBalance);
            }
            userInfo.perBuyAmount = 0;
        } else {
            userInfo.enteringEpochId = currentEpoch;
        }
        require(strategy.buyingBalance >= amountOwed, "don't have enough bought asset to send!");
        strategy.buyingBalance -= amountOwed;

        IERC20(strategy.buyingToken).transferFrom(address(this), withdrawer, amountOwed);
    }

    /*
        This function is used to create or update a buy position, but not to exit.  For exit use withdrawOrCollect.
        This function takes in a new userBuy, a new number of epochs to buy, and a desired final balance.

        It withdraws the existing payment to set the slate clean, minus the transitory epoch requirements.
        It then transfers the amount needed (from/to the user) for the new payment balance.
        It sets up the epoch cliffs for when the user joins/exits the strategy's buys.
        Finally it sets the user buy values.
    */
    function userUpdateStrategy(uint256 strategyId, uint256 newBuyAmount, uint256 desiredPaymentBalance, uint256 epochsToBuy) public payable {
        require(strategyId < strategyCounter, "invalid strategyId");
        DCAStructs.DCAStrategy storage strategy = strategies[strategyId];
        require(newBuyAmount >= strategy.minUserBuy, "newBuyAmountTooLow");
        require(!strategy.disabled && !strategy.depositsDisabled, "strategy is disabled");
        require(epochsToBuy >= 1, "must buy at least 1 full epoch");
    
        DCAStructs.UserBuyInfo storage userInfo = userBuyInfos[msg.sender][strategyId];
        if (userInfo.perBuyAmount != 0 || userInfo.lastBuyAmountForTransitoryEpoch != 0) { // existing strategy, must withdraw all but current active epoch before update
            withdrawOrCollect(strategyId, msg.sender, true);
        }
        userInfo = userBuyInfos[msg.sender][strategyId];
        uint256 currentEpoch = getCurrentEpoch(strategy);
        uint256 balanceRequiredForTransitoryEpoch = userInfo.lastBuyAmountForTransitoryEpoch * strategy.buysPerEpoch;
        uint256 userBuysPerEpoch = newBuyAmount * strategy.buysPerEpoch;
        require(desiredPaymentBalance == (userBuysPerEpoch * epochsToBuy) + balanceRequiredForTransitoryEpoch, "required balance does not equal target");
        if (desiredPaymentBalance > userInfo.buyBalance) {
            uint256 extraPaymentNeeded = desiredPaymentBalance - userInfo.buyBalance;
            IERC20(strategy.paymentToken).transferFrom(msg.sender, address(this), extraPaymentNeeded);
            strategy.paymentBalance += extraPaymentNeeded;
        } else if (desiredPaymentBalance < userInfo.buyBalance) {
            uint256 extraBalanceReturned = userInfo.buyBalance - desiredPaymentBalance;
            IERC20(strategy.paymentToken).transferFrom(address(this), msg.sender, extraBalanceReturned);
            strategy.paymentBalance -= extraBalanceReturned;
        }
        updateCliffsFromAddStrategy(strategyId, newBuyAmount, epochsToBuy);
        userInfo.buyBalance = desiredPaymentBalance;
        userInfo.perBuyAmount = newBuyAmount;
        if (userInfo.lastBuyAmountForTransitoryEpoch == 0 && !isInMiddleOfEpoch(strategy)) {
            userInfo.enteringEpochId = currentEpoch;
        } else {
            userInfo.enteringEpochId = currentEpoch + 1;
        }
    }

    function getRemainingBuysInCurrentEpoch(DCAStructs.DCAStrategy memory strategy) public pure returns (uint256) {
        // keeping calcs here to show but more gas efficient to do everything in line
        // uint256 nextEpoch = getCurrentEpoch(strategy) + 1;
        // uint256 firstBuyInNextEpoch = nextEpoch * strategy.buysPerEpoch;
        // example:
        //      currentEpoch = 5, nextEpoch = 6, buysPerEpoch = 7, currentBuyCounter = 39
        //      42 - 39 = 3 buys left (39, 40, 41)
        return ((getCurrentEpoch(strategy) + 1) * strategy.buysPerEpoch) - strategy.buyCounter;

    }

    function getCurrentEpoch(DCAStructs.DCAStrategy memory strategy) public pure returns (uint256) {
        return strategy.buyCounter / strategy.buysPerEpoch;
    }

}
