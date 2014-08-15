/**
 * Prefix every rule in the in css string
 * with an attribute selector that targets only
 * elements in Components created from THIS version
 * of the module
 */
module.exports = function (packageJson, css, params) {
    params = params || {};
    // Unless specified with params.prefix, prefix all css rules with
    // [data-lf-module="streamhub-wall#VERSION"]
    var prefix = params.prefix;
    if ( ! prefix) {
        prefix = attrSelector('data-lf-package', packageName(packageJson)) + ' ';
    }
    console.log('prefixing css');
    var prefixedCss = prefixCss(prefix, css);
    return prefixedCss;
};

function attrSelector(attr, value) {
    var selector = '[{attr}~="{value}"]'
        .replace('{attr}', attr)
        .replace('{value}', value);
    return selector;
}

function packageName(packageJson) {
    return packageJson.name + '#' + packageJson.version;
}

function prefixCss(prefix, cssText) {
    var match, results = [],
        cssPattern = new RegExp("([^\\s][\\s\\S]*?)(\\{[\\s\\S]*?\\})", "g"),
        selectors, prefixedSelectors;

    while (match = cssPattern.exec(cssText)) {
        //There might be a concatenation of selectors, explode them
        selectors = match[1].split(",");
        prefixedSelectors = [];

        // if this is something like @font-face, it can't be prefixed so continue
        if (selectors.indexOf('@') === 0) {
            results.push(selectors, match[2]);
            continue;
        }

        for (var i = 0, l = selectors.length; i < l; i += 1) {
           prefixedSelectors.push(prefix + selectors[i]);
        }
        results.push(prefixedSelectors.join(","), match[2]);
    }

    return results.join("");
};
