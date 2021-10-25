export default function createTemporaryLink(href: string) {
  const evLink = document.createElement('a');
  evLink.href = href;
  evLink.target = '_blank';
  document.body.appendChild(evLink);
  evLink.click();
  // Now delete it
  evLink.parentNode?.removeChild(evLink);
}
