<template>
  <VCard class="mt-2" elevation="1">
    <VList two-line>
      <VListItem>
        <VListItemAvatar>
          <VSkeletonLoader v-bind="$attrs" type="avatar" />
        </VListItemAvatar>
        <VListItemContent>
          <VListItemTitle>
            <VSkeletonLoader
              v-bind="$attrs"
              type="text"
              width="20%"
            ></VSkeletonLoader>
          </VListItemTitle>
          <VListItemSubtitle>
            <VSkeletonLoader v-bind="$attrs" type="text" width="25%" />
          </VListItemSubtitle>
        </VListItemContent>
      </VListItem>
    </VList>
    <VCardText>
      <VSkeletonLoader v-bind="$attrs" type="paragraph" />
    </VCardText>
  </VCard>
</template>

<script lang="ts">
export default defineComponent({
  name: 'PostItemSkeleton',
});
</script>
