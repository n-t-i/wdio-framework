/**
 * Improved test script for:
 * Navigate to http://eng-qa-interview.s3-website-us-east-1.amazonaws.com/.
 * Scroll dynamically to the nth item.
 * Add any text comment.
 * Verify that the comment is successfully saved.
 */

const {$, browser} = require('@wdio/globals');
const chaiExpect = require('chai').expect;

// Configurable timeout
const TIMEOUT = 10000;

const SELECTORS = {
    // Page 1
    title: '//h2[normalize-space()="Movie List"]',
    targetedButton: '//tbody/tr[%s]/td[3]/a[1]/button[1]',

    // Page 2
    inputField: '//input[@type="text"]',
    addCommentButton: '//*[text()="Add Comment"]',
    outputField: "//li[1]",
};

describe('Abridge test 1 (Improved)', () => {
    it('should add text to a particular line', async () => {
        const index = 200;
        const commentText = "My comment here";

        console.log(`Starting test: Adding comment "${commentText}" to row ${index}`);
        await browser.url('http://eng-qa-interview.s3-website-us-east-1.amazonaws.com/');

        await addAndVerifyCommentByIndex(index, commentText);
        console.log(`Test completed successfully: Comment "${commentText}" added to row ${index}`);
    });
});

async function addAndVerifyCommentByIndex(index, commentText) {
    if (!Number.isInteger(index) || index <= 0) {
        throw new Error(`Invalid index: ${index}. Index must be a positive integer.`);
    }

    const pageTitle = await $(SELECTORS.title);
    await pageTitle.waitForDisplayed({ timeout: TIMEOUT });

    await scrollToRow(index);

    const targetButtonXPath = SELECTORS.targetedButton.replace('%s', index);
    const targetedButton = await $(targetButtonXPath);
    await validateElement(targetedButton, `Targeted button for row ${index}`);
    await targetedButton.click();

    const inputField = await $(SELECTORS.inputField);
    await validateElement(inputField, "Input field");
    await inputField.click();
    await inputField.setValue(commentText);

    const addCommentButton = await $(SELECTORS.addCommentButton);
    await validateElement(addCommentButton, "Add Comment button");
    await addCommentButton.click();

    const outputField = await $(SELECTORS.outputField);
    await validateElement(outputField, "Output field");
    const actualText = await outputField.getText();
    chaiExpect(actualText).to.equal(commentText, `Expected comment text to be "${commentText}" but got "${actualText}".`);
}

async function scrollToRow(index) {
    const rowSelector = '//tbody/tr';
    await browser.waitUntil(async () => {
        const items = await $$(rowSelector);
        if (items.length >= index) {
            return true;
        }
        console.log(`Scrolling to load more rows. Current rows: ${items.length}, Target: ${index}`);
        await browser.execute(() => window.scrollBy(0, window.innerHeight));
        return false;
    }, {
        timeout: TIMEOUT,
        timeoutMsg: `Failed to load enough rows to reach index ${index}.`
    });
}

async function validateElement(element, elementName) {
    const isDisplayed = await element.isDisplayed();
    if (!isDisplayed) {
        throw new Error(`${elementName} is not displayed as expected.`);
    }
    console.log(`${elementName} is displayed.`);
}