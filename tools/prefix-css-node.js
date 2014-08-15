var path = require('path');
var prefix = require('./prefix-css');
var rework = require('rework');

// Assume you're running this from the package root
var packageJson = require(path.join(process.cwd(), 'package.json'));

module.exports = prefix.bind({}, packageJson, prefixCss);

function prefixCss(prefix, css) {
    var prefixedCss = rework(css)
            .use(rework.prefixSelectors(prefix))
            .toString();
    return prefixedCss;
}
