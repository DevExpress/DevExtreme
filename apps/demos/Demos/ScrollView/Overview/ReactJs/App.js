import React, { useCallback, useRef, useState } from 'react';
import CheckBox from 'devextreme-react/check-box';
import ScrollView from 'devextreme-react/scroll-view';
import SelectBox from 'devextreme-react/select-box';
import service from './data.js';

const showScrollBarModeLabel = { 'aria-label': 'Show Scrollbar Mode' };
let updateContentTimer;
const App = () => {
  const [showScrollBarMode, setShowScrollBarMode] = useState('onScroll');
  const [pullDown, setPullDown] = useState(false);
  const [scrollByContent, setScrollByContent] = useState(true);
  const [scrollByThumb, setScrollByThumb] = useState(true);
  const [content, setContent] = useState(service.getContent());
  const [reachBottom, setReachBottom] = useState(true);
  const scrollViewRef = useRef(null);
  const updateContent = useCallback(
    (args, eventName) => {
      const updateContentText = `\n Content has been updated on the ${eventName} event.\n\n`;
      if (updateContentTimer) {
        clearTimeout(updateContentTimer);
      }
      updateContentTimer = setTimeout(() => {
        setContent(
          eventName === 'PullDown' ? updateContentText + content : content + updateContentText,
        );
        args.component.release(false);
      }, 500);
    },
    [content],
  );
  const updateTopContent = useCallback(
    (args) => {
      updateContent(args, 'PullDown');
    },
    [updateContent],
  );
  const updateBottomContent = useCallback(
    (args) => {
      updateContent(args, 'ReachBottom');
    },
    [updateContent],
  );
  const pullDownValueChanged = useCallback((args) => {
    setPullDown(args.value);
  }, []);
  const reachBottomValueChanged = useCallback((args) => {
    setReachBottom(args.value);
  }, []);
  return (
    <div id="scrollview-demo">
      <ScrollView
        id="scrollview"
        ref={scrollViewRef}
        reachBottomText="Updating..."
        scrollByContent={scrollByContent ?? undefined}
        bounceEnabled={!!pullDown}
        onReachBottom={reachBottom ? updateBottomContent : undefined}
        onPullDown={updateTopContent}
        showScrollbar={showScrollBarMode}
        scrollByThumb={scrollByThumb ?? undefined}
      >
        <div className="text-content">{content}</div>
      </ScrollView>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Show scrollbar: </span>
          <SelectBox
            items={showScrollbarModes}
            valueExpr="value"
            inputAttr={showScrollBarModeLabel}
            displayExpr="text"
            value={showScrollBarMode}
            onValueChange={setShowScrollBarMode}
          />
        </div>
        <div className="option">
          <CheckBox
            text="Update content on the ReachBottom event"
            value={reachBottom}
            onValueChanged={reachBottomValueChanged}
          />
        </div>
        <div className="option">
          <CheckBox
            text="Update content on the PullDown event"
            value={pullDown}
            onValueChanged={pullDownValueChanged}
          />
        </div>
        <div className="option">
          <CheckBox
            text="Scroll by content"
            value={scrollByContent}
            onValueChange={setScrollByContent}
          />
        </div>
        <div className="option">
          <CheckBox
            text="Scroll by thumb"
            value={scrollByThumb}
            onValueChange={setScrollByThumb}
          />
        </div>
      </div>
    </div>
  );
};
const showScrollbarModes = [
  {
    text: 'On Scroll',
    value: 'onScroll',
  },
  {
    text: 'On Hover',
    value: 'onHover',
  },
  {
    text: 'Always',
    value: 'always',
  },
  {
    text: 'Never',
    value: 'never',
  },
];
export default App;
