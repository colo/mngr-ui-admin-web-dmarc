const path = require('path')
const webpack = require("webpack")

module.exports = {
	configureWebpack: {
    plugins: [
			new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
    	}),
    ],

  },
  chainWebpack: config => {
    config.module
			.rule('eslint')
	      .use('eslint-loader')
	      .loader('eslint-loader')
	      .tap(options => {
	        options.formatter = require('eslint').CLIEngine.getFormatter('stylish')
	        options.fix = true
	        return options
	      })
				.end()
			// .rule('datatables')
			// 	.test(/datatables\.net(?!.*[.]css$).*/)
			// 	.use('imports-loader')
			// 		.loader('imports-loader?define=>false')
			// 		.end()


  },

  pluginOptions: {
    'resolve-alias': {
			alias: {
        // '@': '/home/colo/projects/mngr-ui-admin-web-dmarc/src',
        // '@libs': '/home/colo/projects/mngr-ui-admin-web-dmarc/src/libs',
        // '@etc': '/home/colo/projects/mngr-ui-admin-web-dmarc/src/etc',
        // '@components': '/home/colo/projects/mngr-ui-admin-web-dmarc/src/components',
        // '@mixins': '/home/colo/projects/mngr-ui-admin-web-dmarc/src/mixins',
        // '@wrappers': '/home/colo/projects/mngr-ui-admin-web-dmarc/src/wrappers',
        // '@apps': '/home/colo/projects/mngr-ui-admin-web-dmarc/src/apps',
  			'@static': path.resolve(__dirname, './src/static'),
        '@libs': path.resolve(__dirname, './src/libs'),
        '@etc': path.resolve(__dirname, './src/etc'),
        '@components': path.resolve(__dirname, './src/components'),
        '@mixins': path.resolve(__dirname, './src/mixins'),
        // '@wrappers': path.resolve(__dirname, './src/components/wrappers'),
        '@apps': path.resolve(__dirname, './src/apps'),
        '@store': path.resolve(__dirname, './src/store'),
        // '@dashblocks': path.resolve(__dirname, './dashblocks'),
      }
    }
  }
}
