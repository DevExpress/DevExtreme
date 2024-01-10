/* eslint-disable no-undef */
const testCafe = require('testcafe');

module.exports = {
    clearTestPage: async function() {
        await testCafe.ClientFunction(() => {
            const body = document.querySelector('body');

            body.innerHTML = `
            <div role="main">
                <h1 style="position: fixed; left: 0; top: 0; clip: rect(1px, 1px, 1px, 1px);">Test header</h1>
    
                <div id="container">
                </div>
                <div id="otherContainer">
                </div>
            </div>
            `;

            $('#stylesheetRules').remove();
        })();
    }
};
