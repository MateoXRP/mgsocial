<template>
  <VMenu
    v-model="menu"
    top
    :close-on-content-click="false"
    open-on-hover
    :open-delay="500"
    :close-delay="500"
    content-class="rounded-pill"
    offset-y
    transition="slide-x-transition"
  >
    <template #activator="slotProps">
      <slot :activator="slotProps" />
    </template>
    <VSheet class="ossn-like-reactions-panel rounded-pill">
      <li
        class="ossn-like-reaction-like"
        @click="selectReaction(ReactionType.Like)"
      >
        <div class="emoji emoji--like">
          <div class="emoji__hand"><div class="emoji__thumb"></div></div>
        </div>
      </li>
      <li
        class="ossn-like-reaction-love"
        @click="selectReaction(ReactionType.Love)"
      >
        <div class="emoji emoji--love"><div class="emoji__heart"></div></div>
      </li>
      <li
        class="ossn-like-reaction-haha"
        @click="selectReaction(ReactionType.Haha)"
      >
        <div class="emoji emoji--haha">
          <div class="emoji__face">
            <div class="emoji__eyes"></div>
            <div class="emoji__mouth"><div class="emoji__tongue"></div></div>
          </div>
        </div>
      </li>
      <li
        class="ossn-like-reaction-wow"
        @click="selectReaction(ReactionType.Wow)"
      >
        <div class="emoji emoji--wow">
          <div class="emoji__face">
            <div class="emoji__eyebrows"></div>
            <div class="emoji__eyes"></div>
            <div class="emoji__mouth"></div>
          </div>
        </div>
      </li>
      <li
        class="ossn-like-reaction-sad"
        @click="selectReaction(ReactionType.Sad)"
      >
        <div class="emoji emoji--sad">
          <div class="emoji__face">
            <div class="emoji__eyebrows"></div>
            <div class="emoji__eyes"></div>
            <div class="emoji__mouth"></div>
          </div>
        </div>
      </li>
      <li
        class="ossn-like-reaction-angry"
        @click="selectReaction(ReactionType.Angry)"
      >
        <div class="emoji emoji--angry">
          <div class="emoji__face">
            <div class="emoji__eyebrows"></div>
            <div class="emoji__eyes"></div>
            <div class="emoji__mouth"></div>
          </div>
        </div>
      </li>
    </VSheet>
  </VMenu>
</template>

<script lang="ts">
import { ReactionType } from '~/composables/useLikePost';

export default defineComponent({
  name: 'AppReactionMenu',
  emits: ['onReactionSelect'],
  setup(_props, { emit }) {
    const menu = ref(false);
    const picker = ref();

    const selectReaction = (reaction: ReactionType) => {
      emit('onReactionSelect', reaction);
    };

    return {
      menu,
      picker,
      selectReaction,
      ReactionType,
    };
  },
});
</script>

<style>
@import '~/assets/emoji.css';
</style>
