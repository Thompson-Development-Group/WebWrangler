/**
 * @param {object} err
 */
 const error = (err, exit) => {
    if (exit) {
      throw new Error(err)
    }
    else {
      console.error(err)
    }
  }
  
  /**
   * @param {object} err
   */
  const fatal = (err) => error(err, true)
  
  export default {error, fatal};