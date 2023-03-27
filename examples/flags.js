

/**
 * This example shows how how to input an url from NodeJS into webwrangler
 */

const WebWrangler = require('../')

WebWrangler.init({
  file: 'methods/flags.yml',
  flags: {
    url: 'https://google.com'
  }
})
.then(result => console.log(result))