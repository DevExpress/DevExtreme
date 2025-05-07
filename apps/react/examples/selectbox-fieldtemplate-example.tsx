import * as React from 'react';
import { SelectBox } from 'devextreme-react/select-box';
import { TextBox } from 'devextreme-react/text-box';

const nameLabel = { 'aria-label': 'Name' };

function Field(data: { ImageSrc: any; Name: any }) {
  return (
    <div className="custom-item">
      <img
        alt="Product name"
        src={data && data.ImageSrc}
      />
      <TextBox
        className="product-name"
        inputAttr={nameLabel}
        defaultValue={data && data.Name}
        readOnly={true}
      />
    </div>
  );
}

const products = [
  {
    ID: 1,
    Name: "HD Video Player",
    Price: 330,
    Current_Inventory: 225,
    Backorder: 0,
    Manufacturing: 10,
    Category: "Video Players",
    ImageSrc:
      "https://js.devexpress.com/React/Demos/WidgetsGallery/JSDemos/images/products/1-small.png",
  },
  {
    ID: 2,
    Name: "SuperHD Player",
    Price: 400,
    Current_Inventory: 150,
    Backorder: 0,
    Manufacturing: 25,
    Category: "Video Players",
    ImageSrc:
      "https://js.devexpress.com/React/Demos/WidgetsGallery/JSDemos/images/products/2-small.png",
  },
];


export default (): React.ReactElement | null => {
  const [value, setValue] = React.useState(1);

  // NOTE: In real we do some mapping, like `products.map(x => ({ ... }))
  const items = [...products];

  return (
    <SelectBox
      showClearButton={true}
      dataSource={items}
      displayExpr="Name"
      valueExpr="ID"
      value={value}
      onValueChange={setValue}
      fieldRender={Field}
    />
  );
};
