'use strict';

var bootstrap = require('bootstrap'),
    d3 = require('d3');

var App = require('./app.jsx');

//  var bootstrapCSS = require('bootstrap/dist/css/bootstrap.css');
var bootstrapVendorJS = require('./vendor/bootstrap/js/bootstrap.bundle.min.js');
var bootstrapVendorCSS = require('./vendor/bootstrap/css/bootstrap.min.css');
var styleCSS = require('./stylesheets/style.css');

function component() {
    var element = document.createElement('div');

    element.innerHTML = ['Hello', 'webpack'].join(' ');

    return element;
}

// document.body.appendChild(component());