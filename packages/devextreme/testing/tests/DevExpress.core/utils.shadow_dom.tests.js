import { computeStyleSheetsHash, addShadowDomStyles } from '__internal/core/utils/m_shadow_dom';

QUnit.module('computeStyleSheetsHash', () => {
    QUnit.test('Returns consistent hash for same content', function(assert) {
        const mockStyles = '.a { color: red; }';
        const styleSheet1 = new CSSStyleSheet();
        const styleSheet2 = new CSSStyleSheet();
        styleSheet1.replaceSync(mockStyles);
        styleSheet2.replaceSync(mockStyles);

        const hash1 = computeStyleSheetsHash([styleSheet1]);
        const hash2 = computeStyleSheetsHash([styleSheet2]);

        assert.equal(hash1, hash2, 'Hashes are equal for identical stylesheets');
    });

    QUnit.test('Returns different hash for different content', function(assert) {
        const styleSheet1 = new CSSStyleSheet();
        const styleSheet2 = new CSSStyleSheet();
        styleSheet1.replaceSync('.a { color: red; }');
        styleSheet2.replaceSync('.a { color: blue; }');

        const hash1 = computeStyleSheetsHash([styleSheet1]);
        const hash2 = computeStyleSheetsHash([styleSheet2]);

        assert.notEqual(hash1, hash2, 'Hashes differ for different stylesheets');
    });
});

QUnit.module('addShadowDomStyles', () => {
    QUnit.test('Applies styles to ShadowRoot via adoptedStyleSheets', async function(assert) {
        const done = assert.async();

        const container = document.createElement('div');
        document.body.appendChild(container);
        const shadow = container.attachShadow({ mode: 'open' });

        const globalStyleEl = document.createElement('style');
        globalStyleEl.textContent = '.dx-widget-host { background: red; }';
        document.body.appendChild(globalStyleEl);

        const shadowStyleEl = document.createElement('style');
        shadowStyleEl.textContent = '.dx-widget-shadow { color: blue; }';
        shadow.appendChild(shadowStyleEl);

        const div = document.createElement('div');
        shadow.appendChild(div);
        const $div = $(div);

        await new Promise(requestAnimationFrame);

        addShadowDomStyles($div);

        const sheets = shadow.adoptedStyleSheets;

        assert.equal(document.getElementsByTagName('style')[0].textContent, {}, 'test log document style[0]');
        assert.equal(document.getElementsByTagName('style')[1].textContent, {}, 'test log document style[0]');

        assert.equal(document.getElementsByTagName('html'), {}, 'test log document html');
        assert.equal(document.getElementsByTagName('div'), {}, 'test log document style');

        assert.equal(sheets, {}, 'test log sheets');
        assert.equal(sheets.length, 2, 'Two stylesheets were adopted (global + shadow)');
        assert.ok(sheets[0].cssRules.length > 0, 'Global sheet has rules');
        assert.ok(sheets[1].cssRules.length > 0, 'Local computed sheet has rules');

        done();
    });


    QUnit.test('Does not duplicate stylesheets on repeated calls', async function(assert) {
        const done = assert.async();
        const container = document.createElement('div');
        document.body.appendChild(container);
        const shadow = container.attachShadow({ mode: 'open' });

        const div = document.createElement('div');
        shadow.appendChild(div);
        const $div = $(div);

        addShadowDomStyles($div);
        const firstSheets = [...shadow.adoptedStyleSheets];
        const firstRules = firstSheets.map(sheet => sheet.cssRules.length);

        addShadowDomStyles($div);
        const secondSheets = [...shadow.adoptedStyleSheets];
        const secondRules = secondSheets.map(sheet => sheet.cssRules.length);

        assert.equal(firstSheets.length, secondSheets.length, 'Stylesheets count unchanged after repeated call');

        for(let i = 0; i < firstRules.length; i++) {
            assert.equal(firstRules[i], secondRules[i], `Sheet[${i}] cssRules count unchanged`);
        }
        done();
    });
});
