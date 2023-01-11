import parser from '../parser.js';

const title = {
  method: 'title',
  puppeteer: true,
  output: (flags, raw, params, url) => parser.outputVal(raw, params, 'title', url)
}

export {title};