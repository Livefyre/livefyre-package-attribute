var path = require('path');
var prefix = require('./prefix-css');

// Assume you're running this from the package root
var packageJson = require(path.join(process.cwd(), 'package.json'));

module.exports = prefix.bind({}, packageJson);
