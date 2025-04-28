import $ from 'jquery';

import {
    AI_DIALOG_LOAD_INDICATOR_CLASS,
    AI_DIALOG_CLASS,
    AI_DIALOG_CONTROLS_CLASS,
    AI_DIALOG_CONTENT_CLASS,
} from '__internal/ui/html_editor/ui/aiDialog';
import {
    DX_BUTTON_CLASS,
    DROP_DOWN_BUTTON_CLASS,
} from '__internal/ui/m_drop_down_button';
import { LIST_ITEM_CLASS } from '__internal/ui/m_list.base';
import { OVERLAY_CONTENT_CLASS } from '__internal/ui/overlay/m_overlay';
import { SELECTBOX_CLASS } from '__internal/ui/m_select_box';
import { TEXTAREA_CLASS } from '__internal/ui/m_text_area';

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

export const getToolbarButtonItems = (popup) => {
    return popup.option('toolbarItems').filter(item => ['dxButton', 'dxDropDownButton'].includes(item.widget));
};

const getDropDownButton = ($container) => {
    return $container.find(`.${DROP_DOWN_BUTTON_CLASS} .${DX_BUTTON_CLASS}`);
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

export function findButtonByText($container, text) {
    return $container.find(`.${DX_BUTTON_CLASS}`).filter((_, element) => $(element).text() === text);
}

export const getCommandSelectBoxInstance = ($container) => getDialogSelectBoxes($container).eq(0).dxSelectBox('instance');
export const getOptionSelectBoxInstance = ($container) => getDialogSelectBoxes($container).eq(1).dxSelectBox('instance');
export const getPromptTextAreaInstance = ($container) => $container.find(`.${TEXTAREA_CLASS}`).eq(0).dxTextArea('instance');
export const getResultTextAreaInstance = ($container) => $container.find(`.${TEXTAREA_CLASS}`).eq(1).dxTextArea('instance');

export const setResultText = (value) => {
    const textAreaInstance = $(`.${TEXTAREA_CLASS}`).eq(1).dxTextArea('instance');
    textAreaInstance.option('value', value);
};

export const getResultTextAreaValue = () => {
    const textAreaInstance = $(`.${TEXTAREA_CLASS}`).eq(1).dxTextArea('instance');
    return textAreaInstance.option('value');
};
