

const path = require('path');
const webpack = require('webpack');
const bodyParser = require('body-parser');
 let conf = {
  	entry: './index.html',
  	output: {
    	path: path.resolve(__dirname, 'build'),
		filename: 'index.html',
		publicPath: 'build/'
  	},
  	devServer: {       
        overlay: true,        
    },  
	module: {
		rules: [
	      {
	        test: /\.js$/,
	        exclude: /node_modules/,
	        use: {
	          loader: "babel-loader"
	        }
	      }
	    ]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
    ],
	devtool: 'eval-sourcemap'
};

module.exports = conf;

module.exports = (_env, _options) => {

	let production = (_options.mode === 'production');

	conf.devtool = production ? false : 'eval-sourcemap';
	// conf.devtool = production ? 'source-map' : 'eval-sourcemap';

	return conf;
}