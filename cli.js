#!/usr/bin/env node
'use strict'
import init from './index.js';

const printHelp = () => console.log(`Usage
  $ webwrangler <yaml file>`)

let node, webwrangler, file, flags = {}
node = process.argv[0]
webwrangler = process.argv[1]
file = process.argv[2]

if (!file){ 
    printHelp()

} else {
    process.argv.slice(3).map((a, i) => {
        let next = process.argv[3+i+1]
        if (a.startsWith('--')) {
          if (next.startsWith('--')) throw new Error('Invalid argument')
          flags[a.replace('--', '')] = next
        }
      })

init({
    file,
    flags,
    cli: true
  })
}



