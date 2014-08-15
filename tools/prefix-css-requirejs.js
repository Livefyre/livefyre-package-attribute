var packageJson = require('json!package.json');
var prefix = require('./prefix-css');

module.exports = prefix.bind({}, packageJson, prefixCss);

function prefixCss(prefix, cssText) {
    var match, results = [],
        cssPattern = new RegExp("([^\\s][\\s\\S]*?)(\\{[\\s\\S]*?\\})", "g"),
        selectors, prefixedSelectors;

    while (match = cssPattern.exec(cssText)) {
        //There might be a concatenation of selectors, explode them
        selectors = match[1].split(",");

        prefixedSelectors = [];

        // if this is something like @font-face, it can't be prefixed so continue
        if (selectors.length === 1 && selectors[0].trim().indexOf('@') === 0) {
            results.push(selectors.join(','), match[2]);
            continue;
        }

        for (var i = 0, l = selectors.length; i < l; i += 1) {
           prefixedSelectors.push(prefix + selectors[i]);
        }
        results.push(prefixedSelectors.join(","), match[2]);
    }

    return results.join("");
};
