import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  Address,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DeCA
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**

*/
export const deCaABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'message',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'Log',
  },
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

*/
export const deCaAddress = {} as const

/**

*/
export const deCaConfig = { address: deCaAddress, abi: deCaABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DeCAScript
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const deCaScriptABI = [
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'IS_SCRIPT',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'run',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'setUp',
    outputs: [],
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
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ISwapRouter.ExactOutputParams',
        type: 'tuple',
        components: [
          { name: 'path', internalType: 'bytes', type: 'bytes' },
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
          { name: 'amountInMaximum', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'exactOutput',
    outputs: [{ name: 'amountIn', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ISwapRouter.ExactOutputSingleParams',
        type: 'tuple',
        components: [
          { name: 'tokenIn', internalType: 'address', type: 'address' },
          { name: 'tokenOut', internalType: 'address', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
          { name: 'amountInMaximum', internalType: 'uint256', type: 'uint256' },
          {
            name: 'sqrtPriceLimitX96',
            internalType: 'uint160',
            type: 'uint160',
          },
        ],
      },
    ],
    name: 'exactOutputSingle',
    outputs: [{ name: 'amountIn', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'amount0Delta', internalType: 'int256', type: 'int256' },
      { name: 'amount1Delta', internalType: 'int256', type: 'int256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'uniswapV3SwapCallback',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IUniswapV3SwapCallback
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iUniswapV3SwapCallbackABI = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'amount0Delta', internalType: 'int256', type: 'int256' },
      { name: 'amount1Delta', internalType: 'int256', type: 'int256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'uniswapV3SwapCallback',
    outputs: [],
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__.
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
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[undefined],
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"calculatePurchasesOwedAndBalanceSpent"`.
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
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'calculatePurchasesOwedAndBalanceSpent',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"getCurrentEpoch"`.
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
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'getCurrentEpoch',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"getFinalBuyEpochIdForUser"`.
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
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'getFinalBuyEpochIdForUser',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"getRemainingBuysInCurrentEpoch"`.
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
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'getRemainingBuysInCurrentEpoch',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"listStrategies"`.
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
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'listStrategies',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"listUserPositions"`.
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
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'listUserPositions',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"owner"`.
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
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"strategies"`.
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
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'strategies',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"strategyCounter"`.
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
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'strategyCounter',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"userBuyInfos"`.
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
  return useContractRead({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'userBuyInfos',
    ...config,
  } as UseContractReadConfig<typeof deCaABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaABI}__.
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
  return useContractWrite<typeof deCaABI, TFunctionName, TMode>({
    abi: deCaABI,
    address: deCaAddress[undefined],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"createNewStrategy"`.
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
  return useContractWrite<typeof deCaABI, 'createNewStrategy', TMode>({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'createNewStrategy',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"triggerStrategyBuy"`.
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
  return useContractWrite<typeof deCaABI, 'triggerStrategyBuy', TMode>({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'triggerStrategyBuy',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"updateAllowedTriggerStrategyAddress"`.
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
  return useContractWrite<
    typeof deCaABI,
    'updateAllowedTriggerStrategyAddress',
    TMode
  >({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'updateAllowedTriggerStrategyAddress',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"userUpdateStrategy"`.
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
  return useContractWrite<typeof deCaABI, 'userUpdateStrategy', TMode>({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'userUpdateStrategy',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"withdrawOrCollect"`.
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
  return useContractWrite<typeof deCaABI, 'withdrawOrCollect', TMode>({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'withdrawOrCollect',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaABI}__.
 */
export function usePrepareDeCaWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deCaABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: deCaABI,
    address: deCaAddress[undefined],
    ...config,
  } as UsePrepareContractWriteConfig<typeof deCaABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"createNewStrategy"`.
 */
export function usePrepareDeCaCreateNewStrategy(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deCaABI, 'createNewStrategy'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'createNewStrategy',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deCaABI, 'createNewStrategy'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"triggerStrategyBuy"`.
 */
export function usePrepareDeCaTriggerStrategyBuy(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deCaABI, 'triggerStrategyBuy'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'triggerStrategyBuy',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deCaABI, 'triggerStrategyBuy'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"updateAllowedTriggerStrategyAddress"`.
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
  return usePrepareContractWrite({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'updateAllowedTriggerStrategyAddress',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof deCaABI,
    'updateAllowedTriggerStrategyAddress'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"userUpdateStrategy"`.
 */
export function usePrepareDeCaUserUpdateStrategy(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deCaABI, 'userUpdateStrategy'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'userUpdateStrategy',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deCaABI, 'userUpdateStrategy'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaABI}__ and `functionName` set to `"withdrawOrCollect"`.
 */
export function usePrepareDeCaWithdrawOrCollect(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deCaABI, 'withdrawOrCollect'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: deCaABI,
    address: deCaAddress[undefined],
    functionName: 'withdrawOrCollect',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deCaABI, 'withdrawOrCollect'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link deCaABI}__.
 */
export function useDeCaEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof deCaABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  return useContractEvent({
    abi: deCaABI,
    address: deCaAddress[undefined],
    ...config,
  } as UseContractEventConfig<typeof deCaABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link deCaABI}__ and `eventName` set to `"Log"`.
 */
export function useDeCaLogEvent(
  config: Omit<
    UseContractEventConfig<typeof deCaABI, 'Log'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  return useContractEvent({
    abi: deCaABI,
    address: deCaAddress[undefined],
    eventName: 'Log',
    ...config,
  } as UseContractEventConfig<typeof deCaABI, 'Log'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link deCaABI}__ and `eventName` set to `"NewStrategy"`.
 */
export function useDeCaNewStrategyEvent(
  config: Omit<
    UseContractEventConfig<typeof deCaABI, 'NewStrategy'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof deCaAddress } = {} as any,
) {
  return useContractEvent({
    abi: deCaABI,
    address: deCaAddress[undefined],
    eventName: 'NewStrategy',
    ...config,
  } as UseContractEventConfig<typeof deCaABI, 'NewStrategy'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaScriptABI}__.
 */
export function useDeCaScriptRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof deCaScriptABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deCaScriptABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: deCaScriptABI,
    ...config,
  } as UseContractReadConfig<typeof deCaScriptABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link deCaScriptABI}__ and `functionName` set to `"IS_SCRIPT"`.
 */
export function useDeCaScriptIsScript<
  TFunctionName extends 'IS_SCRIPT',
  TSelectData = ReadContractResult<typeof deCaScriptABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof deCaScriptABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: deCaScriptABI,
    functionName: 'IS_SCRIPT',
    ...config,
  } as UseContractReadConfig<typeof deCaScriptABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaScriptABI}__.
 */
export function useDeCaScriptWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof deCaScriptABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof deCaScriptABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof deCaScriptABI, TFunctionName, TMode>({
    abi: deCaScriptABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaScriptABI}__ and `functionName` set to `"run"`.
 */
export function useDeCaScriptRun<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof deCaScriptABI,
          'run'
        >['request']['abi'],
        'run',
        TMode
      > & { functionName?: 'run' }
    : UseContractWriteConfig<typeof deCaScriptABI, 'run', TMode> & {
        abi?: never
        functionName?: 'run'
      } = {} as any,
) {
  return useContractWrite<typeof deCaScriptABI, 'run', TMode>({
    abi: deCaScriptABI,
    functionName: 'run',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link deCaScriptABI}__ and `functionName` set to `"setUp"`.
 */
export function useDeCaScriptSetUp<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof deCaScriptABI,
          'setUp'
        >['request']['abi'],
        'setUp',
        TMode
      > & { functionName?: 'setUp' }
    : UseContractWriteConfig<typeof deCaScriptABI, 'setUp', TMode> & {
        abi?: never
        functionName?: 'setUp'
      } = {} as any,
) {
  return useContractWrite<typeof deCaScriptABI, 'setUp', TMode>({
    abi: deCaScriptABI,
    functionName: 'setUp',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaScriptABI}__.
 */
export function usePrepareDeCaScriptWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deCaScriptABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: deCaScriptABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof deCaScriptABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaScriptABI}__ and `functionName` set to `"run"`.
 */
export function usePrepareDeCaScriptRun(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deCaScriptABI, 'run'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: deCaScriptABI,
    functionName: 'run',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deCaScriptABI, 'run'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link deCaScriptABI}__ and `functionName` set to `"setUp"`.
 */
export function usePrepareDeCaScriptSetUp(
  config: Omit<
    UsePrepareContractWriteConfig<typeof deCaScriptABI, 'setUp'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: deCaScriptABI,
    functionName: 'setUp',
    ...config,
  } as UsePrepareContractWriteConfig<typeof deCaScriptABI, 'setUp'>)
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
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iSwapRouterABI}__ and `functionName` set to `"exactOutput"`.
 */
export function useISwapRouterExactOutput<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iSwapRouterABI,
          'exactOutput'
        >['request']['abi'],
        'exactOutput',
        TMode
      > & { functionName?: 'exactOutput' }
    : UseContractWriteConfig<typeof iSwapRouterABI, 'exactOutput', TMode> & {
        abi?: never
        functionName?: 'exactOutput'
      } = {} as any,
) {
  return useContractWrite<typeof iSwapRouterABI, 'exactOutput', TMode>({
    abi: iSwapRouterABI,
    functionName: 'exactOutput',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iSwapRouterABI}__ and `functionName` set to `"exactOutputSingle"`.
 */
export function useISwapRouterExactOutputSingle<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iSwapRouterABI,
          'exactOutputSingle'
        >['request']['abi'],
        'exactOutputSingle',
        TMode
      > & { functionName?: 'exactOutputSingle' }
    : UseContractWriteConfig<
        typeof iSwapRouterABI,
        'exactOutputSingle',
        TMode
      > & {
        abi?: never
        functionName?: 'exactOutputSingle'
      } = {} as any,
) {
  return useContractWrite<typeof iSwapRouterABI, 'exactOutputSingle', TMode>({
    abi: iSwapRouterABI,
    functionName: 'exactOutputSingle',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iSwapRouterABI}__ and `functionName` set to `"uniswapV3SwapCallback"`.
 */
export function useISwapRouterUniswapV3SwapCallback<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iSwapRouterABI,
          'uniswapV3SwapCallback'
        >['request']['abi'],
        'uniswapV3SwapCallback',
        TMode
      > & { functionName?: 'uniswapV3SwapCallback' }
    : UseContractWriteConfig<
        typeof iSwapRouterABI,
        'uniswapV3SwapCallback',
        TMode
      > & {
        abi?: never
        functionName?: 'uniswapV3SwapCallback'
      } = {} as any,
) {
  return useContractWrite<
    typeof iSwapRouterABI,
    'uniswapV3SwapCallback',
    TMode
  >({
    abi: iSwapRouterABI,
    functionName: 'uniswapV3SwapCallback',
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
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iSwapRouterABI}__ and `functionName` set to `"exactOutput"`.
 */
export function usePrepareISwapRouterExactOutput(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iSwapRouterABI, 'exactOutput'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iSwapRouterABI,
    functionName: 'exactOutput',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iSwapRouterABI, 'exactOutput'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iSwapRouterABI}__ and `functionName` set to `"exactOutputSingle"`.
 */
export function usePrepareISwapRouterExactOutputSingle(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iSwapRouterABI, 'exactOutputSingle'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iSwapRouterABI,
    functionName: 'exactOutputSingle',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof iSwapRouterABI,
    'exactOutputSingle'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iSwapRouterABI}__ and `functionName` set to `"uniswapV3SwapCallback"`.
 */
export function usePrepareISwapRouterUniswapV3SwapCallback(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof iSwapRouterABI,
      'uniswapV3SwapCallback'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iSwapRouterABI,
    functionName: 'uniswapV3SwapCallback',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof iSwapRouterABI,
    'uniswapV3SwapCallback'
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iUniswapV3SwapCallbackABI}__.
 */
export function useIUniswapV3SwapCallbackWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iUniswapV3SwapCallbackABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof iUniswapV3SwapCallbackABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<
    typeof iUniswapV3SwapCallbackABI,
    TFunctionName,
    TMode
  >({ abi: iUniswapV3SwapCallbackABI, ...config } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iUniswapV3SwapCallbackABI}__ and `functionName` set to `"uniswapV3SwapCallback"`.
 */
export function useIUniswapV3SwapCallbackUniswapV3SwapCallback<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iUniswapV3SwapCallbackABI,
          'uniswapV3SwapCallback'
        >['request']['abi'],
        'uniswapV3SwapCallback',
        TMode
      > & { functionName?: 'uniswapV3SwapCallback' }
    : UseContractWriteConfig<
        typeof iUniswapV3SwapCallbackABI,
        'uniswapV3SwapCallback',
        TMode
      > & {
        abi?: never
        functionName?: 'uniswapV3SwapCallback'
      } = {} as any,
) {
  return useContractWrite<
    typeof iUniswapV3SwapCallbackABI,
    'uniswapV3SwapCallback',
    TMode
  >({
    abi: iUniswapV3SwapCallbackABI,
    functionName: 'uniswapV3SwapCallback',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iUniswapV3SwapCallbackABI}__.
 */
export function usePrepareIUniswapV3SwapCallbackWrite<
  TFunctionName extends string,
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof iUniswapV3SwapCallbackABI,
      TFunctionName
    >,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iUniswapV3SwapCallbackABI,
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof iUniswapV3SwapCallbackABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iUniswapV3SwapCallbackABI}__ and `functionName` set to `"uniswapV3SwapCallback"`.
 */
export function usePrepareIUniswapV3SwapCallbackUniswapV3SwapCallback(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof iUniswapV3SwapCallbackABI,
      'uniswapV3SwapCallback'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iUniswapV3SwapCallbackABI,
    functionName: 'uniswapV3SwapCallback',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof iUniswapV3SwapCallbackABI,
    'uniswapV3SwapCallback'
  >)
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
