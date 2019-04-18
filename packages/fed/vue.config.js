module.exports = {
  lintOnSave: false,

  pluginOptions: {
    apollo: {
      enableMocks: true,
      enableEngine: false
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#CF21A4',
          'link-color': '#CF21A4',
          'border-radius-base': '2px'
        },
        javascriptEnabled: true
      }
    }
  }
};
