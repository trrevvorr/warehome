const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/warehome/" : "/",
  pwa: {
    themeColor: "#63e2b7",
    msTileColor: "rgb(16, 16, 20)",
    manifestOptions: {
      name: "WareHome",
      short_name: "WareHome",
    },
    iconPaths: {
      msTileImage: "img/icons/mstile-150x150.png",
    },
  },
});
