const { $, browser } = require('@wdio/globals');
// const chaiExpect = require('chai').expect;

const selectors = {
    siteLogo: '#DesktopLogoHorizontalIcon',
    searchBar: '//div[@id="DesktopNavArrowNav"]//input[@id="search-term"]',
    skiAndSnowboard: '//*[text()="Ski & Snowboard"]',
    snowboards:'//*[text()="Snowboards"]',
    acceptCookies:'//*[@id="onetrust-accept-btn-handler"]',
    discountBanner:'[data-attn-element-id="ToqJ"]',
    discountBannerClose:'#closeIconContainer',
    iframe:'#attentive_creative',
    snowboardsPageTitle:'//h1[text()="Snowboards"]',
    anyProductBrand:'[data-id="brandName"]',
    anyProductModel:'[data-id="title"]',
    searchResults:'//*[@id="suggestions-products"]',
    addToCart:'[data-id="addToCartButton"]',

};

describe('Add to cart', () => {
    it('Should display site logo', async () => {

        //go to the site
        await browser.url('https://www.backcountry.com/');

        //check the logo is displayed
        /** @type {import('webdriverio').Element} */
        const logoEl =  $(selectors.siteLogo);
        await logoEl.waitForDisplayed();
        await expect(logoEl).toBeDisplayed();

        //check page title
        const pageTitle = await browser.getTitle();
        expect(pageTitle).toEqual('Backcountry - Outdoor Gear & Clothing for Ski, Snowboard, Camp, & More');
        console.log('* * My Title = ', pageTitle);

        //check search bar placeholder
        /** @type {import('webdriverio').Element} */
        const searchBarEl = await $(selectors.searchBar);
        const placeholder = await searchBarEl.getAttribute('placeholder');
        console.log('* * placeholder =', placeholder);

        //close banner
        /** @type {import('webdriverio').Element} */
        const iframe = await $(selectors.iframe);
        await iframe.waitForExist({timeout:7000});
        await browser.switchFrame(iframe);

        /** @type {import('webdriverio').Element} */
        const bannerClose = await $(selectors.discountBannerClose);
        await bannerClose.waitForDisplayed({timeout: 10000});
        await bannerClose.click();
        // await bannerClose.waitForDisplayed({reverse:true, timeout:3000});
        await browser.switchToParentFrame();

        //accept cookies if displayed
        /** @type {import('webdriverio').Element} */
        const acceptCookies = await $(selectors.acceptCookies);
        if (acceptCookies){
            await acceptCookies.click();
        }
        await acceptCookies.waitForDisplayed({reverse:true, timeout:5000});

        //hover over ski & snowboard
        /** @type {import('webdriverio').Element} */
        const skiAndSnowboard = await $(selectors.skiAndSnowboard);
        await skiAndSnowboard.waitForDisplayed();
        await skiAndSnowboard.click();
        await browser.pause(3000);

        //select Snowboard
        /** @type {import('webdriverio').Element} */
        const snowboards = await $(selectors.snowboards);
        await snowboards.waitForDisplayed();
        const snowboardsMenuText = await snowboards.getText();
        console.log('* * snowboardsMenuText = ', snowboardsMenuText);


        await expect(snowboardsMenuText).toEqual('Snowboards');
        await snowboards.click();


        //get the names of all product
        /** @type {import('webdriverio').Element} */
        const snowboardsPageTitle = await $(selectors.snowboardsPageTitle);
        await snowboardsPageTitle.waitForDisplayed({timeoutMsg:"* *not displayed"});

        // /** @type {ChainablePromiseArray} */
        const products = await $$(selectors.anyProductBrand);

        let allProducts = [];
        for (let brandEl of products){
            let brand = await brandEl.getText();

            let modelEl = await brandEl.parentElement().$(selectors.anyProductModel);
            let model = await modelEl.getText();

            allProducts.push(`${brand} - ${model}`);
        }
        console.log('* * all products: ', allProducts);

        //check if "Skate Banana Snowboard - 2025" is in the list
        expect(allProducts).toContain('Lib Technologies - Skate Banana Snowboard - 2025');

        //enter "Skate Banana Snowboard - 2025" to the search and look for it
        await searchBarEl.setValue('Skate Banana Snowboard - 2025');

        /** @type {import('webdriverio').Element} */
        const searchResults = await $(selectors.searchResults);
        await searchResults.waitForDisplayed();

        let actualResults = await searchResults.getText();
        console.log("actualResults = ", actualResults);
        await expect(actualResults).toContain('Banana Snowboard');

        // open it
        /** @type {import('webdriverio').Element} */
        const targetedProduct = await $('//*[@id="suggestions-products"]//*[contains(text(),"Skate Banana")]');
        await targetedProduct.click();
        //await browser.pause(2000);

        //add to cart
        /** @type {import('webdriverio').Element} */
        const addToCart = await $(selectors.addToCart);
        await addToCart.waitForDisplayed();
        await addToCart.waitForEnabled();
        await addToCart.click();

        /** @type {import('webdriverio').Element} */
        const noSizeErrorAlert = await $('//*[@id="buybox-size-error"]');
        await noSizeErrorAlert.waitForDisplayed();
        let alertText = await noSizeErrorAlert.getText();
        await expect(alertText).toEqual('Please select an option');

        //select size option
        /** @type {import('webdriverio').Element} */
        const size154 = await $('//*[text()="154cm"]/..');
        await size154.click();
        await noSizeErrorAlert.waitForDisplayed({reverse:true, timeoutMsg:'the alert still displayed'});

        //add to cart again
        await addToCart.click();

        //verify it is added to the cart
        /** @type {import('webdriverio').Element} */
        const cartTab = await $('//*[@data-id="minicart-title"]/..');
        await cartTab.waitForDisplayed();

        let allCartText = await cartTab.getText();
        await expect(allCartText).toContain('Banana');

        //verify full product name
        /** @type {import('webdriverio').Element} */
        const productTitle = await $('[data-id="minicart-productname"]');
        let actualProductInTheCart = await productTitle.getText();
        expect(actualProductInTheCart).toEqual('Lib Technologies Skate Banana Snowboard - 2025');

        //close the cart
        /** @type {import('webdriverio').Element} */
        const closeCartButton = await $('[data-id="minicart-close"]');
        await closeCartButton.click();

        //scroll to the bottom
        await browser.keys(['End']);
        await browser.pause(1000);

        //scroll to search bar
        await searchBarEl.scrollIntoView();





    });

});

