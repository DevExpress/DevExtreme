import React, { useCallback, useState } from 'react';
import ScrollView from 'devextreme-react/scroll-view';
import Sortable, { SortableTypes } from 'devextreme-react/sortable';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import CheckBox, { CheckBoxTypes } from 'devextreme-react/check-box';
import NumberBox, { NumberBoxTypes } from 'devextreme-react/number-box';
import { DragDirection, DragHighlight, Orientation } from 'devextreme/common';
import {
  tasks,
  scrollSensitivityLabel,
  scrollSpeedLabel,
  dropFeedbackModeLabel,
  dragDirectionLabel,
  itemOrientationLabel,
} from './data.ts';
import Item from './Item.tsx';
import DragItem from './DragItem.tsx';

const dropFeedbackModes: DragHighlight[] = ['push', 'indicate'];
const itemOrientations: Orientation[] = ['vertical', 'horizontal'];
const verticalDragDirections: DragDirection[] = ['both', 'vertical'];
const horizontalDragDirections: DragDirection[] = ['both', 'horizontal'];

const App = () => {
  const [items, setItems] = useState(tasks);
  const [dropFeedbackMode, setDropFeedbackMode] = useState<DragHighlight>('push');
  const [itemOrientation, setItemOrientation] = useState<Orientation>('vertical');
  const [dragDirection, setDragDirection] = useState<DragDirection>('both');
  const [scrollSpeed, setScrollSpeed] = useState(30);
  const [scrollSensitivity, setScrollSensitivity] = useState(60);
  const [handle, setHandle] = useState('');
  const [dragComponent, setDragComponent] = useState(null);
  const [cursorOffset, setCursorOffset] = useState(null);

  const onDragStart = useCallback((e: SortableTypes.DragStartEvent) => {
    e.itemData = items[e.fromIndex];
  }, [items]);

  const onReorder = useCallback((e: SortableTypes.ReorderEvent) => {
    let updatedItems = [...items.slice(0, e.fromIndex), ...items.slice(e.fromIndex + 1)];
    updatedItems = [
      ...updatedItems.slice(0, e.toIndex),
      e.itemData,
      ...updatedItems.slice(e.toIndex),
    ];

    setItems(updatedItems);
  }, [items, setItems]);

  const onDropFeedbackModeChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setDropFeedbackMode(e.value);
  }, [setDropFeedbackMode]);

  const onItemOrientationChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setItemOrientation(e.value);
    setDragDirection('both');
  }, [setItemOrientation, setDragDirection]);

  const onDragDirectionChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setDragDirection(e.value);
  }, [setDragDirection]);

  const onScrollSpeedChanged = useCallback((e: NumberBoxTypes.ValueChangedEvent) => {
    setScrollSpeed(e.value);
  }, [setScrollSpeed]);

  const onScrollSensitivityChanged = useCallback((e: NumberBoxTypes.ValueChangedEvent) => {
    setScrollSensitivity(e.value);
  }, [setScrollSensitivity]);

  const onHandleChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => {
    setHandle(e.value ? '.handle' : '');
  }, [setHandle]);

  const onDragTemplateChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => {
    setDragComponent(e.value ? DragItem : null);
    setCursorOffset(e.value ? { x: 10, y: 20 } : null);
  }, [setDragComponent, setCursorOffset]);

  return (
    <div id="demo-container">
      <div className="widget-container">
        <ScrollView
          id="scroll"
          className={itemOrientation === 'horizontal' ? 'horizontal' : ''}
          direction={itemOrientation}
          showScrollbar="always"
        >
          <Sortable
            id="list"
            dropFeedbackMode={dropFeedbackMode}
            itemOrientation={itemOrientation}
            dragDirection={dragDirection}
            scrollSpeed={scrollSpeed}
            scrollSensitivity={scrollSensitivity}
            handle={handle}
            dragComponent={dragComponent}
            cursorOffset={cursorOffset}
            onDragStart={onDragStart}
            onReorder={onReorder}
          >
            {items.map((item: { Task_ID: any; Task_Subject: any; }) => (
              <Item
                key={item.Task_ID}
                text={item.Task_Subject}
                handle={handle}
              />
            ))}
          </Sortable>
        </ScrollView>
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Drop Feedback Mode:</span>
          <SelectBox
            items={dropFeedbackModes}
            inputAttr={dropFeedbackModeLabel}
            value={dropFeedbackMode}
            onValueChanged={onDropFeedbackModeChanged}
          />
        </div>
        <div className="option">
          <span>Item Orientation:</span>
          <SelectBox
            items={itemOrientations}
            inputAttr={itemOrientationLabel}
            value={itemOrientation}
            onValueChanged={onItemOrientationChanged}
          />
        </div>
        <div className="option">
          <span>Drag Direction:</span>
          <SelectBox
            items={
              itemOrientation === 'vertical'
                ? verticalDragDirections
                : horizontalDragDirections
            }
            value={dragDirection}
            inputAttr={dragDirectionLabel}
            onValueChanged={onDragDirectionChanged}
          />
        </div>
        <div className="option">
          <span>Scroll Speed:</span>
          <NumberBox
            value={scrollSpeed}
            inputAttr={scrollSpeedLabel}
            onValueChanged={onScrollSpeedChanged}
          />
        </div>
        <div className="option">
          <span>Scroll Sensitivity:</span>
          <NumberBox
            value={scrollSensitivity}
            inputAttr={scrollSensitivityLabel}
            onValueChanged={onScrollSensitivityChanged}
          />
        </div>
        <div className="option">
          <CheckBox text="Use Handle" onValueChanged={onHandleChanged} />
        </div>
        <div className="option">
          <CheckBox
            text="Use Drag Template"
            onValueChanged={onDragTemplateChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
