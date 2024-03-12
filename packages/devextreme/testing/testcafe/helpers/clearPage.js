/* eslint-disable no-undef */
const testCafe = require('testcafe');

module.exports = {
    clearTestPage: async function() {
        await testCafe.ClientFunction(() => {
            const body = document.querySelector('body');
            const parentContainer = document.getElementById('parentContainer');

            parentContainer.remove();

            const containerElement = document.createElement('div');
            containerElement.setAttribute('id', 'container');

            const otherContainerElement = document.createElement('div');
            otherContainerElement.setAttribute('id', 'otherContainer');

            const parentContainerElement = document.createElement('div');
            parentContainerElement.setAttribute('id', 'parentContainer');

            parentContainerElement.append(containerElement, otherContainerElement);
            body.prepend(parentContainerElement);

            $('#stylesheetRules').remove();
            $('.dx-overlay-wrapper').remove();
        })();
    }
};
