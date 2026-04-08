<template>
  <header class="topbar" :class="{ 'topbar-collapsed': collapsed }">
    <div class="topbar-row">
      <div class="brand">
        <img src="/flowerbed_favicon.svg" alt="Flowerbed icon" class="brand-icon" />
        <div>
          <div class="brand-title">{{ title }}</div>
          <div class="brand-subtitle">{{ subtitle }}</div>
        </div>
      </div>

      <div class="status-group">
        <div class="status-pill">Byte coin: <strong>{{ tickets }}</strong></div>
        <div class="status-pill">Purchases: <strong>{{ purchaseCount }}</strong></div>
        <div class="status-pill">Round: <strong>{{ roundNumber }}</strong></div>
        <button class="collapse-btn" @click="$emit('toggle-collapse')">
          {{ collapsed ? 'Expand Header' : 'Fold Header' }}
        </button>
      </div>
    </div>

    <div v-if="!collapsed" class="score-panel">
      <div class="score-label">Productivity Score</div>
      <div class="score-value-row">
        <div>
          <div class="score-value">{{ productivityScore }}</div>
          <div class="score-subtext">National Average: {{ nationalAverage }}</div>
        </div>
        <div v-if="lastGain > 0" class="delta">+{{ lastGain }} score</div>
      </div>
    </div>

    <div v-if="!collapsed" class="banner darknet-banner">
      <div class="banner-left">
        <!-- <img src="/flowerbed_favicon.svg" alt="relay icon" class="banner-icon" /> -->

        <div class="banner-text">
          <strong>[NOTICE]</strong><br />
          Connection established through anonymous relay infrastructure.
          No entity in the network possesses full knowledge of this transaction.
          Trust is not guaranteed by identity, but by system design.
          All exchanges occur within a concealed routing environment.
        </div>
      </div>

      <div class="banner-side">
        STATUS: ANONYMOUS | MULTI-HOP | CONCEALED
      </div>
    </div>

    <footer v-if="!collapsed" class="footer">
        <div>
          © Created by Jingyang Lin, Qirui Zhao, Yifan Zhao, and Co-developed with ChatGPT. Just a simulation :)
        </div>
    </footer>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Flowerbed Market',
  },
  subtitle: {
    type: String,
    default: 'Anonymous exchange for Byte coin and regulated vouchers',
  },
  tickets: Number,
  purchaseCount: Number,
  productivityScore: Number,
  nationalAverage: Number,
  lastGain: Number,
  roundNumber: Number,
  collapsed: Boolean,
})

defineEmits(['toggle-collapse'])
</script>
