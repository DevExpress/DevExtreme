import $ from 'jquery';
import Gallery from 'ui/gallery';
import windowUtils from 'core/utils/window';

import 'common.css!';

QUnit.testStart(() => {
    const markup =
        '<style>\
            .dx-gallery, .dx-gallery-item {\
                width: 400px;\
                height: 400px;\
            }\
        </style>\
        \
        <div id="gallerySimple"></div>\
        \
        <div id="galleryWithTmpl">\
            <div data-options="dxTemplate : { name: \'item\' } " >\
                <div>0</div>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const GALLERY_CLASS = 'dx-gallery';
const GALLERY_WRAPPER_CLASS = GALLERY_CLASS + '-wrapper';
const GALLERY_ITEM_CONTAINER_CLASS = GALLERY_CLASS + '-container';
const GALLERY_ITEM_CLASS = GALLERY_CLASS + '-item';

const prepareItemTest = (data) => {
    const gallery = new Gallery($('<div>'), {
        items: [data]
    });

    return gallery.itemElements().eq(0).find('.dx-item-content').contents();
};

QUnit.module('base', () => {
    QUnit.test('default classes', (assert) => {
        const $gallery = $('#gallerySimple').dxGallery({
            items: [0, 1, 2, 3]
        });
        const $galleryItems = $gallery.find('.' + GALLERY_ITEM_CLASS);

        assert.ok($gallery.hasClass(GALLERY_CLASS), 'element has a widget-specific class');
        assert.equal($gallery.find('.' + GALLERY_WRAPPER_CLASS).length, 1, 'gallery wrapper attached');
        assert.equal($gallery.find('.' + GALLERY_ITEM_CONTAINER_CLASS).length, 1, 'gallery items container attached');
        assert.ok($galleryItems.eq(0).find('img').hasClass('dx-gallery-item-image'), 'right class was passed');
    });

    QUnit.test('item template', (assert) => {
        const $gallery = $('#galleryWithTmpl').dxGallery({ items: [ 1, 2, 3 ] });
        const items = $gallery.find('.' + GALLERY_ITEM_CLASS);

        if(windowUtils.hasWindow()) {
            assert.equal(items.length, 3, '3 items were rendered');
            assert.equal($gallery.text().replace(/\s+/g, ''), '000');
        } else {
            assert.equal(items.length, 1, '1 item were rendered');
            assert.equal($gallery.text().replace(/\s+/g, ''), '0');
        }
    });
});


QUnit.module('aria accessibility', () => {
    QUnit.test('aria role', (assert) => {
        const $element = $('#gallerySimple').dxGallery();

        assert.equal($element.attr('role'), 'listbox', 'aria role is correct');
    });

    QUnit.test('aria label', (assert) => {
        const $element = $('#gallerySimple').dxGallery();

        assert.equal($element.attr('aria-label'), 'gallery', 'widget should have aria-label to have difference from text list');
    });

    QUnit.test('aria role for items', (assert) => {
        const $element = $('#gallerySimple').dxGallery({ items: [1] });
        const $item = $element.find('.' + GALLERY_ITEM_CLASS);

        assert.equal($item.attr('role'), 'option', 'item\'s role is correct');
    });
});


QUnit.module('default template', () => {
    QUnit.test('template should be rendered correctly with image as string', (assert) => {
        const $content = prepareItemTest('test');
        const $img = $content.filter('img');

        assert.equal($img.length, 1);
        assert.equal($img.attr('src'), 'test');
    });

    QUnit.test('template should be rendered correctly with imageSrc', (assert) => {
        const $content = prepareItemTest({ imageSrc: 'test.jpg' });
        const $img = $content.filter('img');

        assert.equal($img.length, 1);
        assert.equal($img.attr('src'), 'test.jpg');
    });

    QUnit.test('template should be rendered correctly with imageSrc & imageAlt', (assert) => {
        const $content = prepareItemTest({ imageSrc: 'test.jpg', imageAlt: 'test' });
        const $img = $content.filter('img');

        assert.equal($img.length, 1);
        assert.equal($img.attr('alt'), 'test');
    });

    QUnit.test('template should be rendered correctly with html', (assert) => {
        const $content = prepareItemTest({ html: '<span>test</span>' });

        const $span = $content.is('span') ? $content : $content.children();
        assert.ok($span.length);
        assert.equal($span.text(), 'test');
    });

    QUnit.test('template should be rendered correctly with text', (assert) => {
        const $content = prepareItemTest({ text: 'custom' });

        assert.equal($.trim($content.text()), 'custom');
    });
});
