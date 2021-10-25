<template>
  <VCard elevation="1">
    <VCardTitle v-text="title"></VCardTitle>
    <VDivider></VDivider>
    <v-list>
      <!-- <template v-if="isLoading">
        <v-skeleton-loader
          v-for="n in 5"
          :key="n"
          type="list-item-avatar"
        ></v-skeleton-loader>
      </template> -->
      <v-list-item v-for="user in latestFriends" :key="user.id">
        <v-list-item-avatar>
          <v-img :src="user.avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="user.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <VCard-actions>
      <v-btn block text color="primary">See all</v-btn>
    </VCard-actions>
  </VCard>
</template>

<script lang="ts">
export default defineComponent({
  name: 'LatestFriendList',
  props: {
    title: {
      type: String,
      required: false,
      default: 'Latest Friends',
    },
  },
  setup() {
    return {
      latestFriends: [
        {
          id: 'e5d12be0-7d1b-4c1d-a529-0c8dd84e66b1',
          name: 'Vicki Rempel',
          avatar: 'https://cdn.fakercloud.com/avatars/thomasschrijer_128.jpg',
        },
        {
          id: '456b802b-5ae9-431f-920e-c8260cdd0daa',
          name: 'Jay Runolfsdottir',
          avatar: 'https://cdn.fakercloud.com/avatars/bertboerland_128.jpg',
        },
        {
          id: '80921bc7-570c-42ee-81b8-0d0fea6b9a7b',
          name: 'Miranda Gusikowski',
          avatar: 'https://cdn.fakercloud.com/avatars/bpartridge_128.jpg',
        },
        {
          id: 'c7754b86-8c32-4fd6-a0c4-6d95d9e151bb',
          name: 'Phyllis Hyatt',
          avatar: 'https://cdn.fakercloud.com/avatars/davidbaldie_128.jpg',
        },
        {
          id: '56ada63d-0ac3-437c-8ec6-ecfd88bb5f08',
          name: 'Vera Schuster',
          avatar: 'https://cdn.fakercloud.com/avatars/souperphly_128.jpg',
        },
      ],
    };
  },
});
</script>
