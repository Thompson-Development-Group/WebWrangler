import parser from '../parser.js';
import cheerio from '../cheerio.js'

const text = {
  method: 'text',
  process: (flags, page, params, html, usingPuppeteer) => {
    let elem = cheerio.load(html)(params.selector || null)

    if (params.parent) {
      elem = elem.parents(params.parent)
    }

    return elem.text(params.property)
  },
  output: (flags, raw, params, url) => parser.outputVal(raw, params, null, url)
}

export {text};