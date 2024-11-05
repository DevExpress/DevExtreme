import $ from 'jquery';

import AlertList from '__internal/ui/chat/alertlist';

const CHAT_ALERTLIST_CLASS = 'dx-chat-alertlist';
const CHAT_ALERTLIST_ERROR_CLASS = 'dx-chat-alertlist-error';
const CHAT_ALERTLIST_ERROR_ICON_CLASS = 'dx-chat-alertlist-error-icon';
const CHAT_ALERTLIST_ERROR_TEXT_CLASS = 'dx-chat-alertlist-error-text';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new AlertList($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.getAlerts = () => this.$element.children(`.${CHAT_ALERTLIST_ERROR_CLASS}`);

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('AlertList', moduleConfig, () => {
    QUnit.module('Root element', () => {
        QUnit.test('should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_ALERTLIST_CLASS), true);
        });

        QUnit.test('should not have any elements inside by default', function(assert) {
            assert.strictEqual(this.$element.children().length, 0);
        });

        QUnit.test('should have error element inside', function(assert) {
            this.reinit({
                items: [{ message: 'error_1' }, { message: 'error_2' }],
            });

            const $alerts = this.getAlerts();

            assert.strictEqual($alerts.length, 2, 'error element count is correct');
        });
    });

    QUnit.module('Error element', () => {
        QUnit.test('should contain both icon and text elements inside', function(assert) {
            this.reinit({
                items: [{ message: 'error_1' }],
            });

            const $alerts = this.getAlerts();

            assert.strictEqual($alerts.children(0).hasClass(CHAT_ALERTLIST_ERROR_ICON_CLASS), true, 'icon container was rendered');
            assert.strictEqual($alerts.children(1).hasClass(CHAT_ALERTLIST_ERROR_TEXT_CLASS), true, 'text container was rendered');
        });

        QUnit.test('should be rendered with right text inside', function(assert) {
            this.reinit({
                items: [
                    { message: 'error_1' },
                    { message: 'error_2' }
                ],
            });

            const $alerts = this.getAlerts();

            assert.strictEqual($alerts.eq(0).find(`.${CHAT_ALERTLIST_ERROR_TEXT_CLASS}`).text(), 'error_1', 'first error text is correct');
            assert.strictEqual($alerts.eq(1).find(`.${CHAT_ALERTLIST_ERROR_TEXT_CLASS}`).text(), 'error_2', 'second error text is correct');
        });
    });

    QUnit.module('Accessibility', () => {
        [
            {
                attribute: 'role',
                expectedValue: 'log',
            },
            {
                attribute: 'aria-atomic',
                expectedValue: 'false',
            },
            {
                attribute: 'aria-label',
                expectedValue: 'Error list',
            },
            {
                attribute: 'aria-live',
                expectedValue: 'polite',
            },
            {
                attribute: 'aria-relevant',
                expectedValue: 'additions',
            },
        ].forEach(({ attribute, expectedValue }) => {
            QUnit.test(`element should have correct attribute ${attribute}`, function(assert) {
                assert.strictEqual(this.$element.attr(attribute), expectedValue, `${attribute} is correct`);
            });
        });
    });
});
