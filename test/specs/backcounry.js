const { expect } = require('@wdio/globals');
const HomePage = require('../pageobjects/home-page');
const SnowboardsPage = require('../pageobjects/snowboards-page');

describe('Add to Cart Flow', () => {
    it('should search and add a snowboard to the cart successfully', async () => {
        const TESTDATA ={
            baseURL: 'https://www.backcountry.com',
            productName: 'Lib Technologies Skate Banana Snowboard - 2025',
            searchKeyword: 'Skate Banana'
        }

        // Step 1: Open homepage and prepare UI
        await HomePage.openURL(TESTDATA.baseURL);
        await HomePage.waitForHomePageToLoad();
        await HomePage.closeBannerIfPresent();
        await HomePage.acceptCookiesIfVisible();

        // Step 2: Navigate to Snowboards from top menu
        await HomePage.goToSnowboardsViaMenu();
        await SnowboardsPage.waitForPageToLoad();

        // Step 3: Confirm product exists on the listing
        const allProductNames = await SnowboardsPage.getAllSnowboardNames();
        console.log('* * allProductNames',allProductNames)
        expect(allProductNames).toContain(TESTDATA.productName);

        // Step 4: Use search to navigate directly to product
        await HomePage.searchProduct(TESTDATA.searchKeyword);
        await SnowboardsPage.waitForSearchSuggestions();
        await SnowboardsPage.selectFromSearchResults(TESTDATA.searchKeyword);

        // Step 5: Add product to cart and verify
        await SnowboardsPage.addProductToCartFlow();
        await SnowboardsPage.verifyProductInCart(TESTDATA.productName)

        // Step 6: Close cart
        await SnowboardsPage.closeCart();
    });
});
