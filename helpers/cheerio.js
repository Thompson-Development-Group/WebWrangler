import cheerio from 'cheerio'

let load = (html) => {
  return typeof html === 'string' ? cheerio.load(html) : html
}

let text = (html, selector) => typeof (html === 'string') ?
    load(html)(selector || null).text() :
    cheerio(selector || null).text()

let html = (html, selector) => {
  // Get full page html
  if (!selector && typeof html === 'string') return html

  // Get element html
  return typeof (html === 'string') ?
  load(html)(selector || null).html() :
  cheerio(selector || null).html()
}

export default { load, text, html};