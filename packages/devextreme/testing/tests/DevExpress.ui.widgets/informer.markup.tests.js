import $ from 'jquery';

import Informer from 'ui/informer';

const INFORMER_CLASS = 'dx-informer';
const INFORMER_ERROR_CLASS = 'dx-informer-error';
const INFORMER_INFO_CLASS = 'dx-informer-info';
const INFORMER_ALIGNMENT_START_CLASS = 'dx-informer-alignment-start';
const INFORMER_ALIGNMENT_CENTER_CLASS = 'dx-informer-alignment-center';
const INFORMER_ALIGNMENT_END_CLASS = 'dx-informer-alignment-end';
const INFORMER_BG_CLASS = 'dx-informer-bg';
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
    QUnit.module('Basic markup', () => {
        QUnit.test(`should have ${INFORMER_CLASS} class`, function(assert) {
            assert.strictEqual(this.$element.hasClass(INFORMER_CLASS), true);
        });

        QUnit.test(`should have child with ${INFORMER_TEXT_CLASS} class`, function(assert) {
            assert.strictEqual(this.$element.find(`.${INFORMER_TEXT_CLASS}`).length, 1, true);
        });

        QUnit.test(`should have not child with ${INFORMER_ICON_CLASS} class if icon is not specified`, function(assert) {
            assert.strictEqual(this.$element.find(`.${INFORMER_ICON_CLASS}`).length, 0, true);
        });

        QUnit.test(`should have not child with ${INFORMER_ICON_CLASS} class if icon is specified`, function(assert) {
            this.reinit({ icon: 'sun' });

            assert.strictEqual(this.$element.find(`.${INFORMER_ICON_CLASS}`).length, 1, true);
        });

        [true, false].forEach((showBackground) => {
            QUnit.test(`should ${showBackground ? '' : 'not '}have ${INFORMER_BG_CLASS} class when showBackground=${showBackground}`, function(assert) {
                this.reinit({ showBackground });

                assert.strictEqual(this.$element.hasClass(INFORMER_BG_CLASS), showBackground);
            });
        });

        QUnit.test(`should have ${INFORMER_ALIGNMENT_CENTER_CLASS} class by default`, function(assert) {
            assert.strictEqual(this.$element.hasClass(INFORMER_ALIGNMENT_CENTER_CLASS), true);
        });

        [
            {
                contentAlignment: 'center',
                className: INFORMER_ALIGNMENT_CENTER_CLASS,
            },
            {
                contentAlignment: 'start',
                className: INFORMER_ALIGNMENT_START_CLASS,
            },
            {
                contentAlignment: 'end',
                className: INFORMER_ALIGNMENT_END_CLASS,
            },
        ].forEach(({ contentAlignment, className }) => {
            QUnit.test(`should have ${className} class when contentAlignment=${contentAlignment}`, function(assert) {
                this.reinit({ contentAlignment });

                assert.strictEqual(this.$element.hasClass(className), true);
            });
        });

        QUnit.test('should add actual alignment class and remove the old one on contentAlignment runtime change', function(assert) {
            this.reinit({ contentAlignment: 'start' });

            assert.strictEqual(this.$element.hasClass(INFORMER_ALIGNMENT_START_CLASS), true, 'alignment class is added on init');

            this.instance.option('contentAlignment', 'end');

            assert.strictEqual(this.$element.hasClass(INFORMER_ALIGNMENT_START_CLASS), false, 'previous alignment class is removed');
            assert.strictEqual(this.$element.hasClass(INFORMER_ALIGNMENT_END_CLASS), true, 'new alignment class is added');
        });

        QUnit.test(`should have ${INFORMER_ERROR_CLASS} class by default`, function(assert) {
            assert.strictEqual(this.$element.hasClass(INFORMER_ALIGNMENT_CENTER_CLASS), true);
        });

        [
            {
                type: 'error',
                className: INFORMER_ERROR_CLASS,
            },
            {
                type: 'info',
                className: INFORMER_INFO_CLASS,
            },
        ].forEach(({ type, className }) => {
            QUnit.test(`should have ${className} class when type=${type}`, function(assert) {
                this.reinit({ type });

                assert.strictEqual(this.$element.hasClass(className), true);
            });
        });

        QUnit.test('should add actual type class and remove the old one on type option runtime change', function(assert) {
            this.reinit({ type: 'info' });

            assert.strictEqual(this.$element.hasClass(INFORMER_INFO_CLASS), true, 'info type class is added on init');

            this.instance.option('type', 'error');

            assert.strictEqual(this.$element.hasClass(INFORMER_INFO_CLASS), false, 'previous type info class is removed');
            assert.strictEqual(this.$element.hasClass(INFORMER_ERROR_CLASS), true, 'new type error class is added');
        });
    });
});
