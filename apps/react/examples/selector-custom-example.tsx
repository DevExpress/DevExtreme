import React, { useCallback, useState } from "react";
import { SelectBoxTypes } from "devextreme-react/select-box";
import { SelectBox } from "devextreme-react";
import { TextBox } from "devextreme-react";

const products = [{
    ID: 1,
    Name: 'HD Video Player',
    Price: 330,
    Current_Inventory: 225,
    Backorder: 0,
    Manufacturing: 10,
    Category: 'Video Players',
    ImageSrc: 'https://js.devexpress.com/React/Demos/WidgetsGallery/JSDemos/images/products/1-small.png',
}, {
    ID: 2,
    Name: 'SuperHD Player',
    Price: 400,
    Current_Inventory: 150,
    Backorder: 0,
    Manufacturing: 25,
    Category: 'Video Players',
    ImageSrc: 'https://js.devexpress.com/React/Demos/WidgetsGallery/JSDemos/images/products/2-small.png',
}];

const templatedProductLabel = { "aria-label": "Templated Product" };
const nameLabel = { "aria-label": "Name" };
function Item(data) {
    return (
        <div className="custom-item">
            <img
                alt="Product name"
                src={data.ImageSrc}
            />
            <div className="product-name">{data.Name}</div>
        </div>
    );
}

function Field(data: { ImageSrc: any; Name: any }) {
    return (
        <div className="custom-item">
            <div className="value">{data.Name}</div>
            <img
                alt="Product name"
                src={data && data.ImageSrc} />
            <TextBox
                value= {data?.Name || ''}
                className="product-name"
                inputAttr={nameLabel}
                defaultValue={data && data.Name}
                readOnly={true}
            />
        </div>
    );
}

function SelectBoxCustomExample() {
    const [value, setValue] = useState('1');
    const onValueChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
        setValue(e.value)
    }, []);

    return (
        <div>
            <div>
                value: {value}
            </div>
            <SelectBox
                onValueChanged={onValueChanged}
                id="custom-templates"
                dataSource={products}
                displayExpr="Name"
                inputAttr={templatedProductLabel}
                valueExpr="ID"
                defaultValue={products[0].ID}
                fieldRender={Field}
                itemRender={Item}
            />
        </div>
    );
}

export default SelectBoxCustomExample;
