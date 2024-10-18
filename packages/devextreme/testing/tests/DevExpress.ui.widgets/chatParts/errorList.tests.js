import $ from 'jquery';

import ErrorList from '__internal/ui/chat/errorlist';

const CHAT_ERRORLIST_ERROR_CLASS = 'dx-chat-errorlist-error';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}, selector = '#component') => {
            this.instance = new ErrorList($(selector), options);
            this.$element = $(this.instance.$element());
        };

        this.getErrors = () => this.$element.children(`.${CHAT_ERRORLIST_ERROR_CLASS}`);

        this.reinit = (options, selector) => {
            this.instance.dispose();

            init(options, selector);
        };

        init();
    }
};

QUnit.module('ErrorList', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof ErrorList);
        });

        QUnit.test('should not be any errors if the items contain undefined values', function(assert) {
            const items = [{}, undefined, {}];

            try {
                this.reinit({
                    items,
                });
            } catch(e) {
                assert.ok(false, `error: ${e.message}`);
            } finally {
                assert.strictEqual(this.getErrors().length, 3);
            }
        });
    });

    QUnit.module('Behaviour', () => {
        QUnit.test('error should be rendered in error list after change items at runtime', function(assert) {
            this.instance.option({ items: [
                { id: '1', message: 'error_1' },
                { id: '2', message: 'error_2' }
            ] });

            const $errors = this.getErrors();

            assert.strictEqual($errors.length, 2);
            assert.strictEqual($errors.eq(0).text(), 'error_1', 'first error text is correct');
            assert.strictEqual($errors.eq(1).text(), 'error_2', 'second error text is correct');
        });

        QUnit.test('errors should be removed from error list after changing items to empty array at runtime', function(assert) {
            this.reinit({ items: [
                { id: '1', message: 'error_1' },
                { id: '2', message: 'error_2' }
            ] });

            assert.strictEqual(this.getErrors().length, 2, 'error count after initialization');

            this.instance.option({ items: [] });

            assert.strictEqual(this.getErrors().length, 0, 'error count after option change');
        });

        QUnit.test('errors should be removed from error list after changing items to null at runtime', function(assert) {
            this.reinit({ items: [
                { id: '1', message: 'error_1' },
                { id: '2', message: 'error_2' }
            ] });

            assert.strictEqual(this.getErrors().length, 2, 'error count after initialization');

            this.instance.option({ items: null });

            assert.strictEqual(this.getErrors().length, 0, 'error count after option change');
        });
    });
});
