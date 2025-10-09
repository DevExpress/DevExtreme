import { computeStyleSheetsHash, addShadowDomStyles } from '__internal/core/utils/shadow_dom';

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

        const styleSheet = new CSSStyleSheet();

        await styleSheet.replace(':host { background: red; }');
        shadow.adoptedStyleSheets = [styleSheet];

        const div = document.createElement('div');
        shadow.appendChild(div);

        const $div = $(div);
        addShadowDomStyles($div);

        assert.equal(shadow.adoptedStyleSheets.length, 2, 'Two stylesheets were adopted (global + shadow)');
        assert.ok(shadow.adoptedStyleSheets[0], 'Global sheet exists');
        assert.ok(shadow.adoptedStyleSheets[1], 'Local computed sheet exists');

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
        const firstCount = shadow.adoptedStyleSheets.length;

        addShadowDomStyles($div);
        const secondCount = shadow.adoptedStyleSheets.length;

        assert.equal(firstCount, secondCount, 'Stylesheets count unchanged after repeated call');

        done();
    });
});
