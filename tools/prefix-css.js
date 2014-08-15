/**
 * Prefix every rule in the in css string
 * with an attribute selector that targets only
 * elements in Components created from THIS version
 * of the module
 */
module.exports = function (packageJson, prefixCss, css, params) {
    params = params || {};
    // Unless specified with params.prefix, prefix all css rules with
    // [data-lf-module="streamhub-wall#VERSION"]
    var prefix = params.prefix;
    if ( ! prefix) {
        prefix = attrSelector('data-lf-package', packageName(packageJson)) + ' ';
    }
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

