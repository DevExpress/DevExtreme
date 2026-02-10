import React, { useCallback, useState } from 'react';
import Accordion, { type AccordionTypes } from 'devextreme-react/accordion';
import CheckBox, { type CheckBoxTypes } from 'devextreme-react/check-box';
import TagBox, { type TagBoxTypes } from 'devextreme-react/tag-box';
import Slider, { Tooltip, Label, type SliderTypes } from 'devextreme-react/slider';

import { companies } from './data.ts';
import type { Company } from './types.ts';
import CustomTitle from './CustomTitle.tsx';
import CustomItem from './CustomItem.tsx';

const companyLabel = { 'aria-label': 'Company' };

const App = () => {
  const [selectedItems, setSelectedItems] = useState<Company[]>([companies[0]])
  const [multiple, setMultiple] = useState<boolean>(false)
  const [collapsible, setCollapsible] = useState<boolean>(false)
  const [animationDuration, setAnimationDuration] = useState<number>(300);

  const selectionChanged = useCallback((e: AccordionTypes.SelectionChangedEvent): void => {
    let newItems = [...selectedItems];
    e.removedItems.forEach((item: Company): void => {
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

  const selectedItemsChanged = useCallback((e: TagBoxTypes.ValueChangedEvent): void => {
    setSelectedItems(e.value);
  }, []);

  const multipleChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent): void => {
    setMultiple(e.value);
  }, []);

  const collapsibleChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent): void => {
    setCollapsible(e.value);
  }, []);

  const animationDurationChanged = useCallback((e: SliderTypes.ValueChangedEvent): void => {
    setAnimationDuration(e.value);
  }, []);

  return (
    <div id="accordion">
      <Accordion
        dataSource={companies}
        collapsible={collapsible}
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
          <CheckBox
            text="Multiple enabled"
            value={multiple}
            onValueChanged={multipleChanged}
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
