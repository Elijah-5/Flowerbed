<template>
  <div class="actor-switcher">
    <div class="actor-switcher-label">Active Perspective</div>
    <div class="actor-switcher-buttons">
      <button
        v-for="actor in actors"
        :key="actor.key"
        class="actor-btn"
        :class="{ active: actor.key === modelValue }"
        @click="$emit('update:modelValue', actor.key)"
      >
        {{ actor.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  actors: {
    type: Array,
    required: true,
  },
})

defineEmits(['update:modelValue'])
</script>