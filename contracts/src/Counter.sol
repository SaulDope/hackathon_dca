// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

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
        address paymentToken;
        address buyingToken;
        uint256 perPeriodBuy;
        uint256 blocksPerPeriod;
        uint256 buysPerEpoch;
        uint256 buyCounter;
        uint256 buyBalance;
        bool disabled;
        uint256 lastBuyBlock;
    }
}

contract Counter {
    uint256 public strategyCounter;
    address public owner;
    mapping(uint256 => DCAStructs.DCAStrategy) public strategies;
    mapping(address => mapping(uint256 => DCAStructs.UserBuyInfo)) public userBuyInfos;
    mapping(uint256 => mapping(uint256 => DCAStructs.BuyEpochInfo)) buyEpochs;
    
    event NewStrategy(uint256 strategyId, DCAStructs.DCAStrategy strategy);

    function createNewStrategy(address paymentToken, address buyingToken, uint256 blocksPerPeriod, uint256 buysPerEpoch) public {
        require(msg.sender == owner, "only owner");
        require(buysPerEpoch >= 1, "invalid epoch length");
        strategies[strategyCounter] = DCAStructs.DCAStrategy({
            paymentToken: paymentToken,
            buyingToken: buyingToken,
            perPeriodBuy: 0,
            blocksPerPeriod: blocksPerPeriod,
            buysPerEpoch: buysPerEpoch,
            buyCounter: 0,
            buyBalance: 0,
            disabled: false,
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


    function calculateBalancesOwed(uint256 strategyId, address withdrawer) public view {
        require(strategyId < strategyCounter, "invalid strategyId");
        DCAStructs.DCAStrategy memory strategy = strategies[strategyId];
        DCAStructs.UserBuyInfo memory userInfo = userBuyInfos[withdrawer][strategyId];
        uint256 currentEpoch = getCurrentEpoch(strategy);
        require(currentEpoch > userInfo.enteringEpochId, "can't withdraw yet");
        uint256 amountOwed = 0;
        uint256 amountSpent = 0;
        if (userInfo.lastBuyAmountForTransitoryEpoch != 0) {
            DCAStructs.BuyEpochInfo memory transitoryEpochInfo = buyEpochs[strategyId][userInfo.enteringEpochId - 1];
            amountSpent += userInfo.lastBuyAmountForTransitoryEpoch * strategy.buysPerEpoch;
            amountOwed += calculateUserCut(userInfo.lastBuyAmountForTransitoryEpoch * strategy.buysPerEpoch, transitoryEpochInfo);
        }
        for (uint256 epochId = userInfo.enteringEpochId; epochId < currentEpoch; epochId++) {
            DCAStructs.BuyEpochInfo memory epochInfo = buyEpochs[strategyId][epochId];
            amountSpent += userInfo.perBuyAmount * strategy.buysPerEpoch;
            amountOwed += calculateUserCut(userInfo.perBuyAmount * strategy.buysPerEpoch, epochInfo);
        }

    }

    /*
        calculate amount owed
            loop through past epochs, find percentage of buys owned, DO NOT WITHDRAW FROM ACTIVE EPOCH
        update cliffs
            remove cliff change from the further out cliff (eg if there was 30 epochs left, remove cliff there, move to next + 1)
    */
    function withdraw(uint256 strategyId, address withdrawer) public {
        require(msg.sender == withdrawer, "can't withdraw for someone else!");
        require(strategyId < strategyCounter, "invalid strategyId");
        DCAStructs.DCAStrategy storage strategy = strategies[strategyId];
        DCAStructs.UserBuyInfo storage userInfo = userBuyInfos[msg.sender][strategyId];

    }

    function userUpdateStrategy(uint256 strategyId, uint256 buyAmount, uint256 balanceToDeposit, uint256 epochsToBuy) public payable {
        require(msg.value == balanceToDeposit, "incorrect balance deposit");
        require(buyAmount >= 10000000000000, "buyAmountTooLow");
        require(strategyId < strategyCounter, "invalid strategyId");
        DCAStructs.DCAStrategy storage strategy = strategies[strategyId];
        require(!strategy.disabled, "strategy is disabled");
        require(epochsToBuy >= 1, "must buy at least 1 full epoch");

        DCAStructs.UserBuyInfo storage userInfo = userBuyInfos[msg.sender][strategyId];
        if (userInfo.perBuyAmount != 0) { // existing strategy, must withdraw all but current active epoch before update

        }
        uint256 currentEpoch = getCurrentEpoch(strategy);
        uint256 balanceRequiredForTransitoryEpoch = userInfo.lastBuyAmountForTransitoryEpoch * strategy.buysPerEpoch;
        uint256 userBuysPerEpoch = buyAmount * strategy.buysPerEpoch;
        uint256 newUserBalance = userInfo.buyBalance + balanceToDeposit;
        require(newUserBalance  == (userBuysPerEpoch * epochsToBuy) + balanceRequiredForTransitoryEpoch, "existing balance + deposit does not equal target");
        // don't want to have to deal with remainders so only allow exact deposits
        require((newUserBalance - balanceRequiredForTransitoryEpoch) % userBuysPerEpoch == 0, "not exact epoch deposit");
        userInfo.buyBalance = newUserBalance;
        userInfo.perBuyAmount = buyAmount;
        userInfo.enteringEpochId = currentEpoch + 1;

        DCAStructs.BuyEpochInfo storage enteringEpochInfo = buyEpochs[strategyId][currentEpoch + 1];
        if (buyAmount > userInfo.lastBuyAmountForTransitoryEpoch) {

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
