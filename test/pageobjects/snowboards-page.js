const BasePage = require('./base-page');
const installGetters = require('../shared/install-getters');

const SELECTORS = {
    pageTitle: '//h1[text()="Snowboards"]',
    productBrand: '[data-id="brandName"]',
    productModel: '[data-id="title"]',
    searchResults: '#suggestions-products',
    addToCartBtn: '[data-id="addToCartButton"]',
    sizeOption154: '//*[text()="154cm"]/..',
    sizeErrorAlert: '#buybox-size-error',
    miniCartTab: '//*[@data-id="minicart-title"]/..',
    cartProductName: '[data-id="minicart-productname"]',
    closeCartBtn: '[data-id="minicart-close"]',
};

/**
 * Page object for the Snowboards page.
 * Includes methods for interacting with product listings, search results, and cart actions.
 */
class SnowboardsPage extends BasePage {
    constructor() {
        super(SELECTORS);
        installGetters.call(this, SELECTORS);
    }


    /**
     * Waits until the Snowboards page title is visible.
     */
    async waitForPageToLoad() {
        await this.pageTitle.waitForDisplayed(10000);
    }

    /**
     * Collects all visible snowboard product names from the listing.
     * @returns {Promise<string[]>} Array of product names in "Brand - Model" format
     */
    async getAllSnowboardNames() {
        const brandEls = await $$(SELECTORS.productBrand);
        const names = [];

        for (const brandEl of brandEls) {
            const brand = await brandEl.getText();
            const modelEl = await brandEl.parentElement().$(SELECTORS.productModel);
            const model = await modelEl.getText();
            names.push(`${brand} ${model}`);
        }
        return names;
    }

    /**
     * Waits for the live search result container to become visible.
     */
    async waitForSearchSuggestions() {
        await this.searchResults.waitForDisplayed();
    }

    /**
     * Clicks on a product suggestion by matching part of the name.
     * @param {string} partialName - Substring of the product name
     */
    async selectFromSearchResults(partialName) {
        const result = await $(`//*[@id="suggestions-products"]//*[contains(text(),"${partialName}")]`);
        await result.waitForDisplayed();
        await result.click();
    }

    /**
     * Adds the product to the cart, including handling required size selection.
     */
    async addProductToCartFlow() {
        await this.addToCartBtn.click();
        await this.sizeErrorAlert.waitForDisplayed();
        await this.sizeOption154.click();
        await this.sizeErrorAlert.waitForNotDisplayed();
        await this.addToCartBtn.click();
    }

    /**
     * Verifies whether the product with a given name appears in the mini cart.
     * @param {string} expectedName - Full product name to match
     * @returns {Promise<boolean>}
     */
    async verifyProductInCart(expectedName) {
        await this.miniCartTab.waitForDisplayed();
        await this.cartProductName.waitForDisplayed();
        const actualProduct = await this.cartProductName.getText();
        expect(actualProduct).toEqual(expectedName);
    }

    /**
     * Closes the mini cart popup.
     */
    async closeCart() {
        await this.closeCartBtn.click();
    }
}

module.exports = new SnowboardsPage();
