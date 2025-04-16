/**
 * Using your preferred test framework, write a test script to:
 * Navigate to http://eng-qa-interview.s3-website-us-east-1.amazonaws.com/.
 * Scroll dynamically to the nth item.
 * Add any text comment.
 * Verify that the comment is successfully saved.
 */

const {$, browser} = require('@wdio/globals');
const chaiExpect = require('chai').expect;

const SELECTORS = {
    //page 1
    title: '//h2[normalize-space()="Movie List"]',
    targetedButton: '//tbody/tr[%s]/td[3]/a[1]/button[1]',

    //page 2
    inputField: '//input[@type="text"]',
    addCommentButton: '//*[text()="Add Comment"]',
    outputField: "//li[1]",
}

describe('Abridge test 1', () => {
    it('should add text to particular line', async () => {
        await browser.url('http://eng-qa-interview.s3-website-us-east-1.amazonaws.com/');

        await addAndVerifyCommentByIndex('200', "My comment here");
    });
});


async function addAndVerifyCommentByIndex(index, commentText) {
    const pageTitle = await $(SELECTORS.title);
    await pageTitle.waitForDisplayed();

    const rowSelector = '//tbody/tr';
    let rows = await $$(rowSelector);

    let items = await $$('//tbody/tr');
    while (items.length < index) {
        await browser.execute(() => window.scrollBy(0, window.innerHeight));
        await browser.pause(1000);
        items = await $$(rowSelector);
    }

    const targetButtonXPath = SELECTORS.targetedButton.replace('%s', index);

    const targetedButton = await $(targetButtonXPath).click();
    const inputField = $(SELECTORS.inputField);
    await expect(inputField).toBeDisplayed();
    await inputField.click();
    await inputField.setValue(commentText);

    await $(SELECTORS.addCommentButton).click();

    const actualText = await $(SELECTORS.outputField).getText();
    chaiExpect(actualText).to.equal(commentText);

}
