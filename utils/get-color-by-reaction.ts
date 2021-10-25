import { ReactionType } from '~/composables';

const getColorByReaction = (reaction: ReactionType) => {
  if (reaction === ReactionType.Like) {
    return 'primary--text';
  }

  if (reaction === ReactionType.Love) {
    return 'red--text text--accent-2';
  }

  if (reaction === ReactionType.Angry) {
    return 'orange--text text--darken-3';
  }

  return 'amber--text text--accent-3';
};

export default getColorByReaction;
