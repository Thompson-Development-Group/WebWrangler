import parser from '../parser.js'
import cheerio from '../cheerio.js'

const html = {
  method: 'html',
  process: (flags, page, params, html, usingPuppeteer) => {
    if (!params.selector) return html
    
    let elem = cheerio.load(html)(params.selector || null)

    if (params.parent) {
      elem = elem.parents(params.parent)
    }

    return elem.html()
  },
  output: (flags, raw, params, url) => parser.outputVal(raw, params, 'html', url)
}

export {html};