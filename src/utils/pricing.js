function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function roundToWhole(value) {
  return Math.round(value)
}

function deterministicNoise(productId, purchaseCount, marketHeat) {
  const seed = productId * 37 + purchaseCount * 17 + marketHeat * 13
  return ((seed % 9) - 4) / 100
}

export function initializeProductPricing(product) {
  return {
    ...product,
    feedWeight: product.feedWeight ?? Math.max(14 - product.priority, 2),
    promotionBoost: product.promotionBoost ?? 0,
    basePrice: product.price,
    price: product.price,
    lastPriceChange: 0,
    priceMood: 'stable',
  }
}

export function applyDynamicPricing(products, marketState) {
  return products.map((product) => {
    const demandPressure = product.acquired * 0.08
    const exposurePremium = product.exposureLevel * 0.015
    const systemPressure = product.systemPriority * 0.01
    const productivityPressure = marketState.productivityGap > 0
      ? clamp(marketState.productivityGap / 30, 0, 0.18)
      : -0.04

    const walletPressure = marketState.tickets > 90
      ? 0.08
      : marketState.tickets < 35
        ? -0.06
        : 0

    const categoryPressure = product.category.includes('Premium') ? 0.09 : 0.03
    const marketHeatPressure = marketState.marketHeat * 0.025
    const conversionPressure = marketState.purchaseCount > 0
      ? Math.min(marketState.purchaseCount * 0.02, 0.12)
      : 0
    const noise = deterministicNoise(product.id, marketState.purchaseCount, marketState.marketHeat)

    const rawMultiplier =
      1 +
      demandPressure +
      exposurePremium +
      systemPressure +
      productivityPressure +
      walletPressure +
      categoryPressure +
      marketHeatPressure +
      conversionPressure +
      noise

    const multiplier = clamp(rawMultiplier, 0.75, 1.9)

    const nextPrice = Math.max(product.basePrice, roundToWhole(product.basePrice * multiplier))
    const lastPriceChange = nextPrice - product.price

    let priceMood = 'stable'
    if (lastPriceChange >= 3) priceMood = 'surging'
    else if (lastPriceChange <= -2) priceMood = 'soft'

    return {
      ...product,
      price: nextPrice,
      lastPriceChange,
      priceMood,
      pricingBreakdown: {
        basePrice: product.basePrice,
        demandPressure,
        exposurePremium,
        systemPressure,
        productivityPressure,
        walletPressure,
        categoryPressure,
        marketHeatPressure,
        conversionPressure,
        noise,
        multiplier,
        rawMultiplier,
      },
      }
  })
}
