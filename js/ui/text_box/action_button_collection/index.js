import $ from "../../../core/renderer";
import CustomButton from "./custom";
import { extend } from "../../../core/utils/extend";
import { find } from "../../../core/utils/array";

const TEXTEDITOR_BUTTONS_CONTAINER_CLASS = "dx-texteditor-buttons-container";

function checkButtonInfo(buttonInfo) {
    const checkButtonType = () => {
        if(!buttonInfo || typeof buttonInfo !== "object" || Array.isArray(buttonInfo)) {
            throw new TypeError("'buttons' option must include an object or a string items only");
        }
    };

    const checkLocation = () => {
        const { location } = buttonInfo;

        if("location" in buttonInfo && location !== "after" && location !== "before") {
            throw new TypeError("action button's 'location' property can be 'after' or 'before' only");
        }
    };

    const checkNameIsDefined = () => {
        if(!("name" in buttonInfo)) {
            throw new Error("action button must have a name");
        }
    };

    const checkNameIsString = () => {
        const { name } = buttonInfo;

        if(typeof name !== "string") {
            throw new TypeError("action button's 'name' field must be a string");
        }
    };

    checkButtonType();
    checkNameIsDefined();
    checkNameIsString();
    checkLocation();
}

function checkNamesUniqueness(existingNames, newName) {
    if(existingNames.indexOf(newName) !== -1) {
        throw new Error("'buttons' option item must have unique name");
    }

    existingNames.push(newName);
}

function checkPredefinedButtonName(name, predefinedButtonsInfo) {
    if(find(predefinedButtonsInfo, (info) => info.name === name)) {
        throw new Error(`'${name}' name reserved for the predefined action button`);
    }
}

export default class ActionButtonCollection {
    constructor(editor, defaultButtonsInfo) {
        this.buttons = [];
        this.defaultButtonsInfo = defaultButtonsInfo;
        this.editor = editor;
    }

    _compileButtonInfo(buttons) {
        const names = [];

        return buttons.map((button) => {
            const isDefaultButton = typeof button === "string";

            if(isDefaultButton) {
                const defaultButtonInfo = find(this.defaultButtonsInfo, ({ name }) => name === button);

                if(!defaultButtonInfo) {
                    throw new Error(`editor does not have '${button}' action button`);
                }

                checkNamesUniqueness(names, button);

                return defaultButtonInfo;
            } else {
                checkButtonInfo(button);

                const { name } = button;

                checkNamesUniqueness(names, name);
                checkPredefinedButtonName(name, this.defaultButtonsInfo);

                return extend(button, { Ctor: CustomButton });
            }
        });
    }

    _createButton(buttonsInfo) {
        const { Ctor, options, name } = buttonsInfo;
        const button = new Ctor(name, this.editor, options);

        this.buttons.push(button);

        return button;
    }

    _getLocation(buttonInfo) {
        return buttonInfo.Ctor.location;
    }

    _renderButtons(buttons, $container, targetLocation) {
        let $buttonsContainer = null;
        const buttonsInfo = buttons ? this._compileButtonInfo(buttons) : this.defaultButtonsInfo;
        const getButtonsContainer = () => {
            $buttonsContainer = $buttonsContainer || $("<div>")
                .addClass(TEXTEDITOR_BUTTONS_CONTAINER_CLASS)
                .appendTo($container);

            return $buttonsContainer;
        };

        buttonsInfo.forEach((buttonsInfo) => {
            const { location = "after" } = buttonsInfo;

            if(location === targetLocation) {
                this._createButton(buttonsInfo)
                    .render(getButtonsContainer());
            }
        });

        return $buttonsContainer;
    }

    clean() {
        this.buttons.forEach(button => button.dispose());
        this.buttons = [];
    }

    getButton(buttonName) {
        const button = find(this.buttons, ({ name }) => name === buttonName);

        return button ? button.instance : null;
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
