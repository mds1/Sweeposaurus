<template>
  <span id="avatar-container" class="row">
    <Jazzicon :address="userAddress" />
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import Jazzicon from 'src/components/Jazzicon.vue';
import useWalletStore from 'src/store/wallet';

export default defineComponent({
  name: 'Avatar',
  components: { Jazzicon },
  props: {
    avatar: {
      type: (null as unknown) as PropType<string | null>,
      required: false,
      default: null,
    },
    address: {
      type: String,
      required: true,
    },
  },
  setup: (props) => {
    const { userAddress } = useWalletStore();
    if (props.avatar) {
      // load the avatar image async and display the jazzicon while waiting
      const avatarImg = new Image();
      avatarImg.onload = () => {
        document.querySelector('#jazzicon')?.remove();
        document.querySelector('#avatar-container')?.appendChild(avatarImg);
      };
      avatarImg.id = 'avatar';
      avatarImg.width = 20;
      avatarImg.src = props.avatar;
    }
    return { userAddress };
  },
});
</script>

<style lang="sass">
#avatar
  border-radius: 50%
</style>
