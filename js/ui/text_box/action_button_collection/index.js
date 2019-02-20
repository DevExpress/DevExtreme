import $ from "../../../core/renderer";

const TEXTEDITOR_BUTTONS_CONTAINER_CLASS = "dx-texteditor-buttons-container";

export default class ActionButtonCollection {
    constructor(editor, defaultButtonsInfo) {
        this.buttons = [];
        this.defaultButtonsInfo = defaultButtonsInfo;
        this.editor = editor;
    }

    _createButton(buttonName) {
        const defaultButtonInfo = this.defaultButtonsInfo.find(({ name }) => name === buttonName);

        if(!defaultButtonInfo) {
            throw "Can't create custom action button";
        }

        const { Ctor } = defaultButtonInfo;
        const button = new Ctor(this.editor, {});

        this.buttons.push(button);

        return button;
    }

    _renderButtons(buttons, $container, location) {
        let $buttonsContainer = $buttonsContainer = $("<div>")
            .addClass(TEXTEDITOR_BUTTONS_CONTAINER_CLASS)
            .appendTo($container);

        if(!buttons) {
            buttons = this.defaultButtonsInfo.map(({ name }) => name);
        }

        buttons.forEach(buttonName => {
            let button = this.buttons.find(({ name }) => name === buttonName);

            button = button || this._createButton(buttonName);

            if(button.location === location) {
                button.render($buttonsContainer);
            }
        });

        if(!$buttonsContainer.length) {
            $buttonsContainer.remove();

            return null;
        }

        return $buttonsContainer;
    }

    clean() {
        this.buttons.forEach(button => button.dispose());
        this.buttons = [];
    }

    getButton(buttonName) {
        const button = this.buttons.find(({ name }) => name === buttonName);

        if(!button) {
            throw "Cannot find button with this name";
        }

        return button.instance;
    }

    renderAfterButtons(buttons, $container) {
        return this._renderButtons(buttons, $container, "after");
    }

    renderBeforeButtons(buttons, $container) {
        return this._renderButtons(buttons, $container, "before");
    }

    updateButtons(names) {
        this.buttons.forEach(button => {
            if(!names || names.indexOf(button.name) !== -1) {
                button.update();
            }
        });
    }
}
