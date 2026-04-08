<template>
  <article class="card">
    <div class="card-top">
      <div>
        <h2 class="product-name">{{ product.name }}</h2>
        <div class="product-type">{{ actorMode === 'user' ? product.category : 'Governance / Allocation Item' }}</div>
      </div>
      <div class="tag" :class="product.tagClass">{{ computedTag }}</div>
    </div>

    <p class="desc">{{ computedDescription }}</p>

    <div class="product-meta">
      <div class="meta-box">
        <div class="meta-label">{{ actorMode === 'user' ? 'Effect' : 'Compliance Yield' }}</div>
        <div class="meta-value">
          {{ actorMode === 'user' ? `+${product.scoreGain} productivity` : `${product.systemPriority}/10 priority` }}
        </div>
      </div>
      <div class="meta-box">
        <div class="meta-label">{{ actorMode === 'user' ? 'Social Signal' : 'Behavior Signal' }}</div>
        <div class="meta-value">{{ actorMode === 'user' ? product.socialProof : product.systemSignal }}</div>
      </div>
    </div>

    <div class="card-bottom">
      <div class="price">
        <template v-if="actorMode === 'user'">
          {{ product.price }}<span>Byte coin</span>
        </template>
        <template v-else>
          {{ product.exposureLevel }}<span>Exposure Level</span>
        </template>
      </div>

      <button
        v-if="actorMode === 'user'"
        class="buy-btn"
        :disabled="disabled"
        @click="$emit('acquire', product)"
      >
        {{ disabled ? 'Insufficient Byte coin' : 'Acquire' }}
      </button>

      <button
        v-else
        class="buy-btn system-btn"
        @click="$emit('promote', product)"
      >
        Promote Listing
      </button>
    </div>

    <div
      v-if="actorMode === 'user'"
      class="price-signal"
      :class="`price-signal-${product.priceMood}`"
    >
      {{ priceSignal }}
    </div>

    <div v-else class="system-pricing">
      <div class="system-pricing-title">Adaptive Pricing Breakdown</div>
      <div class="system-pricing-grid">
        <div class="system-pricing-item">
          <span>Base</span>
          <strong>{{ product.pricingBreakdown.basePrice }}</strong>
        </div>
        <div class="system-pricing-item">
          <span>Live Quote</span>
          <strong>{{ product.price }}</strong>
        </div>
        <div class="system-pricing-item">
          <span>Demand</span>
          <strong>{{ formatFactor(product.pricingBreakdown.demandPressure) }}</strong>
        </div>
        <div class="system-pricing-item">
          <span>Exposure</span>
          <strong>{{ formatFactor(product.pricingBreakdown.exposurePremium) }}</strong>
        </div>
        <div class="system-pricing-item">
          <span>Performance Pressure</span>
          <strong>{{ formatFactor(product.pricingBreakdown.productivityPressure) }}</strong>
        </div>
        <div class="system-pricing-item">
          <span>Wallet Band</span>
          <strong>{{ formatFactor(product.pricingBreakdown.walletPressure) }}</strong>
        </div>
        <div class="system-pricing-item">
          <span>Market Heat</span>
          <strong>{{ formatFactor(product.pricingBreakdown.marketHeatPressure) }}</strong>
        </div>
        <div class="system-pricing-item">
          <span>Conversion Bias</span>
          <strong>{{ formatFactor(product.pricingBreakdown.conversionPressure) }}</strong>
        </div>
        <div class="system-pricing-item">
          <span>Obfuscation Noise</span>
          <strong>{{ formatFactor(product.pricingBreakdown.noise) }}</strong>
        </div>
        <div class="system-pricing-item">
          <span>Multiplier</span>
          <strong>{{ product.pricingBreakdown.multiplier.toFixed(2) }}x</strong>
        </div>
        <div class="system-pricing-item">
          <span>Feed Share</span>
          <strong>{{ product.feedShare }}%</strong>
        </div>
        <div class="system-pricing-item">
          <span>Promotion Boost</span>
          <strong>+{{ product.promotionBoost }}</strong>
        </div>
      </div>
    </div>

    <div class="fine-print">
      <div><strong>{{ actorMode === 'user' ? 'Guidance' : 'Policy Logic' }}:</strong> {{ computedGuidance }}</div>
      <div><strong>{{ actorMode === 'user' ? 'Notice' : 'System Note' }}:</strong> {{ computedNotice }}</div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  actorMode: {
    type: String,
    default: 'user',
  },
})

defineEmits(['acquire', 'promote'])

const computedTag = computed(() => {
  return props.actorMode === 'user' ? props.product.tag : props.product.systemTag
})

const computedDescription = computed(() => {
  return props.actorMode === 'user'
    ? props.product.description
    : props.product.systemDescription
})

const computedGuidance = computed(() => {
  return props.actorMode === 'user'
    ? props.product.guidance
    : props.product.systemGuidance
})

const computedNotice = computed(() => {
  return props.actorMode === 'user'
    ? props.product.notice
    : props.product.systemNotice
})

const priceSignal = computed(() => {
  if (props.product.lastPriceChange >= 3) {
    return 'Live demand recalibration detected. Current quote may tighten after additional activity.'
  }

  if (props.product.lastPriceChange <= -2) {
    return 'Temporary routing discount applied to sustain transaction flow.'
  }

  return 'Quote generated by concealed market-routing logic.'
})

function formatFactor(value) {
  const percent = Math.round(value * 100)
  return `${percent > 0 ? '+' : ''}${percent}%`
}
</script>
