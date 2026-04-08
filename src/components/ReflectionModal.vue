<template>
  <div v-if="open" class="overlay">
    <div class="modal">
      <div class="modal-label">Optimization Summary</div>
      <h2>Your productivity has increased by {{ totalIncrease }}%</h2>
      <p>
        You selected performance-enhancing options {{ purchaseCount }} times. Your recent behavior
        aligns closely with high-efficiency consumption patterns.
      </p>

      <div class="modal-stats">
        <div class="modal-stat">
          <div class="label">Current Score</div>
          <div class="value">{{ productivityScore }}</div>
        </div>
        <div class="modal-stat">
          <div class="label">Byte coin Remaining</div>
          <div class="value">{{ tickets }}</div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="secondary-btn" @click="$emit('close')">Close</button>
        <button class="primary-btn" @click="$emit('continue')">Continue</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: Boolean,
  totalIncrease: Number,
  purchaseCount: Number,
  productivityScore: Number,
  tickets: Number,
})

defineEmits(['close', 'continue'])
</script>
