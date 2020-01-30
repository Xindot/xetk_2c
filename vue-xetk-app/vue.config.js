const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'; // console.log(process.env.NODE_ENV)
const styleVariables = require('./src/assets/style/scss/variables'); // 在 SCSS 使用 JavaScript 变量 / scss全局变量
// console.log(styleVariables)

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '',
  lintOnSave: true,
  devServer: {
    proxy: {
      '/OilManApi/': {
        target: ['https://test.gushitech.com', 'https://api.gushitech.com'][1],
        // secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/OilManApi': '/'
        },
      },
      '/OilManTestApi/': {
        target: ['https://test.gushitech.com', 'https://api.gushitech.com'][0],
        // secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/OilManTestApi': '/'
        },
      },
      '/RestapiAmap/': {
        target: ['https://restapi.amap.com'][0],
        // secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/RestapiAmap': '/'
        },
      },
      '/SunApi/': {
        target: ['https://www.nianran.net/SunApi'][0],
        // secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/SunApi': '/'
        },
      },
    },
    https: true,
  },
  chainWebpack: (config) => {
    //修改文件引入自定义路径
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@icon', resolve('src/assets/icon'))
      .set('@img', resolve('src/assets/img'))
      .set('@style', resolve('src/assets/style'))
      .set('@pages', resolve('src/components/pages'))
      .set('@public', resolve('public'))
    // 生产环境配置
    if (isProduction) {
      // console.log('isProduction=>',true)
      // 删除预加载
      config.plugins.delete('preload');
      config.plugins.delete('prefetch');
      // 压缩代码
      config.optimization.minimize(true);
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all'
      })
    }
  },
  configureWebpack: config => {
    // 用cdn方式引入
    config.externals = {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      'axios': 'axios',
      'swiper': 'Swiper',
      'vconsole': 'VConsole',
      'md5': 'md5',
      'wx': 'jWeixin',
      'mint-ui': 'MINT',
      'vue-amap': 'VueAMap',
    }
    if (isProduction) {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }))
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,
              drop_console: true,
            },
          },
          sourceMap: false,
          parallel: true,
        })
      )
    }
    config.performance = {
      hints: 'warning',
      //入口起点的最大体积 整数类型（以字节为单位）
      maxEntrypointSize: 50000000,
      //生成文件的最大体积 整数类型（以字节为单位 300k）
      maxAssetSize: 30000000,
      //只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js');
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        // 在 SCSS 使用 JavaScript 变量 / scss全局变量
        data: Object.keys(styleVariables).map(k => `$${k}: ${styleVariables[k]};`).join('\n\r')
      }
    }
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  parallel: require('os').cpus().length > 1,
}