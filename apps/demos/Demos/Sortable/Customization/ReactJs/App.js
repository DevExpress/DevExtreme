import React, { useCallback, useState } from 'react';
import CheckBox from 'devextreme-react/check-box';
import NumberBox from 'devextreme-react/number-box';
import ScrollView from 'devextreme-react/scroll-view';
import SelectBox from 'devextreme-react/select-box';
import Sortable from 'devextreme-react/sortable';
import {
  tasks,
  scrollSensitivityLabel,
  scrollSpeedLabel,
  dropFeedbackModeLabel,
  dragDirectionLabel,
  itemOrientationLabel,
} from './data.js';
import DragItem from './DragItem.js';
import Item from './Item.js';

const dropFeedbackModes = ['push', 'indicate'];
const itemOrientations = ['vertical', 'horizontal'];
const verticalDragDirections = ['both', 'vertical'];
const horizontalDragDirections = ['both', 'horizontal'];
const App = () => {
  const [items, setItems] = useState(tasks);
  const [dropFeedbackMode, setDropFeedbackMode] = useState('push');
  const [itemOrientation, setItemOrientation] = useState('vertical');
  const [dragDirection, setDragDirection] = useState('both');
  const [scrollSpeed, setScrollSpeed] = useState(30);
  const [scrollSensitivity, setScrollSensitivity] = useState(60);
  const [handle, setHandle] = useState('');
  const [useDragComponent, setUseDragComponent] = useState(false);
  const [cursorOffset, setCursorOffset] = useState(undefined);
  const onDragStart = useCallback(
    (e) => {
      e.itemData = items[e.fromIndex];
    },
    [items],
  );
  const onReorder = useCallback(
    (e) => {
      let updatedItems = [...items.slice(0, e.fromIndex), ...items.slice(e.fromIndex + 1)];
      updatedItems = [
        ...updatedItems.slice(0, e.toIndex),
        e.itemData,
        ...updatedItems.slice(e.toIndex),
      ];
      setItems(updatedItems);
    },
    [items],
  );
  const onDropFeedbackModeChanged = useCallback((e) => {
    setDropFeedbackMode(e.value);
  }, []);
  const onItemOrientationChanged = useCallback((e) => {
    setItemOrientation(e.value);
    setDragDirection('both');
  }, []);
  const onDragDirectionChanged = useCallback((e) => {
    setDragDirection(e.value);
  }, []);
  const onScrollSpeedChanged = useCallback((e) => {
    setScrollSpeed(e.value);
  }, []);
  const onScrollSensitivityChanged = useCallback((e) => {
    setScrollSensitivity(e.value);
  }, []);
  const onHandleChanged = useCallback((e) => {
    setHandle(e.value ? '.handle' : '');
  }, []);
  const onDragTemplateChanged = useCallback((e) => {
    setUseDragComponent(!!e.value);
    setCursorOffset(e.value ? { x: 10, y: 20 } : undefined);
  }, []);
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
            dragComponent={useDragComponent ? DragItem : undefined}
            cursorOffset={cursorOffset}
            onDragStart={onDragStart}
            onReorder={onReorder}
          >
            {items.map((item) => (
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
              itemOrientation === 'vertical' ? verticalDragDirections : horizontalDragDirections
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
          <CheckBox
            text="Use Handle"
            onValueChanged={onHandleChanged}
          />
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
