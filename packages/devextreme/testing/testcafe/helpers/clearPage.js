/* eslint-disable no-undef */
const testCafe = require('testcafe');

const shadowDom = process.env.shadowDom === 'true';

module.exports = {
    clearTestPage: async function() {
        await testCafe.ClientFunction(() => {
            const body = document.querySelector('body');
            const parentContainer = document.getElementById('parentContainer');

            if(parentContainer) {
                if(shadowDom) {
                    parentContainer.remove();
                } else {
                    $(parentContainer).remove();
                }

                const containerElement = document.createElement('div');
                containerElement.setAttribute('id', 'container');

                const otherContainerElement = document.createElement('div');
                otherContainerElement.setAttribute('id', 'otherContainer');

                const parentContainerElement = document.createElement('div');
                parentContainerElement.setAttribute('id', 'parentContainer');

                parentContainerElement.append(containerElement, otherContainerElement);
                body.prepend(parentContainerElement);
            }

            $('#stylesheetRules').remove();
        }, {
            dependencies: {
                shadowDom,
            }
        })();
    }
};
