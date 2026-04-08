function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function chooseVariant(variants, seed) {
  return variants[Math.abs(seed) % variants.length]
}

function computeAppearanceWeight(product) {
  const promotionBias = product.promotionBoost * 6
  const repeatBias = product.acquired * 1.5
  const exposureBias = product.exposureLevel * 0.35
  return Math.max(product.feedWeight + promotionBias + repeatBias + exposureBias, 1)
}

function weightedPick(products, recentFamilyIds = [], preferredFamilyId = null) {
  const weightedProducts = products.map((product) => {
    let weight = computeAppearanceWeight(product)

    const recentIndex = recentFamilyIds.lastIndexOf(product.id)
    if (recentIndex !== -1) {
      const distance = recentFamilyIds.length - recentIndex
      const repeatPenalty = distance <= 1 ? 0.08 : distance === 2 ? 0.22 : 0.45
      weight *= repeatPenalty
    }

    if (preferredFamilyId === product.id) {
      weight *= 4
    }

    return {
      product,
      weight: Math.max(weight, 0.1),
    }
  })

  const totalWeight = weightedProducts.reduce((sum, entry) => sum + entry.weight, 0)
  let cursor = Math.random() * totalWeight

  for (const entry of weightedProducts) {
    cursor -= entry.weight
    if (cursor <= 0) {
      return entry.product
    }
  }

  return weightedProducts[weightedProducts.length - 1].product
}

function buildTag(product, sequence) {
  const variants = [
    product.tag,
    `${product.tag} · Routed`,
    `${product.tag} · Priority Drop`,
    `${product.tag} · Fast Queue`,
  ]
  return chooseVariant(variants, sequence + product.id)
}

function buildSocialProof(product, sequence) {
  const variants = [
    product.socialProof,
    `Seen in ${58 + ((sequence + product.id) % 27)}% of optimized baskets`,
    `Repeated in ${2 + ((sequence + product.id) % 5)} nearby purchase trails`,
    `Recommended after ${product.scoreGain}+ productivity gains`,
  ]
  return chooseVariant(variants, sequence * 2 + product.id)
}

function buildNotice(product, sequence) {
  const variants = [
    product.notice,
    'Concealed routing window may expire if engagement slows.',
    'Price path may tighten after additional dwell-time signals.',
    'Visibility elevated by adaptive ranking and regional demand pressure.',
  ]
  return chooseVariant(variants, sequence * 3 + product.id)
}

function buildDescription(product, sequence) {
  const prefix = chooseVariant(
    [
      'Priority surfaced for your current optimization profile.',
      'Quietly boosted in the recommendation stream for users under pressure.',
      'Rerouted through high-conversion pathways after recent browsing signals.',
      'Promoted as a strategic upgrade for maintaining acceptable output.',
    ],
    sequence + product.exposureLevel,
  )

  return `${prefix} ${product.description}`
}

function buildDisplayPrice(product, sequence) {
  const adjustmentPattern = [-1, 0, 1, 2, 0, 1]
  const adjustment = adjustmentPattern[Math.abs(sequence + product.id) % adjustmentPattern.length]
  return Math.max(product.price, product.price + adjustment)
}

export function createFeedBatch(products, options) {
  const {
    batchSize,
    startingSequence,
    recentFamilyIds = [],
    preferredFamilyId = null,
  } = options
  const items = []
  const rollingRecent = [...recentFamilyIds]

  for (let index = 0; index < batchSize; index += 1) {
    const sequence = startingSequence + index
    const family = weightedPick(
      products,
      rollingRecent.slice(-4),
      index < 2 ? preferredFamilyId : null,
    )
    const appearanceWeight = computeAppearanceWeight(family)

    rollingRecent.push(family.id)

    items.push({
      ...family,
      feedId: `feed-${family.id}-${sequence}`,
      familyId: family.id,
      familyName: family.name,
      name: family.name,
      tag: buildTag(family, sequence),
      description: buildDescription(family, sequence),
      socialProof: buildSocialProof(family, sequence),
      notice: buildNotice(family, sequence),
      price: buildDisplayPrice(family, sequence),
      feedSequence: sequence,
      appearanceWeight: Number(appearanceWeight.toFixed(2)),
    })
  }

  return items
}

export function attachFeedMetrics(products) {
  const totalWeight = products.reduce((sum, product) => sum + computeAppearanceWeight(product), 0)

  return products.map((product) => {
    const appearanceWeight = computeAppearanceWeight(product)
    const feedShare = totalWeight > 0 ? (appearanceWeight / totalWeight) * 100 : 0

    return {
      ...product,
      appearanceWeight: Number(appearanceWeight.toFixed(2)),
      feedShare: clamp(Number(feedShare.toFixed(1)), 0, 100),
    }
  })
}
