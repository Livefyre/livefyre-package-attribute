var packageAttribute = 'data-lf-package';

module.exports = function (packageJson) {
    var boundPackageAttribute = {
        attribute: packageAttribute,
        value: packageName(packageJson)
    };

    /**
     * Decorate an HTMLElement with the proper package attribute
     * for streamhub-wall e.g.
     * data-lf-package="streamhub-wall#3.0.0"
     */
    boundPackageAttribute.decorate = function (el) {
        var currentVal = (el.getAttribute(packageAttribute) || '').trim();
        var currentPackageAttrs = currentVal.length ? currentVal.split(' ') : [];
        var newVal;
        // Add this package attribute value if it's not already there
        if (currentPackageAttrs.indexOf(boundPackageAttribute.value) === -1) {
            currentPackageAttrs.push(boundPackageAttribute.value);
            newVal = currentPackageAttrs.join(' ');
            el.setAttribute(packageAttribute, newVal);
        }
    };

    /**
     * Remove the package attribute from an HTMLElement
     */
    boundPackageAttribute.undecorate = function (el) {
        var currentVal = el.getAttribute(packageAttribute) || '';
        var newVal = currentVal.replace(boundPackageAttribute.value, '');
        el.setAttribute(packageAttribute, newVal);
    };

    /**
     * Decorate a streamhub-sdk/modal instance so that whenever it is shown,
     * the package attribute is added to its parentNode, and when it is hidden,
     * the attribute is removed
     */
    boundPackageAttribute.decorateModal = function modalWithPackageSelector(modal) {
        modal.$el.on('showing', setHasPackageAttribute.bind({}, modal, true));
        modal.$el.on('hiding', setHasPackageAttribute.bind({}, modal, false));
        return modal;
    };

    function setHasPackageAttribute(modal, shouldHaveAttr) {
        boundPackageAttribute[shouldHaveAttr ? 'decorate' : 'undecorate'](modal.parentNode);
    }

    return boundPackageAttribute;
};

function packageName(packageJson) {
    return packageJson.name + '#' + packageJson.version;
}
