<template>
  <VMenu
    v-model="menu"
    :bottom="bottom"
    :top="top"
    :left="left"
    :right="right"
    :close-on-content-click="false"
  >
    <template #activator="slotProps">
      <slot :activator="slotProps">
        <VBtn v-bind="slotProps.attrs" icon color="primary" v-on="slotProps.on">
          <VIcon>mdi-emoticon-outline</VIcon>
        </VBtn>
      </slot>
    </template>
    <emoji-picker
      ref="picker"
      :class="[$vuetify.theme.dark ? 'dark' : 'light']"
    ></emoji-picker>
  </VMenu>
</template>

<script lang="ts">
if (process.browser) {
  require('emoji-picker-element/picker');
}

export default defineComponent({
  name: 'AppEmojiPicker',
  props: {
    bottom: {
      type: Boolean,
      required: false,
      default: false,
    },
    right: {
      type: Boolean,
      required: false,
      default: false,
    },
    left: {
      type: Boolean,
      required: false,
      default: false,
    },
    top: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['handleClick'],
  setup(_props, { emit }) {
    const menu = ref(false);
    const picker = ref();

    const handleClick = (event: Record<any, any>) => {
      menu.value = false;
      emit('handleClick', event.detail.unicode);
    };

    watchEffect(() => {
      if (picker.value) {
        picker.value.addEventListener('emoji-click', handleClick, true);
      }
    });

    onUnmounted(() => {
      if (picker.value) {
        picker.value.removeEventListener('emoji-click', handleClick, true);
      }
    });

    return {
      menu,
      picker,
    };
  },
});
</script>
