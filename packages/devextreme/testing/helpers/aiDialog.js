import $ from 'jquery';

const AI_DIALOG_CLASS = 'dx-aidialog';
const AI_DIALOG_CONTROLS_CLASS = 'dx-aidialog-controls';
const AI_DIALOG_CONTENT_CLASS = 'dx-aidialog-content';
const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const BUTTON_CLASS = 'dx-button';
const LIST_ITEM_CLASS = 'dx-list-item';
const OVERLAY_CLASS = 'dx-overlay-content';
const SELECT_BOX_CLASS = 'dx-selectbox';
const TEXT_AREA_CLASS = 'dx-textarea';

const CLICK_EVENT_NAME = 'dxclick';

const createCommandsMap = (isBasicCommand) => {
    if(isBasicCommand) {
        return {
            summarize: {
                name: 'summarize',
                text: 'Summarize',
            }
        };
    }

    return {
        translate: {
            name: 'translate',
            text: 'Translate',
            options: ['english', 'german']
        },
        summarize: {
            name: 'summarize',
            text: 'Summarize',
        }
    };
};

const getDropDownButton = ($container) => {
    return $container.find(`.${DROP_DOWN_BUTTON_CLASS} .${BUTTON_CLASS}`);
};

const getDropDownButtonOption = (index) => {
    return $(`.${OVERLAY_CLASS} .${LIST_ITEM_CLASS}`).eq(index);
};

const getDialogSelectBoxes = ($container) => {
    const $wrapper = $container.find(`.${AI_DIALOG_CLASS}`);
    const $aiContent = $wrapper.find(`.${AI_DIALOG_CONTENT_CLASS}`);
    const $controls = $aiContent.find(`.${AI_DIALOG_CONTROLS_CLASS}`);
    return $controls.find(`.${SELECT_BOX_CLASS}`);
};

export const showAIDialog = (instance, { isBasicCommand, config } = {}) => {
    const commandsMap = createCommandsMap(isBasicCommand);
    const payload = {
        currentCommand: 'translate',
        currentCommandOption: 'english',
        commandsMap,
        text: 'Test text',
        ...config
    };

    return instance.aiDialog.show(payload);
};

export const clickActionButton = (insertionMode) => {
    const dropDownButtons = getDropDownButton($(`.${AI_DIALOG_CLASS}`));

    if(insertionMode === 'replace') {
        dropDownButtons.eq(0).trigger(CLICK_EVENT_NAME);

        return;
    }

    const insertionModeToIndexMap = {
        insertAbove: 0,
        insertBelow: 1,
    };

    dropDownButtons.eq(1).trigger(CLICK_EVENT_NAME);
    getDropDownButtonOption(insertionModeToIndexMap[insertionMode]).trigger(CLICK_EVENT_NAME);
};

export function findButtonByText($container, text) {
    return $container.find(`.${BUTTON_CLASS}`).filter((_, element) => $(element).text() === text);
}

export const getCommandSelectBoxInstance = ($container) => getDialogSelectBoxes($container).eq(0).dxSelectBox('instance');

export const getOptionSelectBoxInstance = ($container) => getDialogSelectBoxes($container).eq(1).dxSelectBox('instance');

export const setResultText = (value) => {
    const textAreaInstance = $(`.${TEXT_AREA_CLASS}`).eq(1).dxTextArea('instance');
    textAreaInstance.option('value', value);
};

export const getResultText = () => {
    const textAreaInstance = $(`.${TEXT_AREA_CLASS}`).eq(1).dxTextArea('instance');
    return textAreaInstance.option('value');
};
