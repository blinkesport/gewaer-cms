const webpack = require("webpack");
//const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");


module.exports = {
    lintOnSave: false,
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/assets/scss/main.scss";`
            }
        }
    },
    configureWebpack: {
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
            new LodashModuleReplacementPlugin
        ],
        resolve: {
            alias: {
                "@c": `${__dirname}/src/components`,
                "@v": `${__dirname}/src/views`
            }
        }
    }
}
