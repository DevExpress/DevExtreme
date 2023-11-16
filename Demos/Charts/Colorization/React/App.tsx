import React from 'react';
import TreeMap, { Tooltip, ITooltipProps } from 'devextreme-react/tree-map';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import { salesAmount, colorizationOptions, colorizationTypeLabel } from './data.ts';

const customizeTooltip: ITooltipProps['customizeTooltip'] = (arg) => {
  const { data } = arg.node;

  return {
    text: arg.node.isLeaf() ? `<span class='product'>${data.name}</span><br/>Sales Amount: ${arg.valueText}` : null,
  };
};

function App() {
  const [typeOptions, setTypeOptions] = React.useState(colorizationOptions[2].options);

  const setType = React.useCallback((data: SelectBoxTypes.ValueChangedEvent) => {
    setTypeOptions(data.value);
  }, [setTypeOptions]);

  return (
    <React.Fragment>
      <TreeMap
        id="treemap"
        dataSource={salesAmount}
        title="Sales Amount by Product"
        valueField="salesAmount"
        colorizer={typeOptions}
      >
        <Tooltip
          enabled={true}
          customizeTooltip={customizeTooltip}
          format="currency"
        />
      </TreeMap>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Colorization Type </span>
          <SelectBox
            dataSource={colorizationOptions}
            displayExpr="name"
            inputAttr={colorizationTypeLabel}
            valueExpr="options"
            width={200}
            value={typeOptions}
            onValueChanged={setType}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
