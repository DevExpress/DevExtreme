import $ from 'jquery';
import { TextEditorLabel } from 'ui/text_box/ui.text_editor.label';
import { getWidth } from 'core/utils/size';

const TEXTEDITOR_LABEL_CLASS = 'dx-texteditor-label';
const TEXTEDITOR_WITH_LABEL_CLASS = 'dx-texteditor-with-label';
const TEXTEDITOR_WITH_FLOATING_LABEL_CLASS = 'dx-texteditor-with-floating-label';
const TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS = 'dx-texteditor-with-before-buttons';

const LABEL_BEFORE_SELECTOR = '.dx-label-before';
const LABEL_SELECTOR = '.dx-label';
const LABEL_AFTER_SELECTOR = '.dx-label-after';

QUnit.testStart(function() {
    const markup = '<div id="textEditor"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('textEditorLabel', {
    beforeEach: function() {
        this.spy = sinon.spy();
        this.$editor = $('#textEditor');
        this.labelInitialConfig = {
            $editor: this.$editor,
            text: 'Label',
            mark: '*',
            mode: 'static',
            getBeforeWidth: () => 7,
            getContainerWidth: () => 180,
            containsButtonsBefore: false
        };
        this.init = (options) => {
            this.label = new TextEditorLabel($.extend({}, this.labelInitialConfig, options));
            this.$label = this.label.$element();
            this.getBeforeElement = () => this.$label.find(LABEL_BEFORE_SELECTOR);
            this.getLabelElement = () => this.$label.find(LABEL_SELECTOR);
            this.getSpan = () => this.getLabelElement().find('span');
        };
        this.reinit = (options) => {
            this.label = null;
            this.$label.remove();

            this.init(options);
        };

        this.init({});
    }
}, () => {
    QUnit.module('render', () => {
        QUnit.test('base markup', function(assert) {
            assert.ok(this.getBeforeElement().length, 'label has before element');
            assert.ok(this.getLabelElement().length, 'label has internal element');
            assert.ok(this.$label.find(LABEL_AFTER_SELECTOR).length, 'label has after element');

            assert.ok(this.getSpan().length, 'internal label has span');
        });

        QUnit.test('root element should have dx-texteditor-label class', function(assert) {
            assert.ok(this.$label.hasClass(TEXTEDITOR_LABEL_CLASS));
        });

        QUnit.test('span should have text equal to text prop', function(assert) {
            assert.strictEqual(this.getSpan().text(), this.labelInitialConfig.text, 'text is correct');
        });

        QUnit.test('span should have data-mark requal to mark prop', function(assert) {
            assert.strictEqual(this.getSpan().attr('data-mark'), this.labelInitialConfig.mark, 'mark is correct');
        });

        QUnit.test('label before element should have width equal to beforeWidth prop', function(assert) {
            const beforeWidth = getWidth(this.getBeforeElement());

            assert.strictEqual(beforeWidth, this.labelInitialConfig.getBeforeWidth(), 'before element width is correct');
        });

        QUnit.test('label internal element should have max-width equal to containerWidth prop', function(assert) {
            const labelWidth = Number.parseInt(this.getLabelElement().css('maxWidth'), 10);

            assert.strictEqual(labelWidth, this.labelInitialConfig.getContainerWidth(), 'label internal element width is correct');
        });

        QUnit.module('markup visibility', function(assert) {
            QUnit.test('markup should be detached if mode="hidden"', function(assert) {
                this.reinit({ mode: 'hidden' });

                assert.notOk(this.$editor.find(LABEL_SELECTOR).length, 'markup is detached');
            });

            QUnit.test('markup should be detached if text is empty', function(assert) {
                this.reinit({ text: '' });

                assert.notOk(this.$editor.find(LABEL_SELECTOR).length, 'markup is detached');
            });
        });
    });

    QUnit.module('Outside labelMode', () => {
        ['init', 'runtime'].forEach((scenario) => {
            [
                {
                    eventName: 'dxclick',
                    handlerName: 'onClickHandler',
                },
                {
                    eventName: 'dxhoverstart',
                    handlerName: 'onHoverHandler',
                },
                {
                    eventName: 'dxactive',
                    handlerName: 'onActiveHandler',
                }
            ].forEach(({ eventName, handlerName }) => {
                QUnit.test(`${handlerName} should be called on label ${eventName} when mode is set to "outside" on ${scenario}`, function(assert) {
                    const setOnInit = scenario === 'init';
                    this.reinit({
                        [handlerName]: this.spy,
                        mode: setOnInit ? 'outside' : 'static',
                    });

                    if(!setOnInit) {
                        this.label.updateMode('outside');
                    }
                    $(this.getSpan()).trigger(eventName);

                    assert.strictEqual(this.spy.callCount, 1, `${handlerName} was called`);
                });
            });

            QUnit.test(`onClickHandler should not be called on label with empty text click when mode is set to "outside" on ${scenario}`, function(assert) {
                const setOnInit = scenario === 'init';
                this.reinit({
                    onClickHandler: this.spy,
                    mode: setOnInit ? 'outside' : 'static',
                    text: '',
                });

                if(!setOnInit) {
                    this.label.updateMode('outside');
                }
                $(this.getSpan()).trigger('dxclick');

                assert.strictEqual(this.spy.callCount, 0, 'onClick handler was not called on label click');
            });

            QUnit.test(`label should have tranform styles when "outside" mode is set on ${scenario}`, function(assert) {
                const setOnInit = scenario === 'init';
                this.reinit({
                    mode: setOnInit ? 'outside' : 'static',
                });

                if(!setOnInit) {
                    this.label.updateMode('outside');
                }
                const transformStyles = $(this.getSpan()).css('transform');

                assert.ok(transformStyles, 'transform inline styles are set');
            });
        });

        QUnit.test('label should not have tranform styles when "outside" mode is disabled on runtime', function(assert) {
            this.reinit({
                mode: 'outside',
            });

            this.label.updateMode('static');
            const transformStyles = $(this.getSpan()).css('transform');

            assert.strictEqual(transformStyles, 'none', 'transform inline style are not set');
        });

        [false, true].forEach((rtlEnabled) => {
            QUnit.test(`label transform translateX should be ${rtlEnabled ? 'positive' : 'negative'} (rtlEnabled=${rtlEnabled})`, function(assert) {
                this.reinit({
                    mode: 'outside',
                    rtlEnabled,
                });

                const transformStyles = $(this.getSpan()).css('transform');
                const translateX = transformStyles.split(',')[4].trim();

                assert.ok(rtlEnabled ? translateX > 0 : translateX < 0);
            });
        });
    });

    QUnit.module('public methods', () => {
        QUnit.module('updateText', () => {
            QUnit.test('updates text', function(assert) {
                const newText = 'LabelNew';
                this.label.updateText(newText);

                assert.strictEqual(this.getSpan().text(), newText, 'text is updated');
            });

            QUnit.test('toggles markup visibility', function(assert) {
                this.label.updateText();

                assert.notOk(this.$editor.find(LABEL_SELECTOR).length, 'markup is detached');
            });

            QUnit.test('text="" removes label classes from editor element', function(assert) {
                this.label.updateText('');

                assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_LABEL_CLASS), 'editor has no default label class');
                assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS), 'editor has no floating label class');
            });

            QUnit.test('not empty text adds label classes to editor element if mode is not "hidden"', function(assert) {
                this.reinit({ text: '' });
                this.label.updateText('some');

                assert.ok(this.$editor.hasClass(TEXTEDITOR_WITH_LABEL_CLASS), 'editor has label class');
            });
        });

        QUnit.module('updateContainsButtonsBefore', () => {
            QUnit.test('change to false removes dx-texteditor-with-before-buttons class from editor element', function(assert) {
                this.reinit({ containsButtonsBefore: true });
                this.label.updateContainsButtonsBefore(false);

                assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS));
            });

            QUnit.test('change to true adds dx-texteditor-with-before-buttons class to editor element', function(assert) {
                this.label.updateContainsButtonsBefore(true);

                assert.ok(this.$editor.hasClass(TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS));
            });
        });

        QUnit.test('updateMark', function(assert) {
            const newMark = ':';
            this.label.updateMark(newMark);

            assert.strictEqual(this.getSpan().attr('data-mark'), newMark, 'span mark is updated');
        });

        QUnit.test('updateBeforeWidth', function(assert) {
            const newBeforeWidth = 200;
            this.label.updateBeforeWidth(newBeforeWidth);

            const labelBeforeWidth = getWidth(this.getBeforeElement());
            assert.strictEqual(labelBeforeWidth, newBeforeWidth, 'before element width is updated');
        });

        QUnit.test('updateMaxWidth', function(assert) {
            const newContainerWidth = 300;
            this.label.updateMaxWidth(newContainerWidth);

            const labelWidth = Number.parseInt(this.getLabelElement().css('maxWidth'), 10);
            assert.strictEqual(labelWidth, newContainerWidth, 'label max width is updated');
        });

        QUnit.module('updateMode', () => {
            QUnit.module('markup visibility toggling', () => {
                QUnit.test('mode="hidden" removes label classes from editor element', function(assert) {
                    this.label.updateMode('hidden');

                    assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_LABEL_CLASS), 'editor has no default label class');
                    assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS), 'editor has no floating label class');
                });

                QUnit.test('mode not "hidden" adds label classes to editor element if text is not empty', function(assert) {
                    this.reinit({ mode: 'hidden' });
                    this.label.updateMode('static');

                    assert.ok(this.$editor.hasClass(TEXTEDITOR_WITH_LABEL_CLASS), 'editor has label class');
                });
            });

            QUnit.module('editor classes toggling', () => {
                QUnit.test('editor has correct class if mode is changed to "static"', function(assert) {
                    this.reinit({ mode: 'floating' });

                    this.label.updateMode('static');

                    assert.ok(this.$editor.hasClass(TEXTEDITOR_WITH_LABEL_CLASS), 'has default label class');
                    assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS), 'has no floating label class');
                });

                QUnit.test('editor has correct class if mode is changed to "floating"', function(assert) {
                    this.label.updateMode('floating');

                    assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_LABEL_CLASS), 'has no default label class');
                    assert.ok(this.$editor.hasClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS), 'has floating label class');
                });

                QUnit.test('editor has not label class if after mode changed to "hidden"', function(assert) {
                    this.label.updateMode('hidden');

                    assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_LABEL_CLASS), 'has no default label class');
                    assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS), 'has no floating label class');
                });
            });
        });

        QUnit.module('isVisible', () => {
            QUnit.test('returns true if text is not empty and mode is not "hidden"', function(assert) {
                assert.strictEqual(this.label.isVisible(), true);
            });

            QUnit.test('return false if mode="hidden"', function(assert) {
                this.reinit({ mode: 'hidden' });

                assert.strictEqual(this.label.isVisible(), false);
            });

            QUnit.test('return false if text is empty', function(assert) {
                this.reinit({ text: '' });

                assert.strictEqual(this.label.isVisible(), false);
            });
        });
    });

    QUnit.module('adding classes to editor on init', () => {
        QUnit.test('editor has correct class if mode="static"', function(assert) {
            assert.ok(this.$editor.hasClass(TEXTEDITOR_WITH_LABEL_CLASS), 'has default label class');
            assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS), 'has no floating label class');
        });

        QUnit.test('editor has correct class if mode="floating"', function(assert) {
            this.reinit({ mode: 'floating' });

            assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_LABEL_CLASS), 'has no default label class');
            assert.ok(this.$editor.hasClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS), 'has floating label class');
        });

        QUnit.test('editor has not label class if label is hidden', function(assert) {
            this.reinit({ mode: 'hidden' });

            assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_LABEL_CLASS), 'has no default label class');
            assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS), 'has no floating label class');
        });

        QUnit.test('editor has no dx-texteditor-with-before-buttons class if containsButtonsBefore=false', function(assert) {
            assert.notOk(this.$editor.hasClass(TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS));
        });

        QUnit.test('editor has dx-texteditor-with-before-buttons class if containsButtonsBefore=true', function(assert) {
            this.reinit({ containsButtonsBefore: true });

            assert.ok(this.$editor.hasClass(TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS));
        });
    });
});
