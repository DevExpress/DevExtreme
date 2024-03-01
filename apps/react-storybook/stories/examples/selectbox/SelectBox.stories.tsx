import type { Meta, StoryObj } from '@storybook/react';

import React, { useCallback, useState } from 'react';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import notify from 'devextreme/ui/notify';

import service from "./data";
import Field from "./Field";
import Item from "./Item";
import "./styles.css";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof SelectBox> = {
    title: 'Example/SelectBox',
    component: SelectBox,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'padded',
    }
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    /*argTypes: {
        backgroundColor: { control: 'color' },
    },*/
};

export default meta;

type Story = StoryObj<typeof SelectBox>;

const simpleProductLabel = { 'aria-label': 'Simple Product' };
const productWithPlaceholderLabel = { 'aria-label': 'Product With Placeholder' };
const productLabel = { 'aria-label': 'Product' };
const readOnlyProductLabel = { 'aria-label': 'ReadOnly Product' };
const templatedProductLabel = { 'aria-label': 'Templated Product' };
const disabledProductLabel = { 'aria-label': 'Disabled Product' };

const products = service.getProducts();
const simpleProducts = service.getSimpleProducts();

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultMode: Story = {
    args: {
        items: simpleProducts,
        inputAttr: simpleProductLabel
    },
};

export const CustomPlaceholder: Story = {
    args: {
        items: simpleProducts,
        placeholder: "Choose Product",
        inputAttr: productWithPlaceholderLabel,
        showClearButton: true,
    },
};

export const ReadOnly: Story = {
    args: {
        items: simpleProducts,
        defaultValue: simpleProducts[0],
        inputAttr: readOnlyProductLabel,
        readOnly: true
    },
};

export const Disabled: Story = {
    args: {
        items: simpleProducts,
        inputAttr: disabledProductLabel,
        defaultValue: simpleProducts[0],
        disabled: true
    },
};

export const CustomTemplates: Story = {
    args: {
        id: "custom-templates",
        dataSource: products,
        displayExpr: "Name",
        inputAttr: templatedProductLabel,
        valueExpr: "ID",
        defaultValue: products[3].ID,
        fieldRender: Field,
        itemRender: Item
    },
}

export const EventHandling: Story = {
    args: {
        items: simpleProducts,
        inputAttr: productLabel
    },
    render: ({ items, inputAttr}) => {
        const [value, setValue] = useState(service.getSimpleProducts()[0]);

        const onValueChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
            setValue(e.value);
            notify(`The value is changed to: "${e.value}"`);
        }, []);

        return (
            <div>
                <SelectBox
                    items={items}
                    value={value}
                    inputAttr={inputAttr}
                    onValueChanged={onValueChanged}
                />
                <div className="current-value">
                    Selected product is <span>{value}</span>
                </div>
            </div>
        );
    }
}
