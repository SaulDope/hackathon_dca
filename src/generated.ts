import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
  useNetwork,
  useChainId,
  Address,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Counter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const counterABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'strategyId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'strategy',
        internalType: 'struct DCAStructs.DCAStrategy',
        type: 'tuple',
        components: [
          { name: 'paymentToken', internalType: 'address', type: 'address' },
          { name: 'buyingToken', internalType: 'address', type: 'address' },
          { name: 'perPeriodBuy', internalType: 'uint256', type: 'uint256' },
          { name: 'blocksPerPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'buysPerEpoch', internalType: 'uint256', type: 'uint256' },
          { name: 'buyCounter', internalType: 'uint256', type: 'uint256' },
          { name: 'paymentBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'buyingBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'disabled', internalType: 'bool', type: 'bool' },
          { name: 'depositsDisabled', internalType: 'bool', type: 'bool' },
          { name: 'lastBuyBlock', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'NewStrategy',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'strategyId', internalType: 'uint256', type: 'uint256' },
      { name: 'withdrawer', internalType: 'address', type: 'address' },
    ],
    name: 'calculatePurchasesOwedAndBalanceSpent',
    outputs: [
      { name: 'amountOwed', internalType: 'uint256', type: 'uint256' },
      { name: 'amountSpent', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'paymentToken', internalType: 'address', type: 'address' },
      { name: 'buyingToken', internalType: 'address', type: 'address' },
      { name: 'blocksPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: 'buysPerEpoch', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createNewStrategy',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: 'strategy',
        internalType: 'struct DCAStructs.DCAStrategy',
        type: 'tuple',
        components: [
          { name: 'paymentToken', internalType: 'address', type: 'address' },
          { name: 'buyingToken', internalType: 'address', type: 'address' },
          { name: 'perPeriodBuy', internalType: 'uint256', type: 'uint256' },
          { name: 'blocksPerPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'buysPerEpoch', internalType: 'uint256', type: 'uint256' },
          { name: 'buyCounter', internalType: 'uint256', type: 'uint256' },
          { name: 'paymentBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'buyingBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'disabled', internalType: 'bool', type: 'bool' },
          { name: 'depositsDisabled', internalType: 'bool', type: 'bool' },
          { name: 'lastBuyBlock', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getCurrentEpoch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'strategyId', internalType: 'uint256', type: 'uint256' },
      { name: 'withdrawer', internalType: 'address', type: 'address' },
    ],
    name: 'getFinalBuyEpochIdForUser',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: 'strategy',
        internalType: 'struct DCAStructs.DCAStrategy',
        type: 'tuple',
        components: [
          { name: 'paymentToken', internalType: 'address', type: 'address' },
          { name: 'buyingToken', internalType: 'address', type: 'address' },
          { name: 'perPeriodBuy', internalType: 'uint256', type: 'uint256' },
          { name: 'blocksPerPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'buysPerEpoch', internalType: 'uint256', type: 'uint256' },
          { name: 'buyCounter', internalType: 'uint256', type: 'uint256' },
          { name: 'paymentBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'buyingBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'disabled', internalType: 'bool', type: 'bool' },
          { name: 'depositsDisabled', internalType: 'bool', type: 'bool' },
          { name: 'lastBuyBlock', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getRemainingBuysInCurrentEpoch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'firstStrategyId', internalType: 'uint256', type: 'uint256' },
      { name: 'numStrategies', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'listStrategies',
    outputs: [
      {
        name: 'strategyData',
        internalType: 'struct DCAStructs.DCAStrategy[]',
        type: 'tuple[]',
        components: [
          { name: 'paymentToken', internalType: 'address', type: 'address' },
          { name: 'buyingToken', internalType: 'address', type: 'address' },
          { name: 'perPeriodBuy', internalType: 'uint256', type: 'uint256' },
          { name: 'blocksPerPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'buysPerEpoch', internalType: 'uint256', type: 'uint256' },
          { name: 'buyCounter', internalType: 'uint256', type: 'uint256' },
          { name: 'paymentBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'buyingBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'disabled', internalType: 'bool', type: 'bool' },
          { name: 'depositsDisabled', internalType: 'bool', type: 'bool' },
          { name: 'lastBuyBlock', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'strategies',
    outputs: [
      { name: 'paymentToken', internalType: 'address', type: 'address' },
      { name: 'buyingToken', internalType: 'address', type: 'address' },
      { name: 'perPeriodBuy', internalType: 'uint256', type: 'uint256' },
      { name: 'blocksPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: 'buysPerEpoch', internalType: 'uint256', type: 'uint256' },
      { name: 'buyCounter', internalType: 'uint256', type: 'uint256' },
      { name: 'paymentBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'buyingBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'disabled', internalType: 'bool', type: 'bool' },
      { name: 'depositsDisabled', internalType: 'bool', type: 'bool' },
      { name: 'lastBuyBlock', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'strategyCounter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'strategyId', internalType: 'uint256', type: 'uint256' }],
    name: 'triggerStrategyBuy',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'triggererAddress', internalType: 'address', type: 'address' },
      { name: 'updateTo', internalType: 'bool', type: 'bool' },
    ],
    name: 'updateAllowedTriggerStrategyAddress',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'userBuyInfos',
    outputs: [
      { name: 'perBuyAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'buyBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'enteringEpochId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'lastBuyAmountForTransitoryEpoch',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'strategyId', internalType: 'uint256', type: 'uint256' },
      { name: 'newBuyAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'balanceToDeposit', internalType: 'uint256', type: 'uint256' },
      { name: 'epochsToBuy', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'userUpdateStrategy',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'strategyId', internalType: 'uint256', type: 'uint256' },
      { name: 'withdrawer', internalType: 'address', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DeCA
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export const deCaABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'strategyId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'strategy',
        internalType: 'struct DCAStructs.DCAStrategy',
        type: 'tuple',
        components: [
          { name: 'paymentToken', internalType: 'address', type: 'address' },
          { name: 'buyingToken', internalType: 'address', type: 'address' },
          { name: 'perPeriodBuy', internalType: 'uint256', type: 'uint256' },
          { name: 'blocksPerPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'buysPerEpoch', internalType: 'uint256', type: 'uint256' },
          { name: 'buyCounter', internalType: 'uint256', type: 'uint256' },
          { name: 'paymentBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'buyingBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'poolFee', internalType: 'uint256', type: 'uint256' },
          { name: 'disabled', internalType: 'bool', type: 'bool' },
          { name: 'depositsDisabled', internalType: 'bool', type: 'bool' },
          { name: 'lastBuyBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'minUserBuy', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'NewStrategy',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'strategyId', internalType: 'uint256', type: 'uint256' },
      { name: 'withdrawer', internalType: 'address', type: 'address' },
    ],
    name: 'calculatePurchasesOwedAndBalanceSpent',
    outputs: [
      { name: 'amountOwed', internalType: 'uint256', type: 'uint256' },
      { name: 'amountSpent', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'paymentToken', internalType: 'address', type: 'address' },
      { name: 'buyingToken', internalType: 'address', type: 'address' },
      { name: 'blocksPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: 'buysPerEpoch', internalType: 'uint256', type: 'uint256' },
      { name: 'poolFee', internalType: 'uint256', type: 'uint256' },
      { name: 'minUserBuy', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createNewStrategy',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: 'strategy',
        internalType: 'struct DCAStructs.DCAStrategy',
        type: 'tuple',
        components: [
          { name: 'paymentToken', internalType: 'address', type: 'address' },
          { name: 'buyingToken', internalType: 'address', type: 'address' },
          { name: 'perPeriodBuy', internalType: 'uint256', type: 'uint256' },
          { name: 'blocksPerPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'buysPerEpoch', internalType: 'uint256', type: 'uint256' },
          { name: 'buyCounter', internalType: 'uint256', type: 'uint256' },
          { name: 'paymentBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'buyingBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'poolFee', internalType: 'uint256', type: 'uint256' },
          { name: 'disabled', internalType: 'bool', type: 'bool' },
          { name: 'depositsDisabled', internalType: 'bool', type: 'bool' },
          { name: 'lastBuyBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'minUserBuy', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getCurrentEpoch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'strategyId', internalType: 'uint256', type: 'uint256' },
      { name: 'withdrawer', internalType: 'address', type: 'address' },
    ],
    name: 'getFinalBuyEpochIdForUser',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      {
        name: 'strategy',
        internalType: 'struct DCAStructs.DCAStrategy',
        type: 'tuple',
        components: [
          { name: 'paymentToken', internalType: 'address', type: 'address' },
          { name: 'buyingToken', internalType: 'address', type: 'address' },
          { name: 'perPeriodBuy', internalType: 'uint256', type: 'uint256' },
          { name: 'blocksPerPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'buysPerEpoch', internalType: 'uint256', type: 'uint256' },
          { name: 'buyCounter', internalType: 'uint256', type: 'uint256' },
          { name: 'paymentBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'buyingBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'poolFee', internalType: 'uint256', type: 'uint256' },
          { name: 'disabled', internalType: 'bool', type: 'bool' },
          { name: 'depositsDisabled', internalType: 'bool', type: 'bool' },
          { name: 'lastBuyBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'minUserBuy', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getRemainingBuysInCurrentEpoch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'firstStrategyId', internalType: 'uint256', type: 'uint256' },
      { name: 'numStrategies', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'listStrategies',
    outputs: [
      {
        name: 'strategyData',
        internalType: 'struct DCAStructs.DCAStrategy[]',
        type: 'tuple[]',
        components: [
          { name: 'paymentToken', internalType: 'address', type: 'address' },
          { name: 'buyingToken', internalType: 'address', type: 'address' },
          { name: 'perPeriodBuy', internalType: 'uint256', type: 'uint256' },
          { name: 'blocksPerPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'buysPerEpoch', internalType: 'uint256', type: 'uint256' },
          { name: 'buyCounter', internalType: 'uint256', type: 'uint256' },
          { name: 'paymentBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'buyingBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'poolFee', internalType: 'uint256', type: 'uint256' },
          { name: 'disabled', internalType: 'bool', type: 'bool' },
          { name: 'depositsDisabled', internalType: 'bool', type: 'bool' },
          { name: 'lastBuyBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'minUserBuy', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'listUserPositions',
    outputs: [
      {
        name: 'userPositions',
        internalType: 'struct DCAStructs.ExternalReadUserInfo[]',
        type: 'tuple[]',
        components: [
          { name: 'perBuyAmount', internalType: 'uint256', type: 'uint256' },
          {
            name: 'originalPaymentBalance',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'enteringEpochId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'lastBuyAmountForTransitoryEpoch',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'buyingTokenOwed', internalType: 'uint256', type: 'uint256' },
          {
            name: 'payingBalanceRemaining',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymentToken', internalType: 'address', type: 'address' },
          { name: 'buyingToken', internalType: 'address', type: 'address' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'strategies',
    outputs: [
      { name: 'paymentToken', internalType: 'address', type: 'address' },
      { name: 'buyingToken', internalType: 'address', type: 'address' },
      { name: 'perPeriodBuy', internalType: 'uint256', type: 'uint256' },
      { name: 'blocksPerPeriod', internalType: 'uint256', type: 'uint256' },
      { name: 'buysPerEpoch', internalType: 'uint256', type: 'uint256' },
      { name: 'buyCounter', internalType: 'uint256', type: 'uint256' },
      { name: 'paymentBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'buyingBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'poolFee', internalType: 'uint256', type: 'uint256' },
      { name: 'disabled', internalType: 'bool', type: 'bool' },
      { name: 'depositsDisabled', internalType: 'bool', type: 'bool' },
      { name: 'lastBuyBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'minUserBuy', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'strategyCounter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'strategyId', internalType: 'uint256', type: 'uint256' }],
    name: 'triggerStrategyBuy',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'triggererAddress', internalType: 'address', type: 'address' },
      { name: 'updateTo', internalType: 'bool', type: 'bool' },
    ],
    name: 'updateAllowedTriggerStrategyAddress',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'userBuyInfos',
    outputs: [
      { name: 'perBuyAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'buyBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'enteringEpochId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'lastBuyAmountForTransitoryEpoch',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'strategyId', internalType: 'uint256', type: 'uint256' },
      { name: 'newBuyAmount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'desiredPaymentBalance',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'epochsToBuy', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'userUpdateStrategy',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'strategyId', internalType: 'uint256', type: 'uint256' },
      { name: 'withdrawer', internalType: 'address', type: 'address' },
      { name: 'shouldWithdrawRemaining', internalType: 'bool', type: 'bool' },
    ],
    name: 'withdrawOrCollect',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export const deCaAddress = {
  1: '0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac',
  5: '0x78991BB1D194C1235fe285240af8489CFA552151',
  31337: '0xbe18A1B61ceaF59aEB6A9bC81AB4FB87D56Ba167',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export const deCaConfig = { address: deCaAddress, abi: deCaABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20ABI = [
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155ErrorsABI = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20ABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20ErrorsABI = [
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Metadata
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20MetadataABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC721Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc721ErrorsABI = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ISwapRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iSwapRouterABI = [
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ISwapRouter.ExactInputParams',
        type: 'tuple',
        components: [
          { name: 'path', internalType: 'bytes', type: 'bytes' },
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
          {
            name: 'amountOutMinimum',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'exactInput',
    outputs: [{ name: 'amountOut', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ISwapRouter.ExactInputSingleParams',
        type: 'tuple',
        components: [
          { name: 'tokenIn', internalType: 'address', type: 'address' },
          { name: 'tokenOut', internalType: 'address', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
          {
            name: 'amountOutMinimum',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'sqrtPriceLimitX96',
            internalType: 'uint160',
            type: 'uint160',
          },
        ],
      },
    ],
    name: 'exactInputSingle',
    outputs: [{ name: 'amountOut', internalType: 'uint256', type: 'uint256' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Test
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const testABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_address',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_bytes32',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_named_address',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'val',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'log_named_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'val',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
    ],
    name: 'log_named_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'val',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'log_named_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_named_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_named_bytes32',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'int256', type: 'int256', indexed: false },
      {
        name: 'decimals',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'log_named_decimal_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'decimals',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'log_named_decimal_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_named_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_named_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_named_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'logs',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'IS_TEST',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'failed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link counterABI}__.
 */
export function useCounterRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof counterABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: counterABI,
    ...config,
  } as UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"calculatePurchasesOwedAndBalanceSpent"`.
 */
export function useCounterCalculatePurchasesOwedAndBalanceSpent<
  TFunctionName extends 'calculatePurchasesOwedAndBalanceSpent',
  TSelectData = ReadContractResult<typeof counterABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: counterABI,
    functionName: 'calculatePurchasesOwedAndBalanceSpent',
    ...config,
  } as UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"getCurrentEpoch"`.
 */
export function useCounterGetCurrentEpoch<
  TFunctionName extends 'getCurrentEpoch',
  TSelectData = ReadContractResult<typeof counterABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: counterABI,
    functionName: 'getCurrentEpoch',
    ...config,
  } as UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"getFinalBuyEpochIdForUser"`.
 */
export function useCounterGetFinalBuyEpochIdForUser<
  TFunctionName extends 'getFinalBuyEpochIdForUser',
  TSelectData = ReadContractResult<typeof counterABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: counterABI,
    functionName: 'getFinalBuyEpochIdForUser',
    ...config,
  } as UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"getRemainingBuysInCurrentEpoch"`.
 */
export function useCounterGetRemainingBuysInCurrentEpoch<
  TFunctionName extends 'getRemainingBuysInCurrentEpoch',
  TSelectData = ReadContractResult<typeof counterABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: counterABI,
    functionName: 'getRemainingBuysInCurrentEpoch',
    ...config,
  } as UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"listStrategies"`.
 */
export function useCounterListStrategies<
  TFunctionName extends 'listStrategies',
  TSelectData = ReadContractResult<typeof counterABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: counterABI,
    functionName: 'listStrategies',
    ...config,
  } as UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"owner"`.
 */
export function useCounterOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof counterABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: counterABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"strategies"`.
 */
export function useCounterStrategies<
  TFunctionName extends 'strategies',
  TSelectData = ReadContractResult<typeof counterABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: counterABI,
    functionName: 'strategies',
    ...config,
  } as UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"strategyCounter"`.
 */
export function useCounterStrategyCounter<
  TFunctionName extends 'strategyCounter',
  TSelectData = ReadContractResult<typeof counterABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: counterABI,
    functionName: 'strategyCounter',
    ...config,
  } as UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"userBuyInfos"`.
 */
export function useCounterUserBuyInfos<
  TFunctionName extends 'userBuyInfos',
  TSelectData = ReadContractResult<typeof counterABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: counterABI,
    functionName: 'userBuyInfos',
    ...config,
  } as UseContractReadConfig<typeof counterABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link counterABI}__.
 */
export function useCounterWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof counterABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof counterABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof counterABI, TFunctionName, TMode>({
    abi: counterABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"createNewStrategy"`.
 */
export function useCounterCreateNewStrategy<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof counterABI,
          'createNewStrategy'
        >['request']['abi'],
        'createNewStrategy',
        TMode
      > & { functionName?: 'createNewStrategy' }
    : UseContractWriteConfig<typeof counterABI, 'createNewStrategy', TMode> & {
        abi?: never
        functionName?: 'createNewStrategy'
      } = {} as any,
) {
  return useContractWrite<typeof counterABI, 'createNewStrategy', TMode>({
    abi: counterABI,
    functionName: 'createNewStrategy',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"triggerStrategyBuy"`.
 */
export function useCounterTriggerStrategyBuy<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof counterABI,
          'triggerStrategyBuy'
        >['request']['abi'],
        'triggerStrategyBuy',
        TMode
      > & { functionName?: 'triggerStrategyBuy' }
    : UseContractWriteConfig<typeof counterABI, 'triggerStrategyBuy', TMode> & {
        abi?: never
        functionName?: 'triggerStrategyBuy'
      } = {} as any,
) {
  return useContractWrite<typeof counterABI, 'triggerStrategyBuy', TMode>({
    abi: counterABI,
    functionName: 'triggerStrategyBuy',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"updateAllowedTriggerStrategyAddress"`.
 */
export function useCounterUpdateAllowedTriggerStrategyAddress<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof counterABI,
          'updateAllowedTriggerStrategyAddress'
        >['request']['abi'],
        'updateAllowedTriggerStrategyAddress',
        TMode
      > & { functionName?: 'updateAllowedTriggerStrategyAddress' }
    : UseContractWriteConfig<
        typeof counterABI,
        'updateAllowedTriggerStrategyAddress',
        TMode
      > & {
        abi?: never
        functionName?: 'updateAllowedTriggerStrategyAddress'
      } = {} as any,
) {
  return useContractWrite<
    typeof counterABI,
    'updateAllowedTriggerStrategyAddress',
    TMode
  >({
    abi: counterABI,
    functionName: 'updateAllowedTriggerStrategyAddress',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"userUpdateStrategy"`.
 */
export function useCounterUserUpdateStrategy<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof counterABI,
          'userUpdateStrategy'
        >['request']['abi'],
        'userUpdateStrategy',
        TMode
      > & { functionName?: 'userUpdateStrategy' }
    : UseContractWriteConfig<typeof counterABI, 'userUpdateStrategy', TMode> & {
        abi?: never
        functionName?: 'userUpdateStrategy'
      } = {} as any,
) {
  return useContractWrite<typeof counterABI, 'userUpdateStrategy', TMode>({
    abi: counterABI,
    functionName: 'userUpdateStrategy',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"withdraw"`.
 */
export function useCounterWithdraw<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof counterABI,
          'withdraw'
        >['request']['abi'],
        'withdraw',
        TMode
      > & { functionName?: 'withdraw' }
    : UseContractWriteConfig<typeof counterABI, 'withdraw', TMode> & {
        abi?: never
        functionName?: 'withdraw'
      } = {} as any,
) {
  return useContractWrite<typeof counterABI, 'withdraw', TMode>({
    abi: counterABI,
    functionName: 'withdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link counterABI}__.
 */
export function usePrepareCounterWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof counterABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: counterABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof counterABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"createNewStrategy"`.
 */
export function usePrepareCounterCreateNewStrategy(
  config: Omit<
    UsePrepareContractWriteConfig<typeof counterABI, 'createNewStrategy'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: counterABI,
    functionName: 'createNewStrategy',
    ...config,
  } as UsePrepareContractWriteConfig<typeof counterABI, 'createNewStrategy'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"triggerStrategyBuy"`.
 */
export function usePrepareCounterTriggerStrategyBuy(
  config: Omit<
    UsePrepareContractWriteConfig<typeof counterABI, 'triggerStrategyBuy'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: counterABI,
    functionName: 'triggerStrategyBuy',
    ...config,
  } as UsePrepareContractWriteConfig<typeof counterABI, 'triggerStrategyBuy'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"updateAllowedTriggerStrategyAddress"`.
 */
export function usePrepareCounterUpdateAllowedTriggerStrategyAddress(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof counterABI,
      'updateAllowedTriggerStrategyAddress'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: counterABI,
    functionName: 'updateAllowedTriggerStrategyAddress',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof counterABI,
    'updateAllowedTriggerStrategyAddress'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"userUpdateStrategy"`.
 */
export function usePrepareCounterUserUpdateStrategy(
  config: Omit<
    UsePrepareContractWriteConfig<typeof counterABI, 'userUpdateStrategy'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: counterABI,
    functionName: 'userUpdateStrategy',
    ...config,
  } as UsePrepareContractWriteConfig<typeof counterABI, 'userUpdateStrategy'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"withdraw"`.
 */
export function usePrepareCounterWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof counterABI, 'withdraw'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: counterABI,
    functionName: 'withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof counterABI, 'withdraw'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link counterABI}__.
 */
export function useCounterEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof counterABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: counterABI,
    ...config,
  } as UseContractEventConfig<typeof counterABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link counterABI}__ and `eventName` set to `"NewStrategy"`.
 */
export function useCounterNewStrategyEvent(
  config: Omit<
    UseContractEventConfig<typeof counterABI, 'NewStrategy'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: counterABI,
    eventName: 'NewStrategy',
    ...config,
  } as UseContractEventConfig<typeof counterABI, 'NewStrategy'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof deCaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"calculatePurchasesOwedAndBalanceSpent"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaCalculatePurchasesOwedAndBalanceSpent<
  TFunctionName extends 'calculatePurchasesOwedAndBalanceSpent',
  TSelectData = ReadContractResult<typeof deCaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'calculatePurchasesOwedAndBalanceSpent',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"getCurrentEpoch"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaGetCurrentEpoch<
  TFunctionName extends 'getCurrentEpoch',
  TSelectData = ReadContractResult<typeof deCaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'getCurrentEpoch',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"getFinalBuyEpochIdForUser"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaGetFinalBuyEpochIdForUser<
  TFunctionName extends 'getFinalBuyEpochIdForUser',
  TSelectData = ReadContractResult<typeof deCaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'getFinalBuyEpochIdForUser',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"getRemainingBuysInCurrentEpoch"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaGetRemainingBuysInCurrentEpoch<
  TFunctionName extends 'getRemainingBuysInCurrentEpoch',
  TSelectData = ReadContractResult<typeof deCaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'getRemainingBuysInCurrentEpoch',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"listStrategies"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaListStrategies<
  TFunctionName extends 'listStrategies',
  TSelectData = ReadContractResult<typeof deCaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'listStrategies',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"listUserPositions"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaListUserPositions<
  TFunctionName extends 'listUserPositions',
  TSelectData = ReadContractResult<typeof deCaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'listUserPositions',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"owner"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof deCaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"strategies"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaStrategies<
  TFunctionName extends 'strategies',
  TSelectData = ReadContractResult<typeof deCaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'strategies',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"strategyCounter"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaStrategyCounter<
  TFunctionName extends 'strategyCounter',
  TSelectData = ReadContractResult<typeof deCaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'strategyCounter',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"userBuyInfos"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaUserBuyInfos<
  TFunctionName extends 'userBuyInfos',
  TSelectData = ReadContractResult<typeof deCaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'userBuyInfos',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof deCaAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof deCaABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof deCaABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof deCaABI, TFunctionName, TMode>({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"createNewStrategy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaCreateNewStrategy<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof deCaAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof deCaABI,
          'createNewStrategy'
        >['request']['abi'],
        'createNewStrategy',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'createNewStrategy'
      }
    : UseContractWriteConfig<typeof deCaABI, 'createNewStrategy', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createNewStrategy'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof deCaABI, 'createNewStrategy', TMode>({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'createNewStrategy',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"triggerStrategyBuy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaTriggerStrategyBuy<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof deCaAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof deCaABI,
          'triggerStrategyBuy'
        >['request']['abi'],
        'triggerStrategyBuy',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'triggerStrategyBuy'
      }
    : UseContractWriteConfig<typeof deCaABI, 'triggerStrategyBuy', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'triggerStrategyBuy'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof deCaABI, 'triggerStrategyBuy', TMode>({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'triggerStrategyBuy',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"updateAllowedTriggerStrategyAddress"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaUpdateAllowedTriggerStrategyAddress<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof deCaAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof deCaABI,
          'updateAllowedTriggerStrategyAddress'
        >['request']['abi'],
        'updateAllowedTriggerStrategyAddress',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'updateAllowedTriggerStrategyAddress'
      }
    : UseContractWriteConfig<
        typeof deCaABI,
        'updateAllowedTriggerStrategyAddress',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateAllowedTriggerStrategyAddress'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<
    typeof deCaABI,
    'updateAllowedTriggerStrategyAddress',
    TMode
  >({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'updateAllowedTriggerStrategyAddress',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"userUpdateStrategy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaUserUpdateStrategy<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof deCaAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof deCaABI,
          'userUpdateStrategy'
        >['request']['abi'],
        'userUpdateStrategy',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'userUpdateStrategy'
      }
    : UseContractWriteConfig<typeof deCaABI, 'userUpdateStrategy', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'userUpdateStrategy'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof deCaABI, 'userUpdateStrategy', TMode>({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'userUpdateStrategy',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"withdrawOrCollect"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaWithdrawOrCollect<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof deCaAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof deCaABI,
          'withdrawOrCollect'
        >['request']['abi'],
        'withdrawOrCollect',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'withdrawOrCollect'
      }
    : UseContractWriteConfig<typeof deCaABI, 'withdrawOrCollect', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdrawOrCollect'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof deCaABI, 'withdrawOrCollect', TMode>({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'withdrawOrCollect',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function usePrepareDeCaWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deCaABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof deCaABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"createNewStrategy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function usePrepareDeCaCreateNewStrategy(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deCaABI, 'createNewStrategy'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'createNewStrategy',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deCaABI, 'createNewStrategy'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"triggerStrategyBuy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function usePrepareDeCaTriggerStrategyBuy(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deCaABI, 'triggerStrategyBuy'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'triggerStrategyBuy',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deCaABI, 'triggerStrategyBuy'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"updateAllowedTriggerStrategyAddress"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function usePrepareDeCaUpdateAllowedTriggerStrategyAddress(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof deCaABI,
      'updateAllowedTriggerStrategyAddress'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'updateAllowedTriggerStrategyAddress',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof deCaABI,
    'updateAllowedTriggerStrategyAddress'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"userUpdateStrategy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function usePrepareDeCaUserUpdateStrategy(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deCaABI, 'userUpdateStrategy'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'userUpdateStrategy',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deCaABI, 'userUpdateStrategy'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"withdrawOrCollect"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function usePrepareDeCaWithdrawOrCollect(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deCaABI, 'withdrawOrCollect'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    functionName: 'withdrawOrCollect',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deCaABI, 'withdrawOrCollect'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link deCaABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof deCaABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    ...config,
  } as UseContractEventConfig<typeof deCaABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link deCaABI}__ and `eventName` set to `"NewStrategy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeCaNewStrategyEvent(
  config: Omit<
    UseContractEventConfig<typeof deCaABI, 'NewStrategy'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: deCaABI,
    address: deCaAddress[chainId as keyof typeof deCaAddress],
    eventName: 'NewStrategy',
    ...config,
  } as UseContractEventConfig<typeof deCaABI, 'NewStrategy'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: erc20ABI, ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"allowance"`.
 */
export function useErc20Allowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useErc20BalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"decimals"`.
 */
export function useErc20Decimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"name"`.
 */
export function useErc20Name<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"symbol"`.
 */
export function useErc20Symbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useErc20TotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof erc20ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, TFunctionName, TMode>({
    abi: erc20ABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function useErc20Approve<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof erc20ABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'approve', TMode>({
    abi: erc20ABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function useErc20Transfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          'transfer'
        >['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof erc20ABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'transfer', TMode>({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useErc20TransferFrom<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof erc20ABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'transferFrom', TMode>({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function usePrepareErc20Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareErc20Approve(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareErc20Transfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareErc20TransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'transferFrom'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Event<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: erc20ABI,
    ...config,
  } as UseContractEventConfig<typeof erc20ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Approval"`.
 */
export function useErc20ApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, 'Approval'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: erc20ABI,
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof erc20ABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Transfer"`.
 */
export function useErc20TransferEvent(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, 'Transfer'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: erc20ABI,
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof erc20ABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20ABI}__.
 */
export function useIerc20Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof ierc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20ABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: ierc20ABI, ...config } as UseContractReadConfig<
    typeof ierc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20ABI}__ and `functionName` set to `"allowance"`.
 */
export function useIerc20Allowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof ierc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: ierc20ABI,
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof ierc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useIerc20BalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof ierc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: ierc20ABI,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof ierc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20ABI}__ and `functionName` set to `"decimals"`.
 */
export function useIerc20Decimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof ierc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: ierc20ABI,
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof ierc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20ABI}__ and `functionName` set to `"name"`.
 */
export function useIerc20Name<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof ierc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: ierc20ABI,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof ierc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20ABI}__ and `functionName` set to `"symbol"`.
 */
export function useIerc20Symbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof ierc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: ierc20ABI,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof ierc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20ABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useIerc20TotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof ierc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: ierc20ABI,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof ierc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ierc20ABI}__.
 */
export function useIerc20Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof ierc20ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof ierc20ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof ierc20ABI, TFunctionName, TMode>({
    abi: ierc20ABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ierc20ABI}__ and `functionName` set to `"approve"`.
 */
export function useIerc20Approve<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof ierc20ABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof ierc20ABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof ierc20ABI, 'approve', TMode>({
    abi: ierc20ABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ierc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function useIerc20Transfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof ierc20ABI,
          'transfer'
        >['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof ierc20ABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof ierc20ABI, 'transfer', TMode>({
    abi: ierc20ABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ierc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useIerc20TransferFrom<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof ierc20ABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof ierc20ABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof ierc20ABI, 'transferFrom', TMode>({
    abi: ierc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ierc20ABI}__.
 */
export function usePrepareIerc20Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ierc20ABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: ierc20ABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof ierc20ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ierc20ABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareIerc20Approve(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ierc20ABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: ierc20ABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ierc20ABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ierc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareIerc20Transfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ierc20ABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: ierc20ABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ierc20ABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ierc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareIerc20TransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ierc20ABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: ierc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ierc20ABI, 'transferFrom'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link ierc20ABI}__.
 */
export function useIerc20Event<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof ierc20ABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: ierc20ABI,
    ...config,
  } as UseContractEventConfig<typeof ierc20ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link ierc20ABI}__ and `eventName` set to `"Approval"`.
 */
export function useIerc20ApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof ierc20ABI, 'Approval'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: ierc20ABI,
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof ierc20ABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link ierc20ABI}__ and `eventName` set to `"Transfer"`.
 */
export function useIerc20TransferEvent(
  config: Omit<
    UseContractEventConfig<typeof ierc20ABI, 'Transfer'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: ierc20ABI,
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof ierc20ABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20MetadataABI}__.
 */
export function useIerc20MetadataRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof ierc20MetadataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20MetadataABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: ierc20MetadataABI,
    ...config,
  } as UseContractReadConfig<
    typeof ierc20MetadataABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20MetadataABI}__ and `functionName` set to `"allowance"`.
 */
export function useIerc20MetadataAllowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof ierc20MetadataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20MetadataABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: ierc20MetadataABI,
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<
    typeof ierc20MetadataABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20MetadataABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useIerc20MetadataBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof ierc20MetadataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20MetadataABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: ierc20MetadataABI,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<
    typeof ierc20MetadataABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20MetadataABI}__ and `functionName` set to `"decimals"`.
 */
export function useIerc20MetadataDecimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof ierc20MetadataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20MetadataABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: ierc20MetadataABI,
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<
    typeof ierc20MetadataABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20MetadataABI}__ and `functionName` set to `"name"`.
 */
export function useIerc20MetadataName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof ierc20MetadataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20MetadataABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: ierc20MetadataABI,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<
    typeof ierc20MetadataABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20MetadataABI}__ and `functionName` set to `"symbol"`.
 */
export function useIerc20MetadataSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof ierc20MetadataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20MetadataABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: ierc20MetadataABI,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<
    typeof ierc20MetadataABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ierc20MetadataABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useIerc20MetadataTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof ierc20MetadataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ierc20MetadataABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: ierc20MetadataABI,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<
    typeof ierc20MetadataABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ierc20MetadataABI}__.
 */
export function useIerc20MetadataWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof ierc20MetadataABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof ierc20MetadataABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof ierc20MetadataABI, TFunctionName, TMode>({
    abi: ierc20MetadataABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ierc20MetadataABI}__ and `functionName` set to `"approve"`.
 */
export function useIerc20MetadataApprove<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof ierc20MetadataABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof ierc20MetadataABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof ierc20MetadataABI, 'approve', TMode>({
    abi: ierc20MetadataABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ierc20MetadataABI}__ and `functionName` set to `"transfer"`.
 */
export function useIerc20MetadataTransfer<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof ierc20MetadataABI,
          'transfer'
        >['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof ierc20MetadataABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof ierc20MetadataABI, 'transfer', TMode>({
    abi: ierc20MetadataABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ierc20MetadataABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useIerc20MetadataTransferFrom<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof ierc20MetadataABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<
        typeof ierc20MetadataABI,
        'transferFrom',
        TMode
      > & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof ierc20MetadataABI, 'transferFrom', TMode>({
    abi: ierc20MetadataABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ierc20MetadataABI}__.
 */
export function usePrepareIerc20MetadataWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ierc20MetadataABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: ierc20MetadataABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof ierc20MetadataABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ierc20MetadataABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareIerc20MetadataApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ierc20MetadataABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: ierc20MetadataABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ierc20MetadataABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ierc20MetadataABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareIerc20MetadataTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ierc20MetadataABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: ierc20MetadataABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ierc20MetadataABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ierc20MetadataABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareIerc20MetadataTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ierc20MetadataABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: ierc20MetadataABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ierc20MetadataABI, 'transferFrom'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link ierc20MetadataABI}__.
 */
export function useIerc20MetadataEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof ierc20MetadataABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: ierc20MetadataABI,
    ...config,
  } as UseContractEventConfig<typeof ierc20MetadataABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link ierc20MetadataABI}__ and `eventName` set to `"Approval"`.
 */
export function useIerc20MetadataApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof ierc20MetadataABI, 'Approval'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: ierc20MetadataABI,
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof ierc20MetadataABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link ierc20MetadataABI}__ and `eventName` set to `"Transfer"`.
 */
export function useIerc20MetadataTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof ierc20MetadataABI, 'Transfer'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: ierc20MetadataABI,
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof ierc20MetadataABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iSwapRouterABI}__.
 */
export function useISwapRouterWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iSwapRouterABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof iSwapRouterABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof iSwapRouterABI, TFunctionName, TMode>({
    abi: iSwapRouterABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iSwapRouterABI}__ and `functionName` set to `"exactInput"`.
 */
export function useISwapRouterExactInput<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iSwapRouterABI,
          'exactInput'
        >['request']['abi'],
        'exactInput',
        TMode
      > & { functionName?: 'exactInput' }
    : UseContractWriteConfig<typeof iSwapRouterABI, 'exactInput', TMode> & {
        abi?: never
        functionName?: 'exactInput'
      } = {} as any,
) {
  return useContractWrite<typeof iSwapRouterABI, 'exactInput', TMode>({
    abi: iSwapRouterABI,
    functionName: 'exactInput',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iSwapRouterABI}__ and `functionName` set to `"exactInputSingle"`.
 */
export function useISwapRouterExactInputSingle<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iSwapRouterABI,
          'exactInputSingle'
        >['request']['abi'],
        'exactInputSingle',
        TMode
      > & { functionName?: 'exactInputSingle' }
    : UseContractWriteConfig<
        typeof iSwapRouterABI,
        'exactInputSingle',
        TMode
      > & {
        abi?: never
        functionName?: 'exactInputSingle'
      } = {} as any,
) {
  return useContractWrite<typeof iSwapRouterABI, 'exactInputSingle', TMode>({
    abi: iSwapRouterABI,
    functionName: 'exactInputSingle',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iSwapRouterABI}__.
 */
export function usePrepareISwapRouterWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iSwapRouterABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iSwapRouterABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof iSwapRouterABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iSwapRouterABI}__ and `functionName` set to `"exactInput"`.
 */
export function usePrepareISwapRouterExactInput(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iSwapRouterABI, 'exactInput'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iSwapRouterABI,
    functionName: 'exactInput',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iSwapRouterABI, 'exactInput'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iSwapRouterABI}__ and `functionName` set to `"exactInputSingle"`.
 */
export function usePrepareISwapRouterExactInputSingle(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iSwapRouterABI, 'exactInputSingle'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iSwapRouterABI,
    functionName: 'exactInputSingle',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iSwapRouterABI, 'exactInputSingle'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link testABI}__.
 */
export function useTestRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof testABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof testABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: testABI, ...config } as UseContractReadConfig<
    typeof testABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link testABI}__ and `functionName` set to `"IS_TEST"`.
 */
export function useTestIsTest<
  TFunctionName extends 'IS_TEST',
  TSelectData = ReadContractResult<typeof testABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof testABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: testABI,
    functionName: 'IS_TEST',
    ...config,
  } as UseContractReadConfig<typeof testABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link testABI}__.
 */
export function useTestWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof testABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof testABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof testABI, TFunctionName, TMode>({
    abi: testABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link testABI}__ and `functionName` set to `"failed"`.
 */
export function useTestFailed<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof testABI, 'failed'>['request']['abi'],
        'failed',
        TMode
      > & { functionName?: 'failed' }
    : UseContractWriteConfig<typeof testABI, 'failed', TMode> & {
        abi?: never
        functionName?: 'failed'
      } = {} as any,
) {
  return useContractWrite<typeof testABI, 'failed', TMode>({
    abi: testABI,
    functionName: 'failed',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link testABI}__.
 */
export function usePrepareTestWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof testABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: testABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof testABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link testABI}__ and `functionName` set to `"failed"`.
 */
export function usePrepareTestFailed(
  config: Omit<
    UsePrepareContractWriteConfig<typeof testABI, 'failed'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: testABI,
    functionName: 'failed',
    ...config,
  } as UsePrepareContractWriteConfig<typeof testABI, 'failed'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__.
 */
export function useTestEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof testABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({ abi: testABI, ...config } as UseContractEventConfig<
    typeof testABI,
    TEventName
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log"`.
 */
export function useTestLogEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_address"`.
 */
export function useTestLogAddressEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_address'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_address',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_address'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_array"`.
 */
export function useTestLogArrayEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_array'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_array',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_array'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_bytes"`.
 */
export function useTestLogBytesEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_bytes'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_bytes',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_bytes'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_bytes32"`.
 */
export function useTestLogBytes32Event(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_bytes32'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_bytes32',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_bytes32'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_int"`.
 */
export function useTestLogIntEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_int'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_int',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_int'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_named_address"`.
 */
export function useTestLogNamedAddressEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_named_address'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_named_address',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_named_address'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_named_array"`.
 */
export function useTestLogNamedArrayEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_named_array'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_named_array',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_named_array'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_named_bytes"`.
 */
export function useTestLogNamedBytesEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_named_bytes'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_named_bytes',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_named_bytes'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_named_bytes32"`.
 */
export function useTestLogNamedBytes32Event(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_named_bytes32'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_named_bytes32',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_named_bytes32'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_named_decimal_int"`.
 */
export function useTestLogNamedDecimalIntEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_named_decimal_int'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_named_decimal_int',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_named_decimal_int'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_named_decimal_uint"`.
 */
export function useTestLogNamedDecimalUintEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_named_decimal_uint'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_named_decimal_uint',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_named_decimal_uint'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_named_int"`.
 */
export function useTestLogNamedIntEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_named_int'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_named_int',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_named_int'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_named_string"`.
 */
export function useTestLogNamedStringEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_named_string'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_named_string',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_named_string'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_named_uint"`.
 */
export function useTestLogNamedUintEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_named_uint'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_named_uint',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_named_uint'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_string"`.
 */
export function useTestLogStringEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_string'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_string',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_string'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"log_uint"`.
 */
export function useTestLogUintEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'log_uint'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'log_uint',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'log_uint'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link testABI}__ and `eventName` set to `"logs"`.
 */
export function useTestLogsEvent(
  config: Omit<
    UseContractEventConfig<typeof testABI, 'logs'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: testABI,
    eventName: 'logs',
    ...config,
  } as UseContractEventConfig<typeof testABI, 'logs'>)
}
