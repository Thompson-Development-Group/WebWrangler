![webwrangler.png](/assets/banner.png)

(Node 12/14 Support For Meteor)

Web Wrangler is a powerful tool that helps you extract and organize data from the web. With Web Wrangler, you can easily scrape websites, extract specific data points, and turn unstructured information into structured data sets. Whether you're looking to gather data for research, analysis, or any other purpose, Web Wrangler has you covered. Its intuitive interface and customizable features make it a breeze to use, and it's fast and reliable, so you can get the data you need quickly and accurately. So if you're tired of manually sifting through web pages, let Web Wrangler do the heavy lifting for you. Try it out today and see how it can revolutionize your web data-gathering process.

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!


> There are examples for all WebWrangler features in the examples folder.

##### Table of Contents

- [Overview](#overview)
- [Browser config](#browser-config)
- [Output](#output)
- [Transform](#transform)
- [Types](#types)
- [Multi-jobs](#multi-jobs-support)
- [Steps](#steps)
  * [setContent](#setContent) Sets the HTML markup to assign to the page.
  * [goto](#goto) Navigate to an URL
  * [run](#run) Runs a group of steps by its name.
  * [goBack](#goBack) Navigate to the previous page in history
  * [screenshot](#screenshot) Takes a screenshot of the page
  * [pdf](#pdf) Takes a pdf of the page
  * [text](#text) Gets the text for a given CSS selector
  * [many](#many) Returns an array of elements given their CSS selectors
  * [title](#title) Gets the title for the current page.
  * [form](#form) Fill and submit forms
  * [html](#html) Return HTML code for the page or a DOM element
  * [click](#click) Click on an element (CSS and XPath selectors)
  * [url](#url) Return the current URL
  * [type](#type) Types a text (key events) in a given selector
  * [waitFor](#waitFor) Wait for selectors, time, functions, etc before continuing
  * [keyboardPress](#keyboardPress) Simulates the press of a keyboard key
  * [scrollTo](#scrollTo) Scroll to bottom, top, x, y, selector, xPath before continuing
  * [scrollToEnd](#scrollToEnd) Scroll to the very bottom (infinite scroll pages)

## Overview

You can use WebWrangler either as cli from your terminal or as a NodeJS library.

### Cli

*Install web wrangler:*
```bash
$ npm i webwrangler -g
```

```bash
$ webwrangler example/weather.yml --customFlag "custom flag value"
Result:

{
  "title": "Evansville, WI Weather Forecast and Conditions - The Weather Channel | Weather.com",
  "city": "Evansville, WI",
  "temp": 45
}
```

### Library

```javascript
const webwrangler = require('webwrangler')
const parsingResult = await webwrangler.init({
  file: 'jobdefinition.yml'
  flags: { ... } // optional
})
```

#### Methods

##### init(options)

options:
One of YAML, `file` or `string` is required.

- `yaml`: A [YAML npm module](https://www.npmjs.com/package/yaml) instance of the scraping definition.
`string` The YAML definition is a plain string.
the file path for the YAML file containing the scraping definition.

Additionally, you can pass a `flags` object property to input additional values
to your scraping process.

## Browser config
You can set up Chrome's details in the `browser` property within the main job.

None of the following settings are required.

```yaml
jobs:
  main:
    browser:
      width: 1200
      height: 800
      scaleFactor: 1
      timeout: 60
      delay: 0
      headless: true
      executablePath: ''
      userDataDir: ''
      keepOpen: false
```

- executablePath: If provided, Web Wrangler will launch Chrome from the specified
path.
- userDataDir: If provided, Web Wrangler will launch Chrome with the specified
user's profile.

## Output
For WebWrangler to get content, it needs some very basic details. This is:

- `as` the property you want to be returned
- `selector`, the CSS selector to extract the HTML or text from

Other optional options are

- `parent` Get the parent of the element filtered by a selector. 

Example

```yaml
text:
  selector: .entry-title
  as: entryLink
  parent: a
```

## Transform

When you extract texts from a web page, you might want to transform the data
before returning them. [example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/transform.yml)

You can use the following `- transform` methods:

- `uppercase` transforms the result to uppercase
- `lowercase` transforms the result into lowercase
- `absoluteUrl` return the absolute URL for a link

## Types

When extracting details from a page, you might want them to be returned in
different formats, for example as a number in the example of grabbing temperatures.
[example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/type.yml)

You can use the following values for `- type`:

- `string`
- `number` 
- `integer` 
- `float` 
- `fcd` transform to **f**loat a string number that uses commas for thousands
- `fdc` transform to **f**loat a string number that uses dots for thousands

## Multi-jobs support

You can define groups of steps (jobs) that you can reuse at any moment during a
scraping process.

For example, let's say you want to sign up twice on a website. You will have a
"main" job (that executes by default) but you can create an additional one called
"signup", that you can reuse in the "main" one.

```yaml
version: 1
jobs:
  main:
    steps:
      - goto: https://example.com/
      - run: signup
      - click: '#logout'
      - run: signup
  signup:
    steps:
      - goto: https://example.com/register
      - form:
          selector: "#signup-user"
          submit: true
          fill:
            - selector: '[name="username"]'
              value: jonsnow@example.com
```

## Steps

Steps are the list of things the browser must do.

## setContent

Sets the HTML markup to assign to the page.

Setting a string:

```yaml
- setContent:
    html: Hello!
```

Loading the HTML from a file:

```yaml
- setContent:
    file: myMarkup.html
```

Loading the HTML from an environment variable:

```yaml
- setContent:
    env: MY_MARKUP_ENVIRONMENT_VARIABLE
```

Loading the HTML from a flag:

```yaml
- setContent:
    flag: markup
```

## goto

URL to navigate the page. The URL should include a scheme (e.g. https://). [example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/goBack.yml)

```yaml
- goto: https://example.com
```

You can also tell WebWrangler to don't use Puppeteer to browse, and instead do a
direct HTTP request via got. This will perform much faster, but it may not be
suitable for websites that require JavaScript. [simple example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/getRequest.yml) / 
[extended example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/many_using_get.yml)

> Note that some methods (for example: `form`, `click` and others) will not be
available if you are not browsing using puppeteer.

```yaml
- goto:
    url: https://google.com
    method: got
```

You can also tell WebWrangler which URLs it should visit via flags (available via CLI and library). Example:

```yaml
- goto:
    flag: websiteUrl
```

You can then call web wrangler as:

```bash
webwrangler definition.yaml --websiteUrl "https://google.com"
```

or 

```javascript
webwrangler.init({
  file: 'definition.yml'
  flags: { websiteUrl: 'https://google.com' }
})
```

[example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/flags.js)

### Authentication

You can perform basic HTTP authentication by providing the user and password as in the following example:

```yml
- goto: 
    url: http://example.com
    method: got
    authentication:
      type: basic
      username: my_user
      password: my_password
```


## run

Runs a group of steps by its name.

```yaml
- run: signupProcess
```

## goBack

Navigate to the previous page in history. [example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/goBack.yml)

```yaml
- goBack
```

## screenshot
Takes a screenshot of the page. This triggers the puppeteer's [page screenshot](https://github.com/GoogleChrome/puppeteer/blob/v1.13.0/docs/api.md#pagescreenshotoptions).
[example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/screenshot.yml)

```yaml
- screenshot:
  - path: Github.png
```

If you are using WebWrangler as a NodeJS module, you can also get the screenshot
returned as a Buffer by using them `as` a property.

```yaml
- screenshot:
  - as: myScreenshotBuffer
```

## pdf

Takes a pdf of the page. This triggers the puppeteer's [page pdf](https://github.com/GoogleChrome/puppeteer/blob/v1.13.0/docs/api.md#pagepdfoptions)](https://github.com/GoogleChrome/puppeteer/blob/v1.13.0/docs/api.md#pagepdfoptions)

```yaml
- pdf:
  - path: Github.pdf
```

If you are using WebWrangler as a NodeJS module, you can also get the PDF file
returned as a Buffer by using them `as` a property.

```yaml
- pdf:
  - as: pdfFileBuffer
```

## title

Gets the title for the current page. If no output. as property is defined, the
page's title will the returned as `{ title }`. [example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/goBack.yml)

```yaml
- title
```

## many

Returns an array of elements given their CSS selectors. [example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/many.yml)

Example: 

```yaml
- many: 
  as: articles
  selector: main ol.articles-list li.article-item
  element:
    - text:
      selector: .title
      as: title
```

When you scrape a large amount of content, you might end up consuming a horde of RAM,
your system might become slow and the scraping process might fail.

To prevent this, WebWrangler allows you to use process events so you can have the
scraped contents as they are scraped, instead of storing them in memory and
waiting for the whole process to finish.

To do this, simply add an `event` property to `many`, with the event's name you
want to listen to. The event will contain each scraped item.

`event` will give you the data as it's being scraped. To prevent it from being
stored in memory, set `eventMethod` to `discard`.

[Example using events](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/many_event.js)

## form
Fill out and submit forms. [example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/form.yml)

Example: 

```yaml
- form:
    selector: "#tsf"            # form selector
    submit: true               # Submit after filling all details
    fill:                      # array of inputs to fill
      - selector: '[name="q"]' # input selector
        value: test            # input value
```

Using environment variables
```yaml
- form:
    selector: "#login"            # form selector
    submit: true                  # Submit after filling all details
    fill:                         # array of inputs to fill
      - selector: '[name="user"]' # input selector
        value:
          env: USERNAME           # process.env.USERNAME
      - selector: '[name="pass"]' 
        value: 
          env: PASSWORD           # process.env.PASSWORD
```

## html

Gets the HTML code. If no `selector` is specified, it returns the page's full HTML
code. If no output. as the property is defined, the result will be returned
as `{`HTML`}`. [example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/html.yml)

Example: 

```yaml
- html
    as: divHtml
    selector: div
```

## click

Click on an element. [example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/click.yml)

Example:
The default behavior (CSS selector)
```yaml
- click: button.click-me
```

Same as
```yaml
- click: 
    selector: button.click-me
```

By xPath (clicks on the first match)
```yaml
- click: 
    xPath: '/html/body/div[2]/div/div/div/div/div[3]/span'
```

## type

Sends a `keydown`, `keypress/input`, and `keyup` event for each character in
the text.

Example:

```yaml
- type:
    selector: input.user
    text: jonsnow@example.com
    options:
      delay: 4000
```

## url

Return the current URL.

Example:

```yaml
- url:
    as: currentUrl
```

## waitFor

Wait for specified CSS, and XPath selectors, on a specific amount of time before
continuing [example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/form.yml)

Examples: 

```yaml
- waitFor:
   selector: "#search-results"
```

```yaml
- waitFor:
   xPath: "/html/body/div[1]/header/div[1]/a/svg"
```

```yaml
- waitFor:
   function: "console.log(Date.now())"
```

```yaml
- waitFor:
    time: 1000 # Time in milliseconds
```

## keyboardPress

Simulates the press of a keyboard key. [extended docs](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardpresskey-options)

```yaml
- keyboardPress: 
    key: 'Enter'
```

## scrollTo

Scroll to specified CSS, XPath selectors, to bottom/top or specified x/y value before continuing [example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/scrollTo.yml)

Examples: 

```yaml
- scrollTo:
   top: true
```

```yaml
- scrollTo:
   bottom: true
```

```yaml
- scrollTo:
   x: 340
```

```yaml
- scrollTo:
   y: 500
```

```yaml
- scrollTo:
   selector: "#search-results"
```

```yaml
- scrollTo:
   xPath: "/html/body/div[1]/header/div[1]/a/svg"
```

## scrollToEnd

Scroll's to the very bottom (infinite scroll pages) [example](https://github.com/Thompson-Development-Group/webwrangler/blob/master/examples/helpers/scrollToEnd.yml)

This accepts three settings:
- **step:** how many pixels to scroll every time? The default is 10.
- **max:** up to how many pixels as the maximum you want to scroll down - so you are not waiting for decades on non-ending infinite scroll pages. The default is 9999999.
- **sleep:** how long to wait before scrolls - in milliseconds. Default is 100

Examples:

```yaml
- scrollToEnd
```

```yaml
- scrollToEnd:
    step: 300
    sleep: 1000
    max: 300000
```

## License

MIT © [Thompson Development Group](https://www.thompsondevgroup.com)
