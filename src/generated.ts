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
// DeDCA
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export const deDcaABI = [
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

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export const deDcaAddress = {
  1: '0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac',
  5: '0x78991BB1D194C1235fe285240af8489CFA552151',
  31337: '0xbe18A1B61ceaF59aEB6A9bC81AB4FB87D56Ba167',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export const deDcaConfig = { address: deDcaAddress, abi: deDcaABI } as const

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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deDcaABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof deDcaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    ...config,
  } as UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"calculatePurchasesOwedAndBalanceSpent"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaCalculatePurchasesOwedAndBalanceSpent<
  TFunctionName extends 'calculatePurchasesOwedAndBalanceSpent',
  TSelectData = ReadContractResult<typeof deDcaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'calculatePurchasesOwedAndBalanceSpent',
    ...config,
  } as UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"getCurrentEpoch"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaGetCurrentEpoch<
  TFunctionName extends 'getCurrentEpoch',
  TSelectData = ReadContractResult<typeof deDcaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'getCurrentEpoch',
    ...config,
  } as UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"getFinalBuyEpochIdForUser"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaGetFinalBuyEpochIdForUser<
  TFunctionName extends 'getFinalBuyEpochIdForUser',
  TSelectData = ReadContractResult<typeof deDcaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'getFinalBuyEpochIdForUser',
    ...config,
  } as UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"getRemainingBuysInCurrentEpoch"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaGetRemainingBuysInCurrentEpoch<
  TFunctionName extends 'getRemainingBuysInCurrentEpoch',
  TSelectData = ReadContractResult<typeof deDcaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'getRemainingBuysInCurrentEpoch',
    ...config,
  } as UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"listStrategies"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaListStrategies<
  TFunctionName extends 'listStrategies',
  TSelectData = ReadContractResult<typeof deDcaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'listStrategies',
    ...config,
  } as UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"owner"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof deDcaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"strategies"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaStrategies<
  TFunctionName extends 'strategies',
  TSelectData = ReadContractResult<typeof deDcaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'strategies',
    ...config,
  } as UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"strategyCounter"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaStrategyCounter<
  TFunctionName extends 'strategyCounter',
  TSelectData = ReadContractResult<typeof deDcaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'strategyCounter',
    ...config,
  } as UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"userBuyInfos"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaUserBuyInfos<
  TFunctionName extends 'userBuyInfos',
  TSelectData = ReadContractResult<typeof deDcaABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'userBuyInfos',
    ...config,
  } as UseContractReadConfig<typeof deDcaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deDcaABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof deDcaAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof deDcaABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof deDcaABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof deDcaABI, TFunctionName, TMode>({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"createNewStrategy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaCreateNewStrategy<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof deDcaAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof deDcaABI,
          'createNewStrategy'
        >['request']['abi'],
        'createNewStrategy',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'createNewStrategy'
      }
    : UseContractWriteConfig<typeof deDcaABI, 'createNewStrategy', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createNewStrategy'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof deDcaABI, 'createNewStrategy', TMode>({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'createNewStrategy',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"triggerStrategyBuy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaTriggerStrategyBuy<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof deDcaAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof deDcaABI,
          'triggerStrategyBuy'
        >['request']['abi'],
        'triggerStrategyBuy',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'triggerStrategyBuy'
      }
    : UseContractWriteConfig<typeof deDcaABI, 'triggerStrategyBuy', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'triggerStrategyBuy'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof deDcaABI, 'triggerStrategyBuy', TMode>({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'triggerStrategyBuy',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"updateAllowedTriggerStrategyAddress"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaUpdateAllowedTriggerStrategyAddress<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof deDcaAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof deDcaABI,
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
        typeof deDcaABI,
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
    typeof deDcaABI,
    'updateAllowedTriggerStrategyAddress',
    TMode
  >({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'updateAllowedTriggerStrategyAddress',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"userUpdateStrategy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaUserUpdateStrategy<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof deDcaAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof deDcaABI,
          'userUpdateStrategy'
        >['request']['abi'],
        'userUpdateStrategy',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'userUpdateStrategy'
      }
    : UseContractWriteConfig<typeof deDcaABI, 'userUpdateStrategy', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'userUpdateStrategy'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof deDcaABI, 'userUpdateStrategy', TMode>({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'userUpdateStrategy',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"withdraw"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaWithdraw<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof deDcaAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof deDcaABI,
          'withdraw'
        >['request']['abi'],
        'withdraw',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'withdraw' }
    : UseContractWriteConfig<typeof deDcaABI, 'withdraw', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdraw'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof deDcaABI, 'withdraw', TMode>({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'withdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deDcaABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function usePrepareDeDcaWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deDcaABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof deDcaABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"createNewStrategy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function usePrepareDeDcaCreateNewStrategy(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deDcaABI, 'createNewStrategy'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'createNewStrategy',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deDcaABI, 'createNewStrategy'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"triggerStrategyBuy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function usePrepareDeDcaTriggerStrategyBuy(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deDcaABI, 'triggerStrategyBuy'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'triggerStrategyBuy',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deDcaABI, 'triggerStrategyBuy'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"updateAllowedTriggerStrategyAddress"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function usePrepareDeDcaUpdateAllowedTriggerStrategyAddress(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof deDcaABI,
      'updateAllowedTriggerStrategyAddress'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'updateAllowedTriggerStrategyAddress',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof deDcaABI,
    'updateAllowedTriggerStrategyAddress'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"userUpdateStrategy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function usePrepareDeDcaUserUpdateStrategy(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deDcaABI, 'userUpdateStrategy'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'userUpdateStrategy',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deDcaABI, 'userUpdateStrategy'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deDcaABI}__ and `functionName` set to `"withdraw"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function usePrepareDeDcaWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deDcaABI, 'withdraw'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    functionName: 'withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deDcaABI, 'withdraw'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link deDcaABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof deDcaABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    ...config,
  } as UseContractEventConfig<typeof deDcaABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link deDcaABI}__ and `eventName` set to `"NewStrategy"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x78991BB1D194C1235fe285240af8489CFA552151)
 * -
 */
export function useDeDcaNewStrategyEvent(
  config: Omit<
    UseContractEventConfig<typeof deDcaABI, 'NewStrategy'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof deDcaAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: deDcaABI,
    address: deDcaAddress[chainId as keyof typeof deDcaAddress],
    eventName: 'NewStrategy',
    ...config,
  } as UseContractEventConfig<typeof deDcaABI, 'NewStrategy'>)
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
