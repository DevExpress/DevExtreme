import $ from 'jquery';

const AI_DIALOG_LOAD_INDICATOR_CLASS = 'dx-pending-indicator';
const AI_DIALOG_CLASS = 'dx-aidialog';
const AI_DIALOG_CONTROLS_CLASS = 'dx-aidialog-controls';
const AI_DIALOG_CONTENT_CLASS = 'dx-aidialog-content';
const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const BUTTON_CLASS = 'dx-button';
const LIST_ITEM_CLASS = 'dx-list-item';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const SELECTBOX_CLASS = 'dx-selectbox';
const TEXTAREA_CLASS = 'dx-textarea';
const INFORMER_CLASS = 'dx-informer';

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

export const buildDefaultCommandsMap = () => ({
    summarize: {
        id: 'summarize',
        name: 'summarize',
        text: 'Summarize',
    },
    translate: {
        id: 'translate',
        name: 'translate',
        text: 'Translate',
        options: ['english', 'german'],
    },
    changeStyle: {
        id: 'changeStyle',
        name: 'changeStyle',
        text: 'Change style',
        options: ['formal', 'informal'],
    },
    changeTone: {
        id: 'changeTone',
        name: 'changeTone',
        text: 'Change tone',
        options: ['professional', 'casual'],
    },
    askAI: {
        id: 'askAI',
        name: 'askAI',
        text: 'Ask AI',
    },
    custom0: {
        id: 'custom0',
        name: 'custom',
        text: 'Custom',
        options: ['Option 1', 'Option 2'],
        prompt: (param) => `Prompt with ${param}`,
    },
    custom2: {
        id: 'custom2',
        name: 'custom',
        text: 'Custom 2',
        prompt: () => 'Simple prompt',
    },
});

export const getLoadIndicator = ($container) => {
    return $container.find(`.${AI_DIALOG_LOAD_INDICATOR_CLASS}`);
};

export const getBottomToolbarItems = (popup) => {
    return popup.option('toolbarItems').filter(item => item.toolbar === 'bottom');
};

const getDropDownButton = ($container) => {
    return $container.find(`.${DROP_DOWN_BUTTON_CLASS} .${BUTTON_CLASS}`);
};

const getDropDownButtonOption = (index) => {
    return $(`.${OVERLAY_CONTENT_CLASS} .${LIST_ITEM_CLASS}`).eq(index);
};

const getDialogSelectBoxes = ($container) => {
    const $wrapper = $container.find(`.${AI_DIALOG_CLASS}`);
    const $aiContent = $wrapper.find(`.${AI_DIALOG_CONTENT_CLASS}`);
    const $controls = $aiContent.find(`.${AI_DIALOG_CONTROLS_CLASS}`);
    return $controls.find(`.${SELECTBOX_CLASS}`);
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

export const getItemByName = (items, name) => items.find((items) => items.name === name);
export const findButtonByName = (popup, name) => {
    const buttonIndex = getBottomToolbarItems(popup).findIndex((item) => item.name === name);
    const $bottomToolbar = popup.bottomToolbar();
    return $($bottomToolbar.find(`.${BUTTON_CLASS}`).eq(buttonIndex));
};

export const getCommandSelectBoxInstance = ($container) => getDialogSelectBoxes($container).eq(0).dxSelectBox('instance');
export const getOptionSelectBoxInstance = ($container) => getDialogSelectBoxes($container).eq(1).dxSelectBox('instance');
export const getPromptTextAreaInstance = ($container) => $container.find(`.${TEXTAREA_CLASS}`).eq(0).dxTextArea('instance');
export const getResultTextAreaInstance = ($container) => $container.find(`.${TEXTAREA_CLASS}`).eq(1).dxTextArea('instance');
export const getInformerInstance = ($container) => $container.find(`.${INFORMER_CLASS}`).eq(0).dxInformer('instance');

export const setResultText = (value) => {
    const textAreaInstance = $(`.${TEXTAREA_CLASS}`).eq(1).dxTextArea('instance');
    textAreaInstance.option('value', value);
};

export const getResultTextAreaValue = () => {
    const textAreaInstance = $(`.${TEXTAREA_CLASS}`).eq(1).dxTextArea('instance');
    return textAreaInstance.option('value');
};
