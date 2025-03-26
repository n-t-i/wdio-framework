const PageElement = require('./page-element');

/**
 * Installs element getters on a page object dynamically based on a selector object.
 * Each key in the selectors object will be turned into a lazy getter that returns a PageElement instance.
 *
 * @param {Object} selectorObject - An object mapping element names to CSS/XPath selectors.
 *
 * @example
 * const SELECTORS = {
 *   searchInput: '#search',
 *   submitBtn: '//button[text()="Submit"]'
 * };
 *
 * installGetters.call(this, SELECTORS);
 * // Then you can use: this.searchInput.click(), this.submitBtn.setValue('abc'), etc.
 */
function installGetters(selectorObject) {
    for (const key of Object.keys(selectorObject)) {
        if (typeof selectorObject[key] === 'object' && selectorObject[key] !== null) {
            // Nested object (e.g., section or group of selectors)
            installGetters.call(this, selectorObject[key]);
        } else {
            Object.defineProperty(this, key, {
                get() {
                    return new PageElement(selectorObject[key], key);
                },
                configurable: true,
                enumerable: true
            });
        }
    }
}

module.exports = installGetters;