<template>
  <div class="banner">
    <div class="banner-text">{{ message }}</div>
    <div class="banner-side">{{ sideNote }}</div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Maintain optimal performance this week.',
  },
  sideNote: {
    type: String,
    default: 'Weekly allocation resets soon',
  },
})
</script>