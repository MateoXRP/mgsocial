import getUrls from 'get-urls';
import removeHashtags from './remove-hashtags';

/**
 * Converts links from plain-text to html anchor tags.
 * @param text Text to search for links.
 * @param linkClass Additional class to anchor tags.
 * @returns Returns the converted text.
 */
export default function linkify(text: string, linkClass = '') {
  // links
  const urls = getUrls(removeHashtags(text));

  if (urls.size) {
    const re = new RegExp([...urls].join('|'), 'gi');

    text = text.replace(
      re,
      (matched: string) =>
        `<a class="text-decoration-none ${linkClass}" href="${matched}" target="_BLANK" role="link">${matched}</a>`
    );
  }

  // hashtags
  text = text.replace(
    /#([^\s#]+)/g,
    `<a class="text-decoration-none hashtag" href="/hashtag/$1" role="link">#$1</a>`
  );

  return text;
}
