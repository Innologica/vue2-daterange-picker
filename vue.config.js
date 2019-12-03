module.exports = {
  configureWebpack: config => {
    config.externals = {
      ...config.externals,
      ...process.env.NODE_ENV === 'test' ? null : { 'date-fns': 'date-fns'}
    }
  }
}
