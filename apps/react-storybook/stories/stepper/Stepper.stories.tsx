import React from 'react';
import {Stepper, Item, IStepperOptions, IItemProps} from 'devextreme-react/stepper'
import type {Meta, StoryObj} from '@storybook/react';

import {defaultItems, itemsWithTitle, itemsWithIcon, itemsWithIconAndTitle} from './data';

const meta: Meta<typeof Stepper> = {
    title: 'Navigation/Stepper',
    component: Stepper,
};

export default meta;

type StepperRenderArgs = IStepperOptions & { items: IItemProps[] };

export const Overview: StoryObj<typeof Stepper> = {
    argTypes: {
        orientation: {
            options: ['horizontal', 'vertical'],
            control: {type: 'select'},
        },
        linear: {
            control: 'boolean',
        },
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
    },
    args: {
        orientation: 'horizontal',
        linear: true,
        items: defaultItems,
    },
    render: ({orientation, linear, items = []}: StepperRenderArgs) => {
        return (
            <div style={{height: 500, width: '100%'}}>
                <Stepper orientation={orientation} linear={linear}>
                    {items.map((item, index) => <Item key={index} {...item} />)}
                </Stepper>
            </div>
        );
    }
}

export const Step: StoryObj<typeof Item> = {
    argTypes: {
        text: {control: 'text'},
        icon: {
            options: ['cart', 'clipboardtasklist', 'gift', 'packagebox'],
            control: 'select',
        },
        title: {control: 'text'},
        hint: {control: 'text'},
        isValid: {control: 'boolean'},
        optional: {control: 'boolean'},
        disabled: {control: 'boolean'},
    },
    args: {},
    render: (itemProps) => {
        return (
            <Stepper>
                <Item {...itemProps} />
            </Stepper>
        );
    }
}