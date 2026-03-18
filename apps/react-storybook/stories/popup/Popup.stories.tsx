import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useCallback, useState } from 'react';

import { Button } from 'devextreme-react/button';
import { DateBox } from 'devextreme-react/date-box';
import { Popup } from 'devextreme-react/popup';
import { SelectBox } from 'devextreme-react/select-box';
import { TextBox } from 'devextreme-react/text-box';
import { categories, products } from './data';

const meta: Meta<typeof Popup> = {
    title: 'Components/Popup',
    component: Popup,
    parameters: {
        layout: 'padded',
    },
};

export default meta;

type Story = StoryObj<typeof Popup>;

const EscapeFromEditorsExample: Story['render'] = () => {
    const [visible, setVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(products[0]);
    const [category, setCategory] = useState(categories[0]);

    const show = useCallback(() => setVisible(true), []);
    const hide = useCallback(() => setVisible(false), []);

    return (
        <div style={{ padding: 24 }}>
            <p style={{ marginBottom: 16, color: '#555' }}>
                Open the popup and focus any editor. Press Escape - the popup
                should close even when focus is inside a TextBox, SelectBox, or DateBox.
            </p>
            <Button text="Open Popup" type="default" onClick={show} />

            <Popup
                visible={visible}
                onHiding={hide}
                title="Edit Product"
                width={420}
                height="auto"
                hideOnOutsideClick
                showCloseButton
                toolbarItems={[
                    {
                        widget: 'dxButton',
                        toolbar: 'bottom',
                        location: 'after',
                        options: {
                            text: 'Save',
                            type: 'default',
                            stylingMode: 'contained',
                            onClick: hide,
                        },
                    },
                    {
                        widget: 'dxButton',
                        toolbar: 'bottom',
                        location: 'after',
                        options: {
                            text: 'Cancel',
                            stylingMode: 'outlined',
                            onClick: hide,
                        },
                    },
                ]}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 0' }}>
                    <TextBox
                        label="Product"
                        value={selectedProduct.text}
                        onValueChanged={(e) => setSelectedProduct({ ...selectedProduct, text: e.value })}
                    />
                    <SelectBox
                        label="Category"
                        items={categories}
                        value={category}
                        onValueChanged={(e) => setCategory(e.value)}
                    />
                    <DateBox
                        label="Available From"
                        type="date"
                        defaultValue={new Date(2024, 0, 1)}
                    />
                </div>
            </Popup>
        </div>
    );
};

export const EscapeFromEditors: Story = {
    name: 'Popup - Escape handling',
    render: EscapeFromEditorsExample,
};