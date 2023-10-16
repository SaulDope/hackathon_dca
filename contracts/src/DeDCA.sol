// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

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

    struct DCAStrategy {
        ERC20 paymentToken;
        ERC20 buyingToken;
        uint256 perPeriodBuy;
        uint256 blocksPerPeriod;
        uint256 buysPerEpoch;
        uint256 buyCounter;
        uint256 paymentBalance;
        uint256 buyingBalance;
        bool disabled;
        bool depositsDisabled;
        uint256 lastBuyBlock;
    }
}

contract DeDCA {
    uint256 public strategyCounter;
    address public owner;
    mapping(uint256 => DCAStructs.DCAStrategy) public strategies;
    mapping(address => mapping(uint256 => DCAStructs.UserBuyInfo)) public userBuyInfos;
    mapping(uint256 => mapping(uint256 => DCAStructs.BuyEpochInfo)) buyEpochs;
    mapping(address => bool) allowedTriggerStrategyAddresses;
    
    event NewStrategy(uint256 strategyId, DCAStructs.DCAStrategy strategy);

    function listStrategies(uint256 firstStrategyId, uint256 numStrategies) external view returns (DCAStructs.DCAStrategy[] memory strategyData) {
        require(strategyCounter >= firstStrategyId + numStrategies, "not that many strategies exist");
        strategyData = new DCAStructs.DCAStrategy[](numStrategies);
        for (uint256 i = 0; i < numStrategies; i++) {
            strategyData[i] = strategies[firstStrategyId + i];
        }
    }

    function updateAllowedTriggerStrategyAddress(address triggererAddress, bool updateTo) public {
        require(msg.sender == owner, "only owner");
        allowedTriggerStrategyAddresses[triggererAddress] = updateTo;
    }

    // TODO: call uniswap etc
    function swap(ERC20 paymentToken, ERC20 buyingToken, uint256 amountToPay) internal returns (uint256 amountBought, uint256 feePaid) {
        return (amountBought, feePaid);
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
        (uint256 amountBought, uint256 feePaid) = swap(strategy.paymentToken, strategy.buyingToken, strategy.perPeriodBuy);
        currentEpochBuyInfo.amountBought += amountBought;
        currentEpochBuyInfo.amountPaid += strategy.perPeriodBuy;
        currentEpochBuyInfo.keeperFeePaid += feePaid;
        strategy.buyCounter += 1;
        strategy.lastBuyBlock = block.number;
        strategy.paymentBalance -= strategy.perPeriodBuy;
        strategy.buyingBalance += amountBought;
    }

    function createNewStrategy(ERC20 paymentToken, ERC20 buyingToken, uint256 blocksPerPeriod, uint256 buysPerEpoch) public {
        require(msg.sender == owner, "only owner");
        require(buysPerEpoch >= 1, "invalid epoch length");
        strategies[strategyCounter] = DCAStructs.DCAStrategy({
            paymentToken: paymentToken,
            buyingToken: buyingToken,
            perPeriodBuy: 0,
            blocksPerPeriod: blocksPerPeriod,
            buysPerEpoch: buysPerEpoch,
            buyCounter: 0,
            buyingBalance: 0,
            paymentBalance: 0,
            disabled: false,
            depositsDisabled: false,
            lastBuyBlock: block.number
        });
        strategyCounter += 1;
    }

    uint256 minimumUserBuy = 10000000000000; // 0.00001 ETH

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

    function updateCliffsFromAddStrategy(uint256 strategyId, uint256 amountPerBuy) internal {
        DCAStructs.DCAStrategy storage strategy = strategies[strategyId];
        uint256 currentEpoch = getCurrentEpoch(strategy);
        bool isInMiddleOfCurrentEpoch = isInMiddleOfEpoch(strategy);
        if (isInMiddleOfCurrentEpoch) {
            DCAStructs.BuyEpochInfo storage nextBuyEpochToUpdate = buyEpochs[strategyId][currentEpoch+1];
            nextBuyEpochToUpdate.addCliff += amountPerBuy;
        } else {            
            DCAStructs.BuyEpochInfo storage unstartedCurrentBuyEpochToUpdate = buyEpochs[strategyId][currentEpoch];
            unstartedCurrentBuyEpochToUpdate.addCliff += amountPerBuy;
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
            } else {
                userInfo.lastBuyAmountForTransitoryEpoch = 0;
                userInfo.enteringEpochId = currentEpoch;
            }
            userInfo.perBuyAmount = 0;
        } else {
            userInfo.enteringEpochId = currentEpoch;
        }
        strategy.paymentBalance -= amountSpent;
        require(strategy.buyingBalance >= amountOwed, "don't have enough bought asset to send!");
        strategy.buyingBalance -= amountOwed;
        // SEND AMOUNT OWED

    }

    function userUpdateStrategy(uint256 strategyId, uint256 newBuyAmount, uint256 balanceToDeposit, uint256 epochsToBuy) public payable {
        require(msg.value == balanceToDeposit, "incorrect balance deposit");
        require(newBuyAmount >= 10000000000000, "newBuyAmountTooLow");
        require(strategyId < strategyCounter, "invalid strategyId");
        DCAStructs.DCAStrategy storage strategy = strategies[strategyId];
        require(!strategy.disabled && !strategy.depositsDisabled, "strategy is disabled");
        require(epochsToBuy >= 1, "must buy at least 1 full epoch");

        DCAStructs.UserBuyInfo storage userInfo = userBuyInfos[msg.sender][strategyId];
        if (userInfo.perBuyAmount != 0) { // existing strategy, must withdraw all but current active epoch before update

        }
        uint256 currentEpoch = getCurrentEpoch(strategy);
        uint256 balanceRequiredForTransitoryEpoch = userInfo.lastBuyAmountForTransitoryEpoch * strategy.buysPerEpoch;
        uint256 userBuysPerEpoch = newBuyAmount * strategy.buysPerEpoch;
        uint256 newUserBalance = userInfo.buyBalance + balanceToDeposit;
        require(newUserBalance  == (userBuysPerEpoch * epochsToBuy) + balanceRequiredForTransitoryEpoch, "existing balance + deposit does not equal target");
        // don't want to have to deal with remainders so only allow exact deposits
        require((newUserBalance - balanceRequiredForTransitoryEpoch) % userBuysPerEpoch == 0, "not exact epoch deposit");
        userInfo.buyBalance = newUserBalance;
        userInfo.perBuyAmount = newBuyAmount;
        userInfo.enteringEpochId = currentEpoch + 1;

        DCAStructs.BuyEpochInfo storage enteringEpochInfo = buyEpochs[strategyId][currentEpoch + 1];
        if (newBuyAmount > userInfo.lastBuyAmountForTransitoryEpoch) {

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
