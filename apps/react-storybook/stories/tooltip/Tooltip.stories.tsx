import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Tooltip } from 'devextreme-react/tooltip';

const meta: Meta<typeof Tooltip> = {
    title: 'Components/Tooltip',
    component: Tooltip,
    parameters: {
        layout: 'padded',
    },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

const HoverableExample: Story['render'] = (args) => (
    <div style={{ padding: '80px 40px' }}>
        <p style={{ marginBottom: 16 }}>
            Hover the button to show the tooltip, then move the pointer onto
            the tooltip content — it must stay open.
        </p>
        <button id="tooltip-target">
            Hover me
        </button>
        <Tooltip
            {...args}
            target="#tooltip-target"
            showEvent="mouseenter"
            hideEvent="mouseleave"
        >
            <div style={{ padding: '8px 12px' }}>
                <strong>WCAG — Hoverable</strong>
                <p style={{ margin: '6px 0 0' }}>
                    Move your pointer here from the button.
                    <br />
                    The tooltip stays open as long as the pointer
                    <br />
                    is over the target <em>or</em> this content.
                </p>
            </div>
        </Tooltip>
    </div>
);

export const Hoverable: Story = {
    args: {
        position: 'bottom',
    },
    argTypes: {
        position: {
            control: 'select',
            options: ['top', 'bottom', 'left', 'right'],
        },
    },
    render: HoverableExample,
};

const HoverableWithDelayExample: Story['render'] = (args) => (
    <div style={{ padding: '80px 40px' }}>
        <p style={{ marginBottom: 16 }}>
            Show delay: <strong>500 ms</strong> — Hide delay: <strong>300 ms</strong>.
            Moving onto the tooltip content cancels the hide timeout.
        </p>
        <button id="tooltip-target-delay">
            Hover me (with delay)
        </button>
        <Tooltip
            {...args}
            target="#tooltip-target-delay"
            showEvent={{ name: 'mouseenter', delay: 500 }}
            hideEvent={{ name: 'mouseleave', delay: 300 }}
        >
            <div style={{ padding: '8px 12px' }}>
                Move here to cancel the hide timeout.
            </div>
        </Tooltip>
    </div>
);

export const HoverableWithDelay: Story = {
    args: {
        position: 'bottom',
    },
    argTypes: {
        position: {
            control: 'select',
            options: ['top', 'bottom', 'left', 'right'],
        },
    },
    render: HoverableWithDelayExample,
};
