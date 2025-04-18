import $ from 'jquery';

import Informer from 'ui/informer';

const INFORMER_TEXT_CLASS = 'dx-informer-text';
const INFORMER_ICON_CLASS = 'dx-informer-icon';

QUnit.testStart(() => {
    const markup = '<div id="informer"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new Informer($('#informer'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('Informer', moduleConfig, () => {
    QUnit.module('Basic', () => {
        QUnit.test('Should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof Informer);
        });

        QUnit.test('Should have a text specified on init', function(assert) {
            this.reinit({ text: 'error message' });

            const $text = this.$element.find(`.${INFORMER_TEXT_CLASS}`);

            assert.strictEqual($text.text(), 'error message', true);
        });

        QUnit.test('Should have updated text on runtime text option change', function(assert) {
            this.reinit({ text: 'error message' });

            this.instance.option('text', 'new error');

            const $text = this.$element.find(`.${INFORMER_TEXT_CLASS}`);

            assert.strictEqual($text.text(), 'new error', true);
        });

        QUnit.test('Should have icon with img tag if icon specified with url', function(assert) {
            const url = 'https://images.com/img.jpg';

            this.reinit({ icon: url });

            const $icon = this.$element.find(`.${INFORMER_ICON_CLASS}`);
            const $content = $icon.children();

            assert.strictEqual($content.prop('tagName'), 'IMG', 'img tag is rendered');
            assert.strictEqual($content.attr('src'), url, 'img src is correct');
        });

        QUnit.test('Should have icon with i tag with dx-icon-{className} if icon specified with an inner lib icon string', function(assert) {
            this.reinit({ icon: 'sun' });

            const $icon = this.$element.find(`.${INFORMER_ICON_CLASS}`);
            const $content = $icon.children();
            debugger;
            assert.strictEqual($content.prop('tagName'), 'I', 'i tag is rendered');
            assert.strictEqual($content.hasClass('dx-icon-sun'), true, 'dx-sun class is added');
        });

        QUnit.test('Icon element should be removed after icon runtime disable', function(assert) {
            this.reinit({ icon: 'sun' });

            this.instance.option('icon', undefined);

            const $icon = this.$element.find(`.${INFORMER_ICON_CLASS}`);

            assert.strictEqual($icon.length, 0);
        });
    });
});
