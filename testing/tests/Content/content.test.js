import * as fontCarrier from 'font-carrier';
import { readdirSync } from 'fs';

QUnit.module('equlas svg to font', () => {
    const getCountElementInFont = (pathToFont) => {
        const transFont = fontCarrier.transfer(pathToFont);
        const glyphKeys = Object.keys(transFont.allGlyph());

        // First three svg empty
        const notEmptyKeys = glyphKeys.slice(3);

        return notEmptyKeys.length;
    };

    const getCountElementInSvg = (pathToSvg) => {
        const files = readdirSync(pathToSvg);
        return files.length;
    };

    QUnit.test('generic themes', function(assert) {
        const countElementGenericFont = getCountElementInFont('../../../icons/dxicons.ttf');
        const countElementGenericSvg = getCountElementInSvg('../../../images/icons/generic');

        assert.strictEqual(countElementGenericFont, countElementGenericSvg, 'Generic icons equal count with font');
    });

    QUnit.test('material themes', function(assert) {
        const countElementMaterialFont = getCountElementInFont('../../../icons/dxiconsmaterial.ttf');
        const countElementMaterialSvg = getCountElementInSvg('../../../images/icons/material');

        assert.strictEqual(countElementMaterialFont, countElementMaterialSvg, 'Material icons equal count with font');
    });
});
