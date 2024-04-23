/* eslint-disable no-undef */
const testCafe = require('testcafe');

module.exports = {
    clearTestPage: async function() {
        const shadowDom = process.env.shadowDom === 'true';

        await testCafe.ClientFunction(() => {
            const widgetSelector = '.dx-widget';
            const $elements = $(widgetSelector)
                .filter((_, element) => $(element).parents(widgetSelector).length === 0);
            $elements.each((_, element) => {
                const $widgetElement = $(element);
                const widgetNames = $widgetElement.data().dxComponents;
                widgetNames?.forEach((name) => {
                    if($widgetElement.hasClass('dx-widget')) {
                        $widgetElement[name]?.('dispose');
                    }
                });
                $widgetElement.empty();
            });

            const body = document.querySelector('body');
            const parentContainer = document.getElementById('parentContainer');

            if(shadowDom) {
                parentContainer?.remove();
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

            $('#stylesheetRules').remove();
        }, {
            dependencies: {
                shadowDom,
            }
        })();
    }
};
