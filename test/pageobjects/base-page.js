const installGetters = require('./../shared/install-getters');

/**
 * BasePage class that provides core utilities for all page objects.
 * Automatically installs element getters based on the selectors provided.
 */
class BasePage {
    /**
     * @param {Object} selectors - Optional object with element selectors to install as getters
     */
    constructor(selectors = {}) {
        installGetters.call(this, selectors);
    }

    /**
     * Navigates the browser to the given URL.
     * @param {string} url - The full URL to open (e.g., 'https://example.com/products/123')
     */
    async openURL(url) {
        await browser.url(url);
    }

    /**
     * Gets the current browser URL.
     * @returns {Promise<string>} The full current URL
     */
    async getUrl() {
        return await browser.getUrl();
    }
}

module.exports = BasePage;