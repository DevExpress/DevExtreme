import React from 'react';
import ScrollView from 'devextreme-react/scroll-view';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import service from './data.js';

const showScrollBarModeLabel = { 'aria-label': 'Show Scrollbar Mode' };
let updateContentTimer;
const App = () => {
  const [showScrollBarMode, setShowScrollBarMode] = React.useState('onScroll');
  const [pullDown, setPullDown] = React.useState(false);
  const [scrollByContent, setScrollByContent] = React.useState(true);
  const [scrollByThumb, setScrollByThumb] = React.useState(true);
  const [content, setContent] = React.useState(service.getContent());
  const scrollViewRef = React.useRef(null);
  const updateContent = React.useCallback(
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
    [content, setContent],
  );
  const updateTopContent = React.useCallback(
    (args) => {
      updateContent(args, 'PullDown');
    },
    [updateContent],
  );
  const updateBottomContent = React.useCallback(
    (args) => {
      updateContent(args, 'ReachBottom');
    },
    [updateContent],
  );
  const pullDownValueChanged = React.useCallback(
    (args) => {
      setPullDown(args.value);
    },
    [setPullDown],
  );
  const reachBottomValueChanged = React.useCallback(
    (args) => {
      scrollViewRef.current.instance.option(
        'onReachBottom',
        args.value ? updateBottomContent : null,
      );
    },
    [updateBottomContent],
  );
  return (
    <div id="scrollview-demo">
      <ScrollView
        id="scrollview"
        ref={scrollViewRef}
        reachBottomText="Updating..."
        scrollByContent={scrollByContent}
        bounceEnabled={pullDown}
        onReachBottom={updateBottomContent}
        onPullDown={updateTopContent}
        showScrollbar={showScrollBarMode}
        scrollByThumb={scrollByThumb}
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
            defaultValue={true}
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
