import parser from '../parser.js';
import cheerio from '../cheerio.js'

const property = {
  method: 'property',
  process: (flags, page, params, html, usingPuppeteer) => {
    let elem = cheerio.load(html)(params.selector)
    
    if (params.parent) {
      elem = elem.parents(params.parent)
    }

    return elem.attr(params.property)
  },
  output: (flags, raw, params, url) => parser.outputVal(raw, params, null, url)
}

export {property};