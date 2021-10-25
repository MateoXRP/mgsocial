import { Post } from '~/composables';

export function getPostId(post: Post) {
  return post.item_guid ? post.item_guid : post.guid;
}

export function getPostType(post: Post) {
  return post.item_type ? 'entity' : 'post';
}
