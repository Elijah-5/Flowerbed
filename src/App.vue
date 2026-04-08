<template>
  <div class="page">
    <div class="header-shell">
      <ActorSwitcher v-model="activeActor" :actors="actorOptions" />

      <AppHeader
        :title="currentActor.headerTitle"
        :subtitle="currentActor.headerSubtitle"
        :tickets="tickets"
        :purchase-count="purchaseCount"
        :productivity-score="productivityScore"
        :national-average="nationalAverage"
        :last-gain="lastGain"
        :round-number="roundNumber"
        :collapsed="headerCollapsed"
        @toggle-collapse="headerCollapsed = !headerCollapsed"
      />

      <GuidanceBanner
        v-if="!headerCollapsed"
        :message="currentActor.bannerMessage"
        :side-note="currentActor.bannerSideNote"
      />

    </div>

    <section class="control-bar">
      <div class="round-chip">Simulation Round {{ roundNumber }}</div>
      <button class="round-btn" @click="advanceRound">Issue New Byte coin / Next Round</button>
    </section>



    <main class="feed">
      <ProductCard
        v-for="product in displayedProducts"
        :key="product.feedId ?? product.id"
        :product="product"
        :disabled="tickets < product.price"
        :actor-mode="activeActor"
        @acquire="acquireProduct"
        @promote="promoteProduct"
      />
    </main>

    <div
      v-if="activeActor === 'user'"
      ref="feedSentinel"
      class="feed-sentinel"
      aria-hidden="true"
    >
      Routing more concealed listings...
    </div>

    <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>

    <ReflectionModal
      :open="showReflection"
      :total-increase="totalIncrease"
      :purchase-count="purchaseCount"
      :productivity-score="productivityScore"
      :tickets="tickets"
      @close="showReflection = false"
      @continue="continueOptimizing"
    />

  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ActorSwitcher from './components/ActorSwitcher.vue'
import AppHeader from './components/AppHeader.vue'
import GuidanceBanner from './components/GuidanceBanner.vue'
import ProductCard from './components/ProductCard.vue'
import ReflectionModal from './components/ReflectionModal.vue'
import { actorViews } from './data/actorViews'
import { initialProducts } from './data/products'
import { attachFeedMetrics, createFeedBatch } from './utils/feed'
import { applyDynamicPricing, initializeProductPricing } from './utils/pricing'

const INITIAL_BATCH_SIZE = 8
const APPEND_BATCH_SIZE = 6

const activeActor = ref('user')
const tickets = ref(120)
const productivityScore = ref(72)
const nationalAverage = ref(75)
const purchaseCount = ref(0)
const totalIncrease = ref(0)
const lastGain = ref(0)
const toastMessage = ref('')
const showReflection = ref(false)
const marketHeat = ref(1)
const roundNumber = ref(1)
const headerCollapsed = ref(false)
const products = ref(initialProducts.map((item) => initializeProductPricing(item)))
const feedItems = ref([])
const feedSentinel = ref(null)
const feedSequence = ref(0)
const isAppendingFeed = ref(false)
const lastPromotedFamilyId = ref(null)

let feedObserver = null

let toastTimer = null
let scoreTimer = null

const actorOptions = Object.values(actorViews)

function refreshPricing() {
  products.value = attachFeedMetrics(
    applyDynamicPricing(products.value, {
      tickets: tickets.value,
      purchaseCount: purchaseCount.value,
      marketHeat: marketHeat.value,
      productivityGap: nationalAverage.value - productivityScore.value,
    }),
  )
}

function appendFeed(batchSize = APPEND_BATCH_SIZE, preferredFamilyId = null) {
  if (isAppendingFeed.value) return

  isAppendingFeed.value = true
  const recentFamilyIds = feedItems.value.slice(-5).map((item) => item.familyId)
  const batch = createFeedBatch(products.value, {
    batchSize,
    startingSequence: feedSequence.value,
    recentFamilyIds,
    preferredFamilyId,
  })
  feedItems.value = [...feedItems.value, ...batch]
  feedSequence.value += batchSize
  isAppendingFeed.value = false
}

function resetFeed(preferredFamilyId = null) {
  feedItems.value = []
  feedSequence.value = 0
  appendFeed(INITIAL_BATCH_SIZE, preferredFamilyId)
}

const systemProducts = computed(() => {
  return [...products.value].sort((a, b) => {
    if (b.systemPriority !== a.systemPriority) return b.systemPriority - a.systemPriority
    return b.appearanceWeight - a.appearanceWeight
  })
})

const displayedProducts = computed(() => {
  return activeActor.value === 'user' ? feedItems.value : systemProducts.value
})

function startFeedObserver() {
  if (!feedSentinel.value || feedObserver || activeActor.value !== 'user') return

  feedObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        appendFeed()
      }
    },
    {
      rootMargin: '360px 0px',
    },
  )

  feedObserver.observe(feedSentinel.value)
}

function stopFeedObserver() {
  if (feedObserver) {
    feedObserver.disconnect()
    feedObserver = null
  }
}

const currentActor = computed(() => actorViews[activeActor.value])

watch(activeActor, (mode) => {
  if (mode === 'user') {
    if (lastPromotedFamilyId.value) {
      resetFeed(lastPromotedFamilyId.value)
      lastPromotedFamilyId.value = null
    }
    startFeedObserver()
  } else {
    stopFeedObserver()
  }
})

watch(feedSentinel, () => {
  stopFeedObserver()
  startFeedObserver()
})

onMounted(() => {
  startFeedObserver()
})

onBeforeUnmount(() => {
  stopFeedObserver()
})

refreshPricing()
resetFeed()

function showToast(message) {
  toastMessage.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2200)
}

function resolveFamily(product) {
  return products.value.find((item) => item.id === (product.familyId ?? product.id))
}

function acquireProduct(product) {
  if (tickets.value < product.price) return

  tickets.value -= product.price
  productivityScore.value += product.scoreGain
  purchaseCount.value += 1
  totalIncrease.value += product.scoreGain
  lastGain.value = product.scoreGain

  const target = resolveFamily(product)
  if (target) {
    target.acquired += 1
    target.priority += 2
  }

  marketHeat.value += 1
  refreshPricing()
  if (feedItems.value.length < 18) {
    appendFeed(APPEND_BATCH_SIZE)
  }

  showToast(`${product.familyName ?? product.name} acquired · +${product.scoreGain} productivity`)

  if (purchaseCount.value >= 3) {
    showReflection.value = true
  }

  clearTimeout(scoreTimer)
  scoreTimer = setTimeout(() => {
    lastGain.value = 0
  }, 1600)
}

function promoteProduct(product) {
  const target = resolveFamily(product)
  if (!target) return

  target.systemPriority += 1
  target.exposureLevel = Math.min(target.exposureLevel + 1, 10)
  target.promotionBoost += 1
  marketHeat.value += 1
  refreshPricing()
  lastPromotedFamilyId.value = target.id
  resetFeed(target.id)
  showToast(`${product.name} promoted in system ranking`)
}

function continueOptimizing() {
  showReflection.value = false
  showToast('Optimization tracking resumed')
}

function advanceRound() {
  tickets.value = 120
  productivityScore.value = 72
  purchaseCount.value = 0
  totalIncrease.value = 0
  lastGain.value = 0
  showReflection.value = false
  marketHeat.value += 1
  roundNumber.value += 1
  refreshPricing()
  resetFeed()
  showToast(`Round ${roundNumber.value} initialized · fresh Byte coin issued`)
}
</script>
