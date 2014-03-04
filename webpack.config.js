var path = require('path');
var webpack = require('webpack');

module.exports = {
	cache: true,
	devtool: 'sourcemap',
	debug: true,
	context: path.join(__dirname, 'public'),
	entry: './js/main.jsx',
	output: {
		path: path.join(__dirname, 'client', 'bundle'),
		publicPath: 'bundle/',
		filename: 'all.js'
	},
	resolve: {
		modulesDirectories: ['node_modules']
	},
	module: {
		loaders: [{
				test: /\.jsx?$/,
				loader: 'jsx-loader'
			}, {
				test: /\.gif/,
				loader: 'url-loader?limit=10000&minetype=image/gif'
			}, {
				test: /\.jpg/,
				loader: 'url-loader?limit=10000&minetype=image/jpg'
			}, {
				test: /\.png/,
				loader: 'url-loader?limit=10000&minetype=image/png'
			},
			{
				test: /\.less$/,
				loader: 'style-loader!css-loader!less-loader'
			}, {
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.woff$/,
				loader: 'url-loader?limit=5000&minetype=application/font-woff'
			}, {
				test: /\.ttf$/,
				loader: 'file-loader'
			}, {
				test: /\.eot$/,
				loader: 'file-loader'
			}, {
				test: /\.svg$/,
				loader: 'file-loader'
			}
		]
	},
	plugins: [
		new webpack.optimize.DedupePlugin()
	]
};