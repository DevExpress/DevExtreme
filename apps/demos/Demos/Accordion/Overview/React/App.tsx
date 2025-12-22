import React, { useCallback, useState } from 'react';
import Accordion, { type AccordionTypes } from 'devextreme-react/accordion';
import Button from 'devextreme-react/button';
import CheckBox, { type CheckBoxTypes } from 'devextreme-react/check-box';
import TagBox, { type TagBoxTypes } from 'devextreme-react/tag-box';
import Slider, { Tooltip, Label, type SliderTypes } from 'devextreme-react/slider';

import service from './data.ts';
import CustomTitle from './CustomTitle.tsx';
import CustomItem from './CustomItem.tsx';

const companyLabel = { 'aria-label': 'Company' };
const companies = service.getCompanies();

const App = () => {
  const [selectedItems, setSelectedItems] = useState([companies[0]]);
  const [multiple, setMultiple] = useState(false);
  const [collapsible, setCollapsible] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(300);
  const [height, setHeight] = useState<AccordionTypes.Properties['height']>(400);

  const selectionChanged = useCallback((e: AccordionTypes.SelectionChangedEvent) => {
    let newItems = [...selectedItems];
    e.removedItems.forEach((item) => {
      const index = newItems.indexOf(item);
      if (index >= 0) {
        newItems.splice(index, 1);
      }
    });
    if (e.addedItems.length) {
      newItems = [...newItems, ...e.addedItems];
    }
    setSelectedItems(newItems);
  }, [selectedItems, setSelectedItems]);

  const selectedItemsChanged = useCallback((e: TagBoxTypes.ValueChangedEvent) => {
    setSelectedItems(e.value);
  }, [setSelectedItems]);

  const multipleChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => {
    setMultiple(e.value);
  }, [setMultiple]);

  const collapsibleChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => {
    setCollapsible(e.value);
  }, [setCollapsible]);

  const animationDurationChanged = useCallback((e: SliderTypes.ValueChangedEvent) => {
    setAnimationDuration(e.value);
  }, [setAnimationDuration]);

  return (
    <div id="accordion">
      <Accordion
        dataSource={companies}
        collapsible={collapsible}
        height={height}
        multiple={multiple}
        animationDuration={animationDuration}
        selectedItems={selectedItems}
        onSelectionChanged={selectionChanged}
        itemTitleRender={CustomTitle}
        itemRender={CustomItem}
        id="accordion-container"
      />
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <Button
            text="Reset height"
            onClick={() => setHeight(undefined)}
          />
        </div>
        <div className="option">
          <CheckBox
            text="Collapsible enabled"
            value={collapsible}
            onValueChanged={collapsibleChanged}
          />
        </div>
        <div className="option">
          <span>Animation duration</span>
          <Slider
            min={0}
            max={1000}
            value={animationDuration}
            onValueChanged={animationDurationChanged}
          >
            <Tooltip enabled={true} position="bottom" />
            <Label visible={true} />
          </Slider>
        </div>
        <div className="option">
          <span className="caption">Selected Items</span>
          <TagBox
            dataSource={companies}
            displayExpr="CompanyName"
            value={selectedItems}
            inputAttr={companyLabel}
            onValueChanged={selectedItemsChanged}
            disabled={!multiple}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
