const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const path = require('path');

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

/**
 * Webpack Constants
 */
const BUILD_NUMBER = process.env.BUILD_BUILDID || 'Unknown';
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const AUTH_CONFIG = {
    TENANT_ID: process.env.AUTH_TENANTID || 'mbsportaldev.onmicrosoft.com',
    CLIENT_ID: process.env.AUTH_CLIENTID || '89690ec1-4833-4002-8ead-02c042458a11',
    SIGNIN_POLICY: process.env.SIGNIN_POLICY || 'B2C_1_SignIn1'
}
const APPINSIGHTS_INSTRUMENTATION_KEY = process.env.APPINSIGHTS_INSTRUMENTATION_KEY;

const METADATA = webpackMerge(commonConfig().metadata, {
        BUILD_NUMBER: BUILD_NUMBER,
        host: HOST,
        port: PORT,
        ENV: ENV,
        AUTH_CONFIG: AUTH_CONFIG,
        APPINSIGHTS_INSTRUMENTATION_KEY: APPINSIGHTS_INSTRUMENTATION_KEY
    });

const ROOT = path.resolve(__dirname, '..');

module.exports = function (env) {
    return webpackMerge(commonConfig(), {
            /**
             * Developer tool to enhance debugging
             *
             * See: http://webpack.github.io/docs/configuration.html#devtool
             * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
             */
            devtool: 'source-map',

            /**
             * Options affecting the output of the compilation.
             *
             * See: http://webpack.github.io/docs/configuration.html#output
             */
            output: {

                /**
                 * The output directory as absolute path (required).
                 *
                 * See: http://webpack.github.io/docs/configuration.html#output-path
                 */
                path: path.resolve(ROOT, 'public'),

                /**
                 * Specifies the name of each output file on disk.
                 * IMPORTANT: You must not specify an absolute path here!
                 *
                 * See: http://webpack.github.io/docs/configuration.html#output-filename
                 */
                filename: '[name].bundle.js',

                /**
                 * The filename of the SourceMaps for the JavaScript files.
                 * They are inside the output.path directory.
                 *
                 * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
                 */
                sourceMapFilename: '[name].[chunkhash].bundle.map',

                /**
                 * The filename of non-entry chunks as relative path
                 * inside the output.path directory.
                 *
                 * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
                 */
                chunkFilename: '[id].[chunkhash].chunk.js'
            },

            module: {
                rules: [
                ]
            },

            /**
             * Add additional plugins to the compiler.
             *
             * See: http://webpack.github.io/docs/configuration.html#plugins
             */
            plugins: [
                /**
                 * Plugin: DefinePlugin
                 * Description: Define free variables.
                 * Useful for having development builds with debug logging or adding global constants.
                 *
                 * Environment helpers
                 *
                 * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
                 */
                // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
                new DefinePlugin({
                    'BUILD_NUMBER': JSON.stringify(METADATA.BUILD_NUMBER),
                    'ENV': JSON.stringify(METADATA.ENV),
                    'APPINSIGHTS_INSTRUMENTATION_KEY': JSON.stringify(METADATA.APPINSIGHTS_INSTRUMENTATION_KEY),
                    'AUTH_CONFIG': JSON.stringify(METADATA.AUTH_CONFIG),
                    'process.env': {
                        'API_ENDPOINT': JSON.stringify(METADATA.API_ENDPOINT),
                        'BUILD_NUMBER': JSON.stringify(METADATA.BUILD_NUMBER),
                        'ENV': JSON.stringify(METADATA.ENV),
                        'NODE_ENV': JSON.stringify(METADATA.ENV),
                        'APPINSIGHTS_INSTRUMENTATION_KEY': JSON.stringify(METADATA.APPINSIGHTS_INSTRUMENTATION_KEY),
                        'AUTH_CONFIG': JSON.stringify(METADATA.AUTH_CONFIG)
                    }
                }),

                /**
                 * Plugin: UglifyJsPlugin
                 * Description: Minimize all JavaScript output of chunks.
                 * Loaders are switched into minimizing mode.
                 *
                 * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
                 */
                // NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
                new UglifyJsPlugin({
                    beautify: false, //prod
                    output: {
                        comments: false
                    }, //prod
                    mangle: {
                        screw_ie8: true
                    }, //prod
                    compress: {
                        screw_ie8: true,
                        warnings: false,
                        conditionals: true,
                        unused: true,
                        comparisons: true,
                        sequences: true,
                        dead_code: true,
                        evaluate: true,
                        if_return: true,
                        join_vars: true,
                        negate_iife: false // we need this for lazy v8
                    },
                }),

                /**
                 * Plugin LoaderOptionsPlugin (experimental)
                 *
                 * See: https://gist.github.com/sokra/27b24881210b56bbaff7
                 */
                new LoaderOptionsPlugin({
                    minimize: true,
                    debug: false,
                    options: {

                        /**
                         * Html loader advanced options
                         *
                         * See: https://github.com/webpack/html-loader#advanced-options
                         */
                        // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
                        htmlLoader: {
                            minimize: true,
                            removeAttributeQuotes: false,
                            caseSensitive: true,
                            customAttrSurround: [
                                [/#/, /(?:)/],
                                [/\*/, /(?:)/],
                                [/\[?\(?/, /(?:)/]
                            ],
                            customAttrAssign: [/\)?\]?=/]
                        },

                    }
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
                process: false,
                module: false,
                clearImmediate: false,
                setImmediate: false
            }
        });
}