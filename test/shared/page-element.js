const CTRL_CM = process.platform === 'darwin' ? 'Meta' : 'Control';

class PageElement {
    /**
     * Creates a new PageElement instance with a selector.
     * @param {string} selector - The selector string used to find the element (CSS/XPath/etc.)
     * @param {string} [name] - Optional human-readable name for debugging or logging.
     */
    constructor(selector, name = '') {
        if (typeof selector !== 'string' || !selector.length) {
            throw new Error('PageElement requires a valid selector');
        }
        this.selector = selector;
        this.name = name;
    }


    /**
     * Finds and returns the WebdriverIO element instance for the current selector.
     * @returns {Promise<WebdriverIO.Element>}
     */
    async element() {
        return await $(this.selector);
    }


    /**
     * Method to check if the targeted element is displayed on the page.
     * @returns {Promise<boolean>}
     */
    async isDisplayed() {
        return (await this.element()).isDisplayed();
    }


    /**
     * Method to check if the element exists in the DOM.
     * @returns {Promise<boolean>}
     */
    async isExisting() {
        return (await this.element()).isExisting();
    }


    /**
     * Method to check if the element is currently enabled and interactable.
     * @returns {Promise<boolean>}
     */
    async isEnabled() {
        return (await this.element()).isEnabled();
    }


    /**
     * Gets the visible text content of the element.
     * Waits for the element to be displayed first.
     * @returns {Promise<string>}
     */
    async getText() {
        await this.waitForDisplayed();
        return (await this.element()).getText();
    }


    /**
     * Retrieves the value of a given attribute from the element.
     * @param {string} attribute - The name of the attribute to retrieve.
     * @returns {Promise<string>}
     */
    async getAttribute(attribute) {
        return (await this.element()).getAttribute(attribute);
    }


    /**
     * Gets the value of a CSS property from the element.
     * @param {string} property - The CSS property name (e.g. 'color', 'font-size')
     * @returns {Promise<any>} The resolved value of the CSS property
     */
    async getCSSProperty(property) {
        return (await this.element()).getCSSProperty(property);
    }


    /**
     * Returns the x and y location of the element on the screen.
     * @returns {Promise<{x: number, y: number}>}
     */
    async getLocation() {
        return (await this.element()).getLocation();
    }


    /**
     * Checks whether the element is visible in the current viewport.
     * Useful to verify if an element has scrolled into view.
     * @returns {Promise<boolean>}
     */
    async isDisplayedInViewport() {
        /** @type {WebdriverIO.Element} */
        const element = await this.element();
        return element.isDisplayedInViewport();
    }


    /**
     * Checks whether the element is selected (for checkboxes, radio buttons, etc).
     * @returns {Promise<boolean>}
     */
    async isSelected() {
        return (await this.element()).isSelected();
    }


    /**
     * Waits for the element to be visible on the page.
     * @param {number} timeout - Time in milliseconds to wait (default 10000ms).
     */
    async waitForDisplayed(timeout = 10000) {
        await (await this.element()).waitForDisplayed({ timeout });
    }


    /**
     * Waits for the element to be no longer visible on the page.
     * @param {number} timeout - Time in milliseconds to wait (default 10000ms).
     */
    async waitForNotDisplayed(timeout = 10000) {
        await (await this.element()).waitForDisplayed({ timeout, reverse: true });
    }


    /**
     * Waits for the element to exist in the DOM.
     * @param {number} timeout - Time in milliseconds to wait (default 10000ms).
     */
    async waitForExist(timeout = 10000) {
        await (await this.element()).waitForExist({ timeout });
    }


    /**
     * Waits for the element to be visible and enabled (interactable).
     * @param {number} timeout - Time in milliseconds to wait (default 10000ms).
     */
    async waitForEnabled(timeout = 5000) {
        const element = await this.element();
        await element.waitForDisplayed({ timeout });
        await element.waitForEnabled({ timeout });
    }


    /**
     * Types a value into an input field after ensuring it's ready.
     * @param {string} value - Text to set.
     */
    async setValue(value) {
        const element = await this.element();
        await this.waitForEnabled();
        await element.setValue(value);
    }


    /**
     * Appends a value to the existing value of an input field.
     * @param {string} value - Text to add.
     */
    async addValue(value) {
        const element = await this.element();
        await this.waitForEnabled();
        await element.addValue(value);
    }


    /**
     * Clears the input value from the field.
     */
    async clearValue() {
        await (await this.element()).clearValue();
    }


    /**
     * Clicks the element after ensuring it's interactable.
     */
    async click() {
        await this.waitForEnabled();
        await (await this.element()).click();
    }


    /**
     * Performs a double-click on the element.
     */
    async doubleClick() {
        await (await this.element()).doubleClick();
    }


    /**
     * Scrolls the element into the visible area of the browser window.
     */
    async scrollIntoView() {
        await (await this.element()).scrollIntoView();
    }


    /**
     * Moves the mouse to hover over the element.
     * @param {number} xOffset - Horizontal offset.
     * @param {number} yOffset - Vertical offset.
     */
    async moveTo(xOffset = 0, yOffset = 0) {
        await (await this.element()).moveTo({ xOffset, yOffset });
    }


    /**
     * Shortcut for moving to the element (hover).
     */
    async hover() {
        await this.moveTo();
    }


    /**
     * Sets focus on the element using JavaScript.
     * Useful for testing input behavior or triggering focus-related UI changes.
     */
    async focus() {
        await browser.execute(
            /**
             * @param {string} selector - CSS or XPath selector of the element to focus
             */
            (selector) => {
                const el = document.querySelector(selector);
                if (el) el.focus();
            },
            this.selector
        );
    }


    /**
     * Simulates Ctrl+V (or Cmd+V on Mac) to paste text into the element.
     */
    async pasteFromClipboard() {
        await this.focus();
        await browser.keys([CTRL_CM, 'v']);
        await browser.keys(CTRL_CM);
    }


    /**
     * Gets the full scroll height of the element from the DOM.
     * Useful when checking total content height inside scrollable containers.
     * @returns {Promise<number>} The scrollHeight value in pixels
     */
    async getScrollHeight() {
        return await browser.execute(
            /**
             * @param {string} sel - The selector string of the element
             * @returns {number}
             */
            (sel) => {
                const el = document.querySelector(sel);
                return el ? el.scrollHeight : 0;
            },
            this.selector
        );
    }


    /**
     * Gets the scrollTop value of the element from the DOM.
     * Useful to check how much an element has been scrolled vertically.
     * @returns {Promise<number>} The vertical scroll offset in pixels
     */
    async getScrollTopValue() {
        return await browser.execute(
            /**
             * @param {string} sel - The selector string of the element
             * @returns {number}
             */
            (sel) => {
                const el = document.querySelector(sel);
                return el ? el.scrollTop : 0;
            },
            this.selector
        );
    }


    /**
     * Sets a custom attribute on the element using JavaScript.
     * @param {string} attr - The attribute name to set (e.g., 'data-testid')
     * @param {string} value - The value to assign to the attribute
     * @example
     * await element.setAttribute('data-testid', 'my-button');
     */
    async setAttribute(attr, value) {
        await browser.execute(
            /**
             * @param {string} sel - The selector string
             * @param {string} attr - The attribute name
             * @param {string} val - The value to assign
             */
            (sel, attr, val) => {
                const el = document.querySelector(sel);
                if (el) {
                    el.setAttribute(attr, val);
                }
            },
            this.selector,
            attr,
            value
        );
    }


    /**
     * Applies a set of CSS styles to the element.
     * @param {Object} styleObj - Key/value map of CSS properties and values.
     * @example
     * await element.setStyle({ display: 'none', color: 'red' });
     */
    async setStyle(styleObj) {
        await browser.execute(
            /**
             * @param {string} sel
             * @param {Object} styles
             */
            (sel, styles) => {
                const el = document.querySelector(sel);
                if (el) {
                    for (const [prop, val] of Object.entries(styles)) {
                        el.style[prop] = val;
                    }
                }
            },
            this.selector,
            styleObj
        );
    }


    /**
     * Gets text from all elements matching the selector.
     * @returns {Promise<string[]>}
     */
    async getTextsUsingElements() {
        const elements = await $$(this.selector);
        const texts = [];
        for (const el of elements) {
            texts.push(await el.getText());
        }
        return texts;
    }


    /**
     * Returns the number of elements matching the selector.
     * @returns {Promise<number>}
     */
    async getNumberOfElements() {
        const elements = await $$(this.selector);
        return elements.length;
    }


    /**
     * Gets the text content from the first matching element using WebdriverIO command.
     * @returns {Promise<string>}
     */
    async getElementText() {
        const elements = await $$(this.selector);
        return await browser.getElementText(elements[0].elementId);
    }


    /**
     * Clicks the element using raw DOM query and JavaScript (alternative to WebDriver click).
     */
    async getElementAndClick() {
        await browser.execute(sel => document.querySelector(sel).click(), this.selector);
    }


    /**
     * Waits for the element to be present in the DOM using raw JavaScript.
     */
    async waitForDisplayedUsingDom() {
        await browser.execute(sel => document.querySelector(sel), this.selector);
    }


    /**
     * Waits until the element's text changes to a specific value.
     * @param {string} changeToText - Target text to wait for.
     * @param {number} timeout - Time to wait (default 10000ms).
     */
    async waitForChangeToText(changeToText, timeout = 10000) {
        await browser.waitUntil(async () => {
            const el = await this.element();
            const text = await el.getText();
            return text === changeToText || text.trim() === changeToText;
        }, {
            timeout,
            timeoutMsg: `Expected text to change to "${changeToText}"`,
        });
    }


    /**
     * Checks if the element is disabled (via 'disabled' attribute or class).
     * @returns {Promise<boolean>}
     */
    async isDisabled() {
        const el = await this.element();
        const attr = await el.getAttribute('disabled');
        const cls = await el.getAttribute('class');
        return attr !== null || cls.includes('disabled');
    }


    /**
     * Waits for the element to be removed from the DOM.
     * @param {number} timeout - Optional timeout (default 10000ms).
     */
    async waitForNotExist(timeout = 10000) {
        await (await this.element()).waitForExist({ timeout, reverse: true });
    }
}

module.exports = PageElement;
