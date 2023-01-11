import parser from '../parser.js';

const url = {
  method: 'url',
  puppeteer: true,
  output: (flags, raw, params, url) => parser.outputVal(raw, params, 'title', url)
}

export {url};