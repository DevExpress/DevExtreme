import Popup from '../popup';
import Button from '../button';
import TextArea from '../textArea';

const CLASS = {
    button: 'dx-button',
    textArea: 'dx-ai-prompt-editor__text-area',
    regenerateButton: 'dx-ai-prompt-editor__refresh-button',
    stopButton: 'dx-ai-prompt-editor__stop-button',
    applyButton: 'dx-ai-prompt-editor__apply-button',
};

export class AIPromptEditor extends Popup {
    getTextArea(): TextArea {
        return new TextArea(this.getWrapper().find(`.${CLASS.textArea}`));
    }

    getRegenerateButton(): Button {
        return new Button(this.getWrapper().find(`.${CLASS.button}.${CLASS.regenerateButton}`));
    }

    getStopButton(): Button {
        return new Button(this.getWrapper().find(`.${CLASS.button}.${CLASS.stopButton}`));
    }

    getApplyButton(): Button {
        return new Button(this.getWrapper().find(`.${CLASS.button}.${CLASS.applyButton}`));
    }
}
