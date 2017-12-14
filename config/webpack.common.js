const webpack = require('webpack');
const path = require('path');

/*
 * Webpack Plugins
 */
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
 * Webpack Constants
 */
const METADATA = {
    title: 'Mockingbird Society Data Portal',
    baseUrl: '/',
};

/*
 * Webpack configuration
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
    return {
        /*
         * The entry point for the bundle
         * See: http://webpack.github.io/docs/configuration.html#entry
         */
        entry: {
            'main': './src/index.js'
        },

        /*
         * Options affecting the resolving of modules.
         * See: http://webpack.github.io/docs/configuration.html#resolve
         */
        resolve: {
            /*
             * An array of extensions that should be used to resolve modules.
             *
             * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
             */
            extensions: ['.js', '.json'],
        },

        /*
         * Options affecting the normal modules.
         * See: http://webpack.github.io/docs/configuration.html#module
         */
        module: {
            rules: [
                /*
                 * Json loader support for *.json files.
                 * See: https://github.com/webpack/json-loader
                 */
                {
                    test: /\.json$/,
                    use: 'json-loader'
                },

                {
                    test: /.jsx?$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            query: {
                                presets: ['env', 'react']
                            }
                        }
                    ],
                    exclude: /node_modules/
                },

                /*
                 * to string and css loader support for *.css files (from Angular components)
                 * Returns file content as string
                 *
                 */
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },

                /* Raw loader support for *.html
                 * Returns file content as string
                 * See: https://github.com/webpack/raw-loader
                 */
                //{
                //    test: /\.html$/,
                //    use: 'raw-loader'
                //},

                /* File loader for supporting images, for example, in CSS files.
                 */
                {
                    test: /\.(jpg|png|gif)$/,
                    use: 'file-loader'
                },
                /* File loader for supporting fonts, for example, in CSS files.
                 */
                {
                    test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
                    use: 'file-loader'
                },
                /*
                 * Pug HTML loader support for *.pug files.
                 * See: https://github.com/webpack/pug-loader
                 */
                {
                    test: /\.pug$/,
                    use: ['html-loader', 'pug-html-loader']
                },
            ],

        },

        /*
         * Add additional plugins to the compiler.
         * See: http://webpack.github.io/docs/configuration.html#plugins
         */
        plugins: [
            /*
             * Plugin: HtmlWebpackPlugin
             * Description: Simplifies creation of HTML files to serve your webpack bundles.
             * This is especially useful for webpack bundles that include a hash in the filename
             * which changes every compilation.
             *
             * See: https://github.com/ampedandwired/html-webpack-plugin
             */
            new HtmlWebpackPlugin({
                template: './src/views/index.pug',
                title: METADATA.title,
                chunksSortMode: 'dependency',
                metadata: METADATA,
                inject: 'head'
            }),

            new ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            })
        ],

        /*
         * Include polyfills or mocks for various node stuff
         * Description: Node configuration
         *
         * See: https://webpack.github.io/docs/configuration.html#node
         */
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    };
}