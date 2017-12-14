const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const path = require('path');

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

/**
 * Webpack Constants
 */
const BUILD_NUMBER = 'Development';
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;
const AUTH_CONFIG = {
    TENANT_ID: process.env.AUTH_TENANTID || 'mbsportaldev.onmicrosoft.com',
    CLIENT_ID: process.env.AUTH_CLIENTID || '89690ec1-4833-4002-8ead-02c042458a11',
    SIGNIN_POLICY: process.env.AUTH_SIGNIN_POLICY || 'B2C_1_SignIn1'
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

/**
 * Webpack configuration
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
    return webpackMerge(commonConfig(), {
        /**
         * Options affecting the output of the compilation.
         * See: http://webpack.github.io/docs/configuration.html#output
         */
        output: {
            /**
             * The output directory as absolute path (required).
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
            sourceMapFilename: '[file].map',

            /** The filename of non-entry chunks as relative path
             * inside the output.path directory.
             *
             * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
             */
            chunkFilename: '[id].chunk.js',

            library: 'ac_[name]',
            libraryTarget: 'var'
        },

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
            // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
            new DefinePlugin({
                'BUILD_NUMBER': JSON.stringify(METADATA.BUILD_NUMBER),
                'ENV': JSON.stringify(METADATA.ENV),
                'APPINSIGHTS_INSTRUMENTATION_KEY': JSON.stringify(METADATA.APPINSIGHTS_INSTRUMENTATION_KEY),
                'AUTH_CONFIG': JSON.stringify(METADATA.AUTH_CONFIG),
                'process.env': {
                    'BUILD_NUMBER': JSON.stringify(METADATA.BUILD_NUMBER),
                    'ENV': JSON.stringify(METADATA.ENV),
                    'NODE_ENV': JSON.stringify(METADATA.ENV),
                    'APPINSIGHTS_INSTRUMENTATION_KEY': JSON.stringify(METADATA.APPINSIGHTS_INSTRUMENTATION_KEY),
                    'AUTH_CONFIG': JSON.stringify(METADATA.AUTH_CONFIG)
                }
            })
        ],

        /**
         * Webpack Development Server configuration
         * Description: The webpack-dev-server is a little node.js Express server.
         * The server emits information about the compilation state to the client,
         * which reacts to those events.
         *
         * See: https://webpack.github.io/docs/webpack-dev-server.html
         */
        devServer: {
            port: METADATA.port,
            host: METADATA.host,
            historyApiFallback: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            }
        },

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
    });
}