import $ from "../../../core/renderer";

export default class ActionButton {
    constructor(name, editor, options) {
        this.instance = null;

        this.$container = null;
        this.$placeMarker = null;
        this.editor = editor;
        this.name = name;
        this.options = options;
    }

    _addPlaceMarker($container) {
        this.$placeMarker = $("<div>").appendTo($container);
    }

    _addToContainer($element) {
        const { $placeMarker, $container } = this;

        $placeMarker ? $placeMarker.replaceWith($element) : $element.appendTo($container);
    }

    _attachEvents(/* instance, $element */) {
        throw "Not implemented";
    }

    _create() {
        throw "Not implemented";
    }

    _isRendered() {
        return !!this.instance;
    }

    _isVisible() {
        throw "Not implemented";
    }

    _shouldRender() {
        return this._isVisible() && !this._isRendered();
    }

    dispose() {
        const { instance, $placeMarker } = this;

        if(instance) {
            // TODO: instance.dispose()
            instance.dispose ? instance.dispose() : instance.remove();
            this.instance = null;
        }

        $placeMarker && $placeMarker.remove();
    }

    render($container = this.$container) {
        this.$container = $container;

        if(this._isVisible()) {
            const { instance, $element } = this._create();

            this.instance = instance;
            this._attachEvents(instance, $element);
        } else {
            this._addPlaceMarker($container);
        }
    }

    update() {
        if(this._shouldRender()) {
            this.render();
        }

        return !!this.instance;
    }
}
