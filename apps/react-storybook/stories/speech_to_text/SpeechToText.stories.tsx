import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import dxSpeechToText from 'devextreme/ui/speech_to_text';
import { wrapDxWithReact } from '../utils';


const SpeechToText = wrapDxWithReact(dxSpeechToText);

const meta: Meta<typeof SpeechToText> = {
    title: 'Components/SpeechToText',
    component: SpeechToText,
};

export default meta;

type Story = StoryObj<typeof SpeechToText>;

export const DefaultSpeechToText: Story = {
    args: {
        width: 'auto',
        startIcon: 'micfilled',
        stopIcon: 'stopfilled',
        startText: '',
        stopText: '',
        stylingMode: 'contained',
        type: 'normal',
        visible: true,
        rtlEnabled: false,
        disabled: false,
    },
    argTypes: {
        width: {
            options: ['auto', '100%'],
            control: { type: 'radio' }
        },
        startIcon: {
            options: ['micfilled', 'video', 'isnotblank', undefined],
            control: { type: 'select' }
        },
        stopIcon: {
            options: ['micfilled', 'stopfilled', 'square', 'indeterminatestate', undefined],
            control: { type: 'select' }
        },
        startText: {
            options: ['', 'start'],
            control: { type: 'select' }
        },
        stopText: {
            options: ['', 'stop'],
            control: { type: 'select' }
        },
        stylingMode: {
            options: ['contained', 'text', 'outlined'],
            control: { type: 'select' }
        },
        type: {
            options: ['normal', 'default', 'success', 'danger'],
            control: { type: 'select' }
        },
        visible: {
            control: 'boolean'
        },
        rtlEnabled: {
            control: 'boolean'
        },
        disabled: {
            control: 'boolean'
        },
    },
    render: ({
        width,
        startIcon,
        stopIcon,
        startText,
        stopText,
        stylingMode,
        type,
        visible,
        rtlEnabled,
        disabled,
    }) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SpeechToText
                    width={width}
                    startIcon={startIcon}
                    stopIcon={stopIcon}
                    startText={startText}
                    stopText={stopText}
                    stylingMode={stylingMode}
                    type={type}
                    disabled={disabled}
                    rtlEnabled={rtlEnabled}
                    visible={visible}
                />
            </div>
        );
    }
};
