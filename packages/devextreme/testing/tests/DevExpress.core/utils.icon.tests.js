import { getImageSourceType, getImageContainer } from 'core/utils/icon';
import { getImageAriaLabel } from '__internal/core/utils/m_icon';
import localization from 'localization';
import ja from 'localization/messages/ja.json!';

const { module: testModule, test } = QUnit;

const ICON_CLASS = 'dx-icon';
const SVG_ICON_CLASS = 'dx-svg-icon';

testModule('icon utils', {
    beforeEach: function() {
        this.sourceArray = [{ // 1
            source: 'data:image/png;base64,qwertyuiopasdfghjklzxcvbmnQWERTYUIOPLKJHGFDSAZXCVBNM/+0987654321',
            result: 'image'
        },
        { // 2
            source: '../folder/123.jgp',
            result: 'image'
        },
        { // 3
            source: 'localhost/JFLSKDksjdhfolHWThr30oi',
            result: 'image'
        },
        { // 4
            source: 'glyphicon glyphicon-icon',
            result: 'fontIcon'
        },
        { // 5
            source: 'glyphicon-icon glyphicon',
            result: 'fontIcon'
        },
        { // 6
            source: 'fa fa-icon',
            result: 'fontIcon'
        },
        { // 7
            source: 'fa-lg fa-icon fa',
            result: 'fontIcon'
        },
        { // 8
            source: 'ion ion-icon',
            result: 'fontIcon'
        },
        { // 9
            source: 'ionicons ion-icon',
            result: 'fontIcon'
        },
        { // 10
            source: 'icon_-190',
            result: 'dxIcon'
        },
        { // 11
            source: 'my my-icon',
            result: 'fontIcon'
        },
        { // 12
            source: '<svg></svg>',
            result: 'svg'
        },
        { // 13
            source: `<svg>
                <path />
            </svg>`,
            result: 'svg'
        },
        { // 14
            source: `<svg>
                <path />
            </svg>
            <html>`,
            result: false
        },
        { // 15
            source: `test
            <svg>
            <path />
            </svg>`,
            result: false
        },
        { // 16
            source: `  <svg>
            <path />
            </svg>`,
            result: 'svg'
        },
        { // 17
            source: 'http://test.test/image.jpg',
            result: 'image'
        },
        { // 18
            source: 'image.png',
            result: 'image'
        },
        { // 19
            source: ' custom-icon',
            result: 'fontIcon'
        },
        { // 20 (T977384)
            source: '<svg>\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n',
            result: false
        }];
    }
}, () => {
    test('getImageSourceType', function(assert) {
        assert.expect(20);

        this.sourceArray.forEach(({ source, result }) => {
            assert.strictEqual(getImageSourceType(source), result);
        });
    });

    test('getImageContainer', function(assert) {
        this.sourceArray.forEach(({ source, result }) => {
            const $iconElement = getImageContainer(source);
            switch(result) {
                case 'dxIcon':
                    assert.ok($iconElement.hasClass(ICON_CLASS), `correct for ${result}`);
                    assert.notOk($iconElement.hasClass(SVG_ICON_CLASS), `correct for ${result}`);
                    assert.ok($iconElement.hasClass(`${ICON_CLASS}-${source}`), `correct for ${result}`);
                    assert.strictEqual($iconElement.get(0).tagName, 'I', `correct for ${result}`);
                    break;
                case 'fontIcon':
                    assert.ok($iconElement.hasClass(ICON_CLASS), `correct for ${result}`);
                    assert.notOk($iconElement.hasClass(SVG_ICON_CLASS), `correct for ${result}`);
                    assert.ok($iconElement.hasClass(source.trim()), `correct for ${result}`);
                    assert.strictEqual($iconElement.get(0).tagName, 'I', `correct for ${result}`);
                    break;
                case 'image':
                    assert.ok($iconElement.hasClass(ICON_CLASS), `correct for ${result}`);
                    assert.notOk($iconElement.hasClass(SVG_ICON_CLASS), `correct for ${result}`);
                    assert.strictEqual($iconElement.attr('src'), source, `correct for ${result}`);
                    assert.strictEqual($iconElement.get(0).tagName, 'IMG', `correct for ${result}`);
                    break;
                case 'svg':
                    assert.ok($iconElement.hasClass(ICON_CLASS), `correct for ${result}`);
                    assert.ok($iconElement.hasClass(SVG_ICON_CLASS), `correct for ${result}`);
                    assert.strictEqual($iconElement.get(0).tagName, 'I', `correct for ${result}`);
                    assert.strictEqual($iconElement.children().get(0).tagName.toUpperCase(), 'SVG', `correct for ${result}`);
                    break;
                case false:
                    assert.strictEqual($iconElement, null, 'element isn\'t created');
                    break;
                default:
                    break;
            }
        });
    });
});

testModule('getImageAriaLabel', () => {
    [
        { source: 'close', expected: 'Close', description: 'a dxIcon with a localized message' },
        { source: 'iconName', expected: 'iconName', description: 'a dxIcon without a localized message' },
        { source: 'fa fa-home', expected: 'fa fa-home', description: 'a font icon' },
        { source: '/path/file.png', expected: 'file', description: 'a path to an image' },
        { source: 'https://example.com/path/file.png', expected: undefined, description: 'an image URL' },
        { source: 'www.example.com/file.png', expected: undefined, description: 'an image URL without a protocol' },
        { source: 'data:image/png;base64,qwerty', expected: undefined, description: 'a base64 image' },
        { source: '<svg><title>Svg title</title><path d="M0 0h1v1H0z"/></svg>', expected: 'Svg title', description: 'an svg with a title' },
        { source: '<svg><title></title><path d="M0 0h1v1H0z"/></svg>', expected: undefined, description: 'an svg with an empty title' },
        { source: '<svg><path d="M0 0h1v1H0z"/></svg>', expected: undefined, description: 'an svg without a title' },
        { source: '', expected: undefined, description: 'an empty string' },
    ].forEach(({ source, expected, description }) => {
        test(`should return ${JSON.stringify(expected) || 'undefined'} for ${description}`, function(assert) {
            assert.strictEqual(getImageAriaLabel(source), expected);
        });
    });

    test('should localize the dxIcon name with the current locale', function(assert) {
        const defaultLocale = localization.locale();

        try {
            localization.loadMessages(ja);
            localization.locale('ja');

            assert.strictEqual(getImageAriaLabel('close'), '閉じる');
        } finally {
            localization.locale(defaultLocale);
        }
    });
});
