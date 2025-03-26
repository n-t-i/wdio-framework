const BasePage = require('./base-page');
const installGetters = require('../shared/install-getters');

const SELECTORS = {
    siteLogo: '#DesktopLogoHorizontalIcon',
    searchBar: '#search-term',
    skiAndSnowboardMenu: '//*[text()="Ski & Snowboard"]',
    snowboardsLink: '//*[text()="Snowboards"]',
    acceptCookiesBtn: '#onetrust-accept-btn-handler',
    discountIframe: '#attentive_creative',
    closeBannerBtn: '#closeIconContainer',
};

/**
 * Page object for the Home page of the application
 * Provides actions for navigation, search, banner handling, and menu interaction
 */
class HomePage extends BasePage {
    constructor() {
        super(SELECTORS);
        installGetters.call(this, SELECTORS);
    }

    /**
     * Waits until the site logo is visible to ensure the home page is loaded.
     */
    async waitForHomePageToLoad() {
        await this.siteLogo.waitForDisplayed();
    }

    /**
     * Accepts the cookie consent banner if it's visible.
     */
    async acceptCookiesIfVisible() {
        if (await this.acceptCookiesBtn.isDisplayed()) {
            await this.acceptCookiesBtn.click();
        }
    }

    /**
     * Closes the promotional banner (if present) inside an iframe.
     */
    async closeBannerIfPresent() {
        await this.discountIframe.waitForExist(10000);
        const frameElement = await this.discountIframe.element();
        await browser.switchFrame(frameElement);
        await this.closeBannerBtn.waitForDisplayed();
        await this.closeBannerBtn.click();
        await browser.switchToParentFrame();
    }

    /**
     * Opens the "Ski & Snowboard" dropdown and clicks the "Snowboards" link.
     */
    async goToSnowboardsViaMenu() {
        await this.skiAndSnowboardMenu.click();
        await this.snowboardsLink.click();
    }

    /**
     * Enters a search query into the search bar.
     * @param {string} productName - The product name to search for.
     */
    async searchProduct(productName) {
        await this.searchBar.waitForDisplayed();
        await this.searchBar.setValue(productName);
    }
}

module.exports = new HomePage();
