import React from 'react';
import { Menu, MenuTypes } from 'devextreme-react/menu';
import type { Meta, StoryObj } from '@storybook/react';
import { menuItems } from './data';

const meta: Meta<typeof Menu> = {
    title: 'Components/Menu',
    component: Menu,
    parameters: {
        layout: 'fullscreen',
    }
};

type Story = StoryObj<typeof Menu>;

const showSubmenuModes= ['onClick', 'onHover'] as const;
const submenuDirectionOptions = ['auto', 'leftOrTop', 'rightOrBottom'] as const;

const commonArgs: Story['args'] = {
    showFirstSubmenuMode: showSubmenuModes[0],
    submenuDirection: submenuDirectionOptions[0],
    hideSubmenuOnMouseLeave: false,
    adaptivityEnabled: false,
};

const argTypes = {
    showFirstSubmenuMode: {
        control: 'select',
        options: showSubmenuModes,
    },
    submenuDirection: {
        control: 'select',
        options: submenuDirectionOptions,
    },
    hideSubmenuOnMouseLeave: {
        control: 'boolean',
    },
    adaptivityEnabled: {
        control: 'boolean',
    },
};

export default meta;

const createMenuStory = (orientation: MenuTypes.Orientation): Story => ({
    args: { ...commonArgs, orientation },
    argTypes,
    render: (args) => <Menu dataSource={menuItems} {...args} />,
});

export const Horizontal: Story = createMenuStory('horizontal');
export const Vertical: Story = createMenuStory('vertical');
