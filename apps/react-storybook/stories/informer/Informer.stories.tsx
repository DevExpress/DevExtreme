import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import dxInformer from 'devextreme/ui/informer';
import { wrapDxWithReact } from '../utils';


const Informer = wrapDxWithReact(dxInformer);

const textOptions = {
    error: 'error',
    biggerError: 'bigger error',
    bigError: 'really really big and huge error that takes really much space',
    superBigError: 'error that will never be able to fit into one line because it is so big and even if it tried to fit it would still not be able to be displayed properly due to its excessive length',
};

const meta: Meta<typeof Informer> = {
    title: 'Components/Informer',
    component: Informer,
    parameters: {
        layout: 'padded',
    }
};

export default meta;

type Story = StoryObj<typeof Informer>;

export const DefaultInformer: Story = {
    args: {
        showBackground: true,
        width: '100%',
        contentAlignment: 'center',
        icon: 'errorcircle',
        text: 'error',
        visible: true,
        rtlEnabled: false,
        disabled: false,
    },
    argTypes: {
        showBackground: {
            control: 'boolean'
        },
        width: {
            options: ['100%', 'auto'],
            control: { type: 'radio' }
        },
        contentAlignment: {
            options: ['start', 'center', 'end'],
            control: { type: 'radio' }
        },
        icon: {
            options: ['errorcircle', 'bell', 'sun', undefined],
            control: { type: 'select' }
        },
        text: {
            options: Object.keys(textOptions),
            mapping: textOptions,
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
        showBackground,
        width,
        contentAlignment,
        icon,
        text,
        visible,
        rtlEnabled,
        disabled,
    }) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Informer
                    width={width}
                    disabled={disabled}
                    rtlEnabled={rtlEnabled}
                    visible={visible}
                    text={text}
                    icon={icon}
                    showBackground={showBackground}
                    contentAlignment={contentAlignment}
                >
                </Informer>
            </div>
        );
    }
};
