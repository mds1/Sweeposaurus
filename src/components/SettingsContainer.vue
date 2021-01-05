<template>
  <q-card class="shadow-2 q-pa-md">
    <div class="title">{{ settingName }}</div>
    <slot></slot>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'SettingsContainer',

  props: {
    settingName: {
      type: String,
      required: true,
    },
  },

  setup() {
    return {};
  },
});
</script>

<style lang="sass" scoped>
.title
  font-weight: bold
  // letter-spacing: 0.1rem
  text-align: center
  // text-transform: uppercase
</style>
