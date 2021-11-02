const removeHashtags = (text: string) => {
  const regexp = /#\w\w+\s?/g;
  return text.replace(regexp, '');
};

export default removeHashtags;
