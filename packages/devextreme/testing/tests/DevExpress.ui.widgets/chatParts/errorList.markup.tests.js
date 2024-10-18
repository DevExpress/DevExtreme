import $ from 'jquery';

import ErrorList from '__internal/ui/chat/errorlist';

const CHAT_ERRORLIST_CLASS = 'dx-chat-errorlist';
const CHAT_ERRORLIST_ERROR_CLASS = 'dx-chat-errorlist-error';
const CHAT_ERRORLIST_ERROR_ICON_CLASS = 'dx-chat-errorlist-error-icon';
const CHAT_ERRORLIST_ERROR_TEXT_CLASS = 'dx-chat-errorlist-error-text';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new ErrorList($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.getErrors = () => this.$element.children(`.${CHAT_ERRORLIST_ERROR_CLASS}`);

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('ErrorList', moduleConfig, () => {
    QUnit.module('Root element', () => {
        QUnit.test('should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_ERRORLIST_CLASS), true);
        });

        QUnit.test('should not have any elements inside by default', function(assert) {
            assert.strictEqual(this.$element.children().length, 0);
        });

        QUnit.test('should have error element inside', function(assert) {
            this.reinit({
                items: [{ message: 'error_1' }, { message: 'error_2' }],
            });

            const $errors = this.getErrors();

            assert.strictEqual($errors.length, 2, 'error element count is correct');
        });
    });

    QUnit.module('Error element', () => {
        QUnit.test('should contain both icon and text elements inside', function(assert) {
            this.reinit({
                items: [{ message: 'error_1' }],
            });

            const $errors = this.getErrors();

            assert.strictEqual($errors.children(0).hasClass(CHAT_ERRORLIST_ERROR_ICON_CLASS), true, 'icon container was rendered');
            assert.strictEqual($errors.children(1).hasClass(CHAT_ERRORLIST_ERROR_TEXT_CLASS), true, 'text container was rendered');
        });

        QUnit.test('should be rendered with right text inside', function(assert) {
            this.reinit({
                items: [
                    { message: 'error_1' },
                    { message: 'error_2' }
                ],
            });

            const $errors = this.getErrors();

            assert.strictEqual($errors.eq(0).find(`.${CHAT_ERRORLIST_ERROR_TEXT_CLASS}`).text(), 'error_1', 'first error text is correct');
            assert.strictEqual($errors.eq(1).find(`.${CHAT_ERRORLIST_ERROR_TEXT_CLASS}`).text(), 'error_2', 'second error text is correct');
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
