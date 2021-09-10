const { version } = require('../../package.json')

module.exports = {
  base: '/vue2-daterange-picker/',
  title: 'Vue2 date range picker - v' + version,
  description: 'Vue2 date range picker by Innologica',
  themeConfig: {
    nav: [
      { text: 'Github', link: 'https://github.com/Innologica/vue2-daterange-picker' }
    ],
    sidebar: [
      '/',
      '/advanced/'
    ],
    displayAllHeaders: true
  },
  plugins: [
    [ '@vuepress/back-to-top' ],
    [

      '@vuepress/google-analytics',
      {
        ga: 'UA-141652960-3',
      }
    ]
  ]
}
