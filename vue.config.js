module.exports = {
  filenameHashing: false,
  assetsDir: "static",
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-svg-inline-loader")
      .loader("vue-svg-inline-loader");
  },
  configureWebpack: {
    resolve: {
      alias: {
        ScrollMagicGSAP:
          "scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap"
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "imports-loader?define=>false"
        }
      ]
    }
  }
};
