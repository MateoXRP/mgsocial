<template>
  <VDialog v-model="dialog" max-width="500">
    <template #activator="{ on, attrs }">
      <div class="d-flex" v-bind="attrs" v-on="on">
        <div class="cursor-pointer d-flex">
          <ReactionIcons
            v-for="{ subtype, zIndex } in sortedReactions"
            :key="subtype"
            :icon="subtype"
            :style="{ 'z-index': zIndex }"
          />
        </div>
        <span class="ml-3 hover-underline cursor-pointer">{{
          totalLikes
        }}</span>
      </div>
    </template>
    <VCard>
      <VToolbar flat>
        <VToolbarTitle>People who reacted</VToolbarTitle>
        <VSpacer />
        <VBtn icon @click="dialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn>
        <template v-if="!isLoading" #extension>
          <VTabs v-model="selectedTab">
            <VTab href="#tab-all">All</VTab>
            <VTab v-for="(value, tab) in tabs" :key="tab" :href="`#tab-${tab}`">
              <ReactionIcons :icon="tab" />
              <span class="ml-2">{{ value }}</span>
            </VTab>
          </VTabs>
        </template>
      </VToolbar>
      <VList v-if="isLoading" dense>
        <VSkeletonLoader v-for="n in 3" :key="n" type="list-item" />
      </VList>
      <VTabsItems v-else v-model="selectedTab"
        ><VTabItem value="tab-all">
          <VList dense>
            <VListItem
              v-for="{ user, id: reactionId } in data"
              :key="reactionId"
              :to="`/u/${user.username}`"
            >
              <VListItemAvatar>
                <v-img :src="user.icon.small"></v-img>
              </VListItemAvatar>
              <VListItemContent>
                <VListItemTitle v-text="user.username" />
              </VListItemContent>
            </VListItem>
          </VList>
        </VTabItem>
        <VTabItem
          v-for="(_value, tab) in tabs"
          :key="tab"
          :value="`tab-${tab}`"
        >
          <VList dense>
            <VListItem
              v-for="{ user, id: reactionId } in filterByReaction(tab)"
              :key="reactionId"
              :to="`/u/${user.username}`"
            >
              <VListItemAvatar>
                <v-img :src="user.icon.small"></v-img>
              </VListItemAvatar>
              <VListItemContent>
                <VListItemTitle v-text="user.username" />
              </VListItemContent>
            </VListItem>
          </VList> </VTabItem
      ></VTabsItems>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api';
import ReactionIcons from './ReactionIcons.vue';
import { Reaction, ReactionType, useReactionList } from '~/composables';

export default defineComponent({
  name: 'PostItemReactionSummaryDialog',
  components: { ReactionIcons },
  props: {
    totalLikes: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    reactions: {
      type: Array as PropType<Reaction[]>,
      required: true,
    },
    type: {
      type: String as PropType<'post' | 'annotation'>,
      required: true,
    },
  },
  setup(props) {
    const dialog = ref(false);
    const selectedTab = ref('tab-all');
    const { isLoading, data } = useReactionList({
      type: props.type,
      id: props.id,
      enabled: dialog,
    });

    const tabs = computed(() => {
      const items = {} as Record<ReactionType, number>;

      data.value.forEach((reaction) => {
        if (items[reaction.subtype as ReactionType]) {
          items[reaction.subtype as ReactionType]++;
        } else {
          items[reaction.subtype as ReactionType] = 1;
        }
      });

      return items;
    });

    const filterByReaction = (reaction: ReactionType) => {
      return data.value.filter((i) => i.subtype === reaction);
    };

    const sortedReactions = computed(() => {
      const items: { subtype: ReactionType; count: number; zIndex: number }[] =
        [];

      props.reactions.forEach((reaction) => {
        if (!reaction) return;

        const itemIndex = items.findIndex(
          (i) => i.subtype === reaction.subtype
        );

        if (itemIndex !== -1) {
          items[itemIndex].count++;
        } else {
          items.push({
            subtype: reaction.subtype as ReactionType,
            count: 1,
            zIndex: 0,
          });
        }
      });

      const sortByHighestReacts = items
        .sort((a, b) => b.count - a.count)
        .map((item, index) => {
          return {
            ...item,
            zIndex: items.length - index,
          };
        });

      return sortByHighestReacts.slice(0, 3);
    });

    return {
      ReactionType,
      selectedTab,
      dialog,
      tabs,
      isLoading,
      data,
      filterByReaction,
      sortedReactions,
    };
  },
});
</script>
