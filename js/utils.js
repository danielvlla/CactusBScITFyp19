module.exports = {
  camelCase: (str) => {
    str = str.replace(/\s[a-z]/g, str.toUpperCase())
    return str;
  }
}