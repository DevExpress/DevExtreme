import $ from 'jquery';

import ChatAvatar from '__internal/ui/chat/chat_avatar';

const CHAT_MESSAGE_AVATAR_IMAGE_CLASS = 'dx-chat-message-avatar-image';
const HIDDEN_CLASS = 'dx-hidden';

const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="avatar"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}) => {
            this.instance = new ChatAvatar($('#avatar'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('ChatAvatar', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof ChatAvatar);
        });

        QUnit.test('should be rendered with empty value by default', function(assert) {
            assert.strictEqual(this.$element.text(), '');
        });
    });

    QUnit.module('Options', () => {
        QUnit.test('should be rendered with correct initials according passed name option value', function(assert) {
            this.reinit({ name: 'User name' });

            assert.strictEqual(this.$element.text(), 'U');
        });

        QUnit.test('name option should be updatable at runtime', function(assert) {
            this.instance.option('name', 'New Value');

            assert.strictEqual(this.$element.text(), 'N');
        });

        [
            { name: 888, expectedInitials: '8' },
            { name: undefined, expectedInitials: '' },
            { name: null, expectedInitials: '' },
            // TODO: consider scenarios
            // { name: ' New Name', expectedInitials: 'N' },
            // { name: NaN, expectedInitials: '' },
            // { name: Infinity, expectedInitials: '' },
            // { name: -Infinity, expectedInitials: '' },
            // { name: { firstName: 'name' }, expectedInitials: '' }
        ].forEach(({ name, expectedInitials }) => {
            QUnit.test(`name option is ${name}`, function(assert) {
                this.reinit({ name });

                assert.strictEqual(this.$element.text(), expectedInitials);
            });
        });

        QUnit.test('img element should have correct alt attribute', function(assert) {
            this.reinit({ name: 'User name' });

            const $img = this.$element.find(`.${CHAT_MESSAGE_AVATAR_IMAGE_CLASS}`);

            assert.strictEqual($img.attr('alt'), 'User name');
        });

        QUnit.test('img element should have correct alt attribute if name was changed in runtime', function(assert) {
            this.reinit({ name: 'User name' });
            this.instance.option({ name: 'New name' });

            const $img = this.$element.find(`.${CHAT_MESSAGE_AVATAR_IMAGE_CLASS}`);

            assert.strictEqual($img.attr('alt'), 'New name');
        });

        QUnit.test('img element should have correct alt attribute if name is empty', function(assert) {
            this.reinit({ name: '' });

            const $img = this.$element.find(`.${CHAT_MESSAGE_AVATAR_IMAGE_CLASS}`);

            assert.strictEqual($img.attr('alt'), 'avatar');
        });

        QUnit.test('img element should have correct src attribute', function(assert) {
            this.reinit({ url: 'url' });

            const $img = this.$element.find(`.${CHAT_MESSAGE_AVATAR_IMAGE_CLASS}`);

            assert.strictEqual($img.attr('src'), 'url');
        });

        QUnit.test('img element should have correct src attribute if url was changed in runtime', function(assert) {
            this.reinit({ url: 'url' });
            this.instance.option({ url: 'New url' });

            const $img = this.$element.find(`.${CHAT_MESSAGE_AVATAR_IMAGE_CLASS}`);

            assert.strictEqual($img.attr('src'), 'New url');
        });

        QUnit.test('img element should have dx-hidden class if url is empty', function(assert) {
            this.reinit({ url: '' });

            const $img = this.$element.find(`.${CHAT_MESSAGE_AVATAR_IMAGE_CLASS}`);

            assert.strictEqual($img.hasClass(HIDDEN_CLASS), true);
        });

        QUnit.test('img element should get dx-hidden class if url was empty in runtime', function(assert) {
            this.reinit({ url: 'url' });
            this.instance.option({ url: '' });

            const $img = this.$element.find(`.${CHAT_MESSAGE_AVATAR_IMAGE_CLASS}`);

            assert.strictEqual($img.hasClass(HIDDEN_CLASS), true);
        });
    });
});
