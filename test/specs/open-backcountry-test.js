const { expect } = require('@wdio/globals');
const HomePage = require('../pageobjects/home-page');

describe('Test for Backcountry.com', () => {
    it('testing backcountry site', async () => {
        const TESTDATA = {
            baseURL: 'https://www.backcountry.com'
        };

        // Step 1: Open homepage
        await HomePage.openURL(TESTDATA.baseURL);

        // Step 2: Wait for the home page to load
        await HomePage.waitForHomePageToLoad();

        // Step 3: Close banner if present
        await HomePage.closeBannerIfPresent();

        // Step 4: Accept cookies if visible
        await HomePage.acceptCookiesIfVisible();

        //Step 5: Click on "Men" from the header menu, and select "Pants"
        await HomePage.headerMenu_Men.click();
        await HomePage.headerMenu_Men_Open.waitForDisplayed();
        await HomePage.headerMenu_Men_OpenPants.click();

        




    });
});
