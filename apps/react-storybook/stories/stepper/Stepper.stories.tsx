import React from 'react';
import { Stepper, Item, IStepperOptions, IItemProps } from 'devextreme-react/stepper'
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { defaultItems, itemsWithTitle, itemsWithIcon, itemsWithIconAndTitle } from './data';
import SingleFormIntegrationExample from './samples/formIntegration/SingleFormIntegration';
import MultipleFormIntegrationExample from './samples/formIntegration/MultipleFormIntegration';

const meta: Meta<typeof Stepper> = {
    title: 'Navigation/Stepper',
    component: Stepper,
};

export default meta;

type StepperRenderArgs = IStepperOptions & {
    items: IItemProps[],
};

export const Overview: StoryObj<typeof Stepper> = {
    argTypes: {
        items: {
            options: [
                'default',
                'withTitle',
                'withIcon',
                'withIconAndTitle',
            ],
            mapping: {
                default: defaultItems,
                withTitle: itemsWithTitle,
                withIcon: itemsWithIcon,
                withIconAndTitle: itemsWithIconAndTitle,
            },
            control: {
                type: 'select',
                labels: {
                    default: 'Default',
                    withTitle: 'With Title',
                    withIcon: 'With Custom Icon',
                    withIconAndTitle: 'With Custom Icon and Title',
                }
            },
        },
        orientation: {
            options: ['horizontal', 'vertical'],
            control: { type: 'select' },
        },
        linear: { control: 'boolean' },
        selectOnFocus: { control: 'boolean' },
        rtlEnabled: { control: 'boolean' },
        disabled: { control: 'boolean' },
        height: { control: 'text' },
        width: { control: 'text' },
    },
    args: {
        items: defaultItems,
        orientation: 'horizontal',
        linear: true,
        selectOnFocus: true,
        rtlEnabled: false,
        disabled: false,
    },
    render: ({ items = [], ...stepperProps }: StepperRenderArgs) => {
        return (
            <div style={{height: 500, width: '100%'}}>
                <Stepper {...stepperProps}>
                    {items.map((item, index) => <Item key={index} {...item} />)}
                </Stepper>
            </div>
        );
    }
}

export const Step: StoryObj<typeof Item> = {
    argTypes: {
        text: { control: 'text' },
        icon: {
            options: ['numeric', 'cart', 'clipboardtasklist', 'gift', 'packagebox'],
            mapping: {
                numeric: undefined,
            },
            control: 'select',
        },
        title: { control: 'text' },
        hint: { control: 'text' },
        isValid: {
            options: [undefined, true, false],
            control: 'inline-radio',
        },
        optional: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    args: {},
    render: (itemProps) => {
        return (
            <Stepper width={300} selectedIndex={1}>
                <Item title={'Completed'} {...itemProps} />
                <Item title={'Selected'} {...itemProps} />
                <Item title={'Default'} {...itemProps} />
            </Stepper>
        );
    }
}

export const SingleFormIntegration: StoryObj<typeof Stepper> = {
    args: {},
    render: () => <SingleFormIntegrationExample />,
}

export const MultipleFormIntegration: StoryObj<typeof Stepper> = {
    args: {},
    render: () => <MultipleFormIntegrationExample />,
}
