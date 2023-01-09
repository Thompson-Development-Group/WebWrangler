const keyboardPress = {
    method: 'keyboardPress',
    process: async (flags, page, params, html) => {
      const { key, options } = params
      if (!key) throw new Error('incorrect-keyboardPress-options')
      await page.keyboard.press(key, options || {})
    }
  }
  
  export {keyboardPress};