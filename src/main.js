var packageAttribute = 'data-lf-package';

function packageName(packageJson) {
    return packageJson.name + '#' + packageJson.version;
}

module.exports = function (packageJson) {
    var boundPackageAttribute = {
        attributes: [packageAttribute],
        values: [packageName(packageJson)]
    };

    /**
     * Decorate an HTMLElement with the proper package attribute
     * for streamhub-wall e.g.
     * data-lf-package="streamhub-wall#3.0.0"
     */
    boundPackageAttribute.decorate = function (el) {
        function addAttribute(attr, val) {
            var currentVal = (el.getAttribute(attr) || '').trim();
            var currentPackageAttrs = currentVal.length ? currentVal.split(' ') : [];
            var newVal;
            // Add this package attribute value if it's not already there
            if (currentPackageAttrs.indexOf(val) === -1) {
                currentPackageAttrs.push(val);
                newVal = currentPackageAttrs.join(' ');
                el.setAttribute(attr, newVal);
            }
        }
        
        boundPackageAttribute.attributes.forEach(function (attr, idx) {
            addAttribute(attr, boundPackageAttribute.values[idx]);
        });
    };

    /**
     * Remove the package attribute from an HTMLElement
     */
    boundPackageAttribute.undecorate = function (el) {
        function removeAttribute(attr, val) {
            var currentVal = el.getAttribute(attr) || '';
            var newVal = currentVal.replace(val, '');
            el.setAttribute(attr, newVal);
        }

        boundPackageAttribute.attributes.forEach(function (attr, idx) {
            removeAttribute(attr, boundPackageAttribute.values[idx]);
        });
    };

    /**
     * Decorate a streamhub-sdk/modal instance so that whenever it is shown,
     * the package attribute is added to its parentNode, and when it is hidden,
     * the attribute is removed
     */
    boundPackageAttribute.decorateModal = function modalWithPackageSelector(modal, opts) {
        opts = opts || {};

        if (opts.appIdKey && opts.appIdValue) {
            boundPackageAttribute.attributes.push(opts.appIdKey);
            boundPackageAttribute.values.push(opts.appIdValue);
        }

        if (modal) {
            modal.$el.on('showing', setHasPackageAttribute.bind({}, modal, true));
            modal.$el.on('hiding', setHasPackageAttribute.bind({}, modal, false));
        }
        return modal;
    };

    function setHasPackageAttribute(modal, shouldHaveAttr) {
        boundPackageAttribute[shouldHaveAttr ? 'decorate' : 'undecorate'](modal.parentNode);
    }

    return boundPackageAttribute;
};
