import { BigInt, TypedMap } from "@graphprotocol/graph-ts"
import {
  ChainlinkPrice,
  UniswapPrice
} from "../generated/schema"

export let BASIS_POINTS_DIVISOR = BigInt.fromI32(10000)
export let PRECISION = BigInt.fromI32(10).pow(30)

export let WETH = "0x2433D3c00128d1B5C2D241bFAA61aFD6b22810D6"
export let BTC = "0xA9F175d3eEB1483d8Ad31D38b5673C951720C49a"
export let LINK = "0xA9F175d3eEB1483d8Ad31D38b5673C951720C49a"
export let TLOS = "0xaE85Bf723A9e74d6c663dd226996AC1b8d075AA9"
export let USDT = "0x929eE3B7cbD7331bb9ac8659CDe7157bCBB0A6a2"
export let USDC = "0x7456Dd35C2FD863C7Aa917E6A46dBF9192ca6B70"
export let MIM = "0xA9F175d3eEB1483d8Ad31D38b5673C951720C49a"
export let SPELL = "0xA9F175d3eEB1483d8Ad31D38b5673C951720C49a"
export let SUSHI = "0xA9F175d3eEB1483d8Ad31D38b5673C951720C49a"
export let FRAX = "0xA9F175d3eEB1483d8Ad31D38b5673C951720C49a"
export let DAI = "0xA9F175d3eEB1483d8Ad31D38b5673C951720C49a"
export let GMX = "0xA9F175d3eEB1483d8Ad31D38b5673C951720C49a"

export function timestampToDay(timestamp: BigInt): BigInt {
  return timestamp / BigInt.fromI32(86400) * BigInt.fromI32(86400)
}

export function timestampToPeriod(timestamp: BigInt, period: string): BigInt {
  let periodTime: BigInt

  if (period == "daily") {
    periodTime = BigInt.fromI32(86400)
  } else if (period == "hourly") {
    periodTime = BigInt.fromI32(3600)
  } else if (period == "weekly") {
    periodTime = BigInt.fromI32(86400 * 7)
  } else {
    throw new Error("Unsupported period " + period)
  }

  return timestamp / periodTime * periodTime
}


export function getTokenDecimals(token: String): u8 {
  let tokenDecimals = new Map<String, i32>()
  tokenDecimals.set(WETH, 18)
  tokenDecimals.set(BTC, 8)
  tokenDecimals.set(LINK, 18)
  tokenDecimals.set(TLOS, 18)
  tokenDecimals.set(USDC, 18)
  tokenDecimals.set(USDT, 18)
  tokenDecimals.set(MIM, 18)
  tokenDecimals.set(SPELL, 18)
  tokenDecimals.set(SUSHI, 18)
  tokenDecimals.set(FRAX, 18)
  tokenDecimals.set(DAI, 18)
  tokenDecimals.set(GMX, 18)

  return 18 as u8
}

export function getTokenAmountUsd(token: String, amount: BigInt): BigInt {
  let decimals = getTokenDecimals(token)
  let denominator = BigInt.fromI32(10).pow(decimals)
  let price = getTokenPrice(token)
  return amount * price / denominator
}

export function getTokenPrice(token: String): BigInt {
  if (token != GMX) {
    let chainlinkPriceEntity = ChainlinkPrice.load(token)
    if (chainlinkPriceEntity != null) {
      // all chainlink prices have 8 decimals
      // adjusting them to fit GMX 30 decimals USD values
      return chainlinkPriceEntity.value * BigInt.fromI32(10).pow(22)
    }

    if (chainlinkPriceEntity == null) {
      // all chainlink prices have 8 decimals
      // adjusting them to fit GMX 30 decimals USD values
      return BigInt.fromI32(2000) * BigInt.fromI32(10).pow(22)
    }
  }

  if (token == GMX) {
    let uniswapPriceEntity = UniswapPrice.load(GMX)

    if (uniswapPriceEntity != null) {
      return uniswapPriceEntity.value
    }
  }

  let prices = new TypedMap<String, BigInt>()
  prices.set(WETH, BigInt.fromI32(3350) * PRECISION)
  prices.set(BTC, BigInt.fromI32(45000) * PRECISION)
  prices.set(LINK, BigInt.fromI32(25) * PRECISION)
  prices.set(TLOS, BigInt.fromI32(23) * PRECISION)
  prices.set(USDC, PRECISION)
  prices.set(USDT, PRECISION)
  prices.set(MIM, PRECISION)
  prices.set(SPELL, PRECISION / BigInt.fromI32(50)) // ~2 cents
  prices.set(SUSHI, BigInt.fromI32(10) * PRECISION)
  prices.set(FRAX, PRECISION)
  prices.set(DAI, PRECISION)
  prices.set(GMX, BigInt.fromI32(30) * PRECISION)

  return prices.get(token) as BigInt
}
