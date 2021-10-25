<template>
  <div class="ossn-reaction-list">
    <li v-if="icon === ReactionType.Like">
      <div class="emoji emoji--like">
        <div class="emoji__hand"><div class="emoji__thumb"></div></div>
      </div>
    </li>
    <li v-if="icon === ReactionType.Love">
      <div class="emoji emoji--love"><div class="emoji__heart"></div></div>
    </li>
    <li v-if="icon === ReactionType.Haha">
      <div class="emoji emoji--haha">
        <div class="emoji__face">
          <div class="emoji__eyes"></div>
          <div class="emoji__mouth"><div class="emoji__tongue"></div></div>
        </div>
      </div>
    </li>
    <li v-if="icon === ReactionType.Wow">
      <div class="emoji emoji--wow">
        <div class="emoji__face">
          <div class="emoji__eyebrows"></div>
          <div class="emoji__eyes"></div>
          <div class="emoji__mouth"></div>
        </div>
      </div>
    </li>
    <li v-if="icon === ReactionType.Sad">
      <div class="emoji emoji--sad">
        <div class="emoji__face">
          <div class="emoji__eyebrows"></div>
          <div class="emoji__eyes"></div>
          <div class="emoji__mouth"></div>
        </div>
      </div>
    </li>
    <li v-if="icon === ReactionType.Angry">
      <div class="emoji emoji--angry">
        <div class="emoji__face">
          <div class="emoji__eyebrows"></div>
          <div class="emoji__eyes"></div>
          <div class="emoji__mouth"></div>
        </div>
      </div>
    </li>
  </div>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import { ReactionType } from '~/composables/useLikePost';

export default defineComponent({
  name: 'ReactionIcons',
  props: {
    icon: {
      type: String as PropType<ReactionType>,
      required: true,
    },
  },
  setup() {
    return {
      ReactionType,
    };
  },
});
</script>

<style scoped>
@import '~/assets/emoji.css';
</style>
