import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import Class from '../../core/class';
import { addNamespace, normalizeKeyName } from '../../events/utils/index';

const COMPOSITION_START_EVENT = 'compositionstart';
const COMPOSITION_END_EVENT = 'compositionend';
const KEYDOWN_EVENT = 'keydown';
const NAMESPACE = 'KeyboardProcessor';

const createKeyDownOptions = (e) => {
    return {
        keyName: normalizeKeyName(e),
        key: e.key,
        code: e.code,
        ctrl: e.ctrlKey,
        location: e.location,
        metaKey: e.metaKey,
        shift: e.shiftKey,
        alt: e.altKey,
        which: e.which,
        originalEvent: e
    };
};

const KeyboardProcessor = Class.inherit({
    _keydown: addNamespace(KEYDOWN_EVENT, NAMESPACE),
    _compositionStart: addNamespace(COMPOSITION_START_EVENT, NAMESPACE),
    _compositionEnd: addNamespace(COMPOSITION_END_EVENT, NAMESPACE),

    ctor: function(options) {
        options = options || {};
        if(options.element) {
            this._element = $(options.element);
        }
        if(options.focusTarget) {
            this._focusTarget = options.focusTarget;
        }
        this._handler = options.handler;

        if(this._element) {
            this._processFunction = (e) => {
                const focusTargets = $(this._focusTarget).toArray();
                const isNotFocusTarget = this._focusTarget && this._focusTarget !== e.target && !focusTargets.includes(e.target);
                const shouldSkipProcessing = this._isComposingJustFinished && e.which === 229 || this._isComposing || isNotFocusTarget;

                this._isComposingJustFinished = false;
                if(!shouldSkipProcessing) {
                    this.process(e);
                }
            };
            this._toggleProcessingWithContext = this.toggleProcessing.bind(this);

            eventsEngine.on(this._element, this._keydown, this._processFunction);
            eventsEngine.on(this._element, this._compositionStart, this._toggleProcessingWithContext);
            eventsEngine.on(this._element, this._compositionEnd, this._toggleProcessingWithContext);
        }
    },

    dispose: function() {
        if(this._element) {
            eventsEngine.off(this._element, this._keydown, this._processFunction);
            eventsEngine.off(this._element, this._compositionStart, this._toggleProcessingWithContext);
            eventsEngine.off(this._element, this._compositionEnd, this._toggleProcessingWithContext);
        }
        this._element = undefined;
        this._handler = undefined;
    },

    process: function(e) {
        this._handler(createKeyDownOptions(e));
    },

    toggleProcessing: function({ type }) {
        this._isComposing = type === COMPOSITION_START_EVENT;
        this._isComposingJustFinished = !this._isComposing;
    }
});

KeyboardProcessor.createKeyDownOptions = createKeyDownOptions;

export default KeyboardProcessor;
