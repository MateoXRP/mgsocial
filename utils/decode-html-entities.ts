import { decode } from 'html-entities';

const decodeHTMLEntities = (text: string) => decode(decode(text));

export default decodeHTMLEntities;
