<template>
  <q-layout view="hhh Lpr fff" style="z-index: 0">
    <q-header style="color: #000000; background-color: rgba(0, 0, 0, 0)">
      <q-toolbar class="row justify-between items-center q-my-md">
        <q-toolbar-title class="col">
          <!-- Logo and nav bar -->
          <div class="row justify-start items-center">
            <router-link class="col-auto" tag="div" :to="{ name: 'home' }" style="line-height: 0">
              <img alt="Ethereum logo" src="~assets/app-icon.png" style="max-width: 40px" />
            </router-link>

            <router-link
              active-class="is-active"
              class="col-auto cursor-pointer dark-toggle q-ml-lg"
              exact
              tag="div"
              :to="{ name: 'home' }"
            >
              <span style="font-size: 1rem">Home</span>
            </router-link>

            <router-link
              active-class="is-active"
              class="col-auto cursor-pointer dark-toggle q-ml-lg"
              tag="div"
              :to="{ name: 'faq' }"
            >
              <span style="font-size: 1rem">FAQ</span>
            </router-link>

            <router-link
              v-if="userAddress"
              active-class="is-active"
              class="col-auto cursor-pointer dark-toggle q-ml-lg"
              tag="div"
              :to="{ name: 'sweep' }"
            >
              <span style="font-size: 1rem">Sweep</span>
            </router-link>
          </div>
        </q-toolbar-title>

        <!-- Login address and settings -->
        <div class="col">
          <div class="row justify-end q-mt-xs">
            <div v-if="userAddress" class="col-xs-12 dark-toggle text-caption text-right">
              {{ userDisplayName }}
            </div>
            <q-icon
              class="col-auto dark-toggle"
              :name="$q.dark.isActive ? 'fas fa-sun' : 'fas fa-moon'"
              style="cursor: pointer"
              @click="toggleDarkMode()"
            />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer style="color: #000000; background-color: rgba(0, 0, 0, 0)">
      <div class="row justify-between dark-toggle text-caption q-my-xl q-mx-md">
        <div class="col-auto">
          <!-- Empty first column: lazy way to make second column approximately centered and third column right-aligned -->
        </div>
        <div class="col-auto">
          Built by
          <a href="https://twitter.com/msolomon44" target="_blank" class="hyperlink">Matt Solomon</a>
        </div>
        <div class="col-auto">
          <a href="https://github.com/mds1/Sweeposaurus" target="_blank" class="dark-toggle no-text-decoration">
            <q-icon name="fab fa-github" size="sm" />
          </a>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';
import { Dark, LocalStorage } from 'quasar';
import useWalletStore from 'src/store/wallet';

function useDarkMode() {
  function toggleDarkMode() {
    Dark.set(!Dark.isActive);
    LocalStorage.set('is-dark', Dark.isActive);
  }

  const mounted = onMounted(function () {
    Dark.set(Boolean(LocalStorage.getItem('is-dark')));
  });

  return { toggleDarkMode, mounted };
}

function useWalletAddress() {
  const { userAddress, userDisplayName } = useWalletStore();

  return { userAddress, userDisplayName };
}

export default defineComponent({
  name: 'BaseLayout',
  setup() {
    return { ...useDarkMode(), ...useWalletAddress() };
  },
});
</script>

<style lang="sass" scoped>
.is-active
  font-weight: bold
</style>
