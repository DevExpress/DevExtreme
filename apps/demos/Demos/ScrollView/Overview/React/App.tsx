import React, { useCallback, useRef, useState } from 'react';
import ScrollView, { ScrollViewTypes } from 'devextreme-react/scroll-view';
import SelectBox from 'devextreme-react/select-box';
import CheckBox, { CheckBoxTypes } from 'devextreme-react/check-box';
import service from './data.ts';

type UpdateContentArgs = ScrollViewTypes.PullDownEvent | ScrollViewTypes.ReachBottomEvent;
const showScrollBarModeLabel = { 'aria-label': 'Show Scrollbar Mode' };
let updateContentTimer;

const App = () => {
  const [showScrollBarMode, setShowScrollBarMode] = useState<ScrollViewTypes.Properties['showScrollbar']>('onScroll');
  const [pullDown, setPullDown] = useState(false);
  const [scrollByContent, setScrollByContent] = useState(true);
  const [scrollByThumb, setScrollByThumb] = useState(true);
  const [content, setContent] = useState(service.getContent());

  const scrollViewRef = useRef(null);

  const updateContent = useCallback((args: UpdateContentArgs, eventName: string) => {
    const updateContentText = `\n Content has been updated on the ${eventName} event.\n\n`;
    if (updateContentTimer) {
      clearTimeout(updateContentTimer);
    }
    updateContentTimer = setTimeout(() => {
      setContent(eventName === 'PullDown' ? updateContentText + content : content + updateContentText);
      args.component.release(false);
    }, 500);
  }, [content, setContent]);

  const updateTopContent = useCallback((args: ScrollViewTypes.PullDownEvent) => {
    updateContent(args, 'PullDown');
  }, [updateContent]);

  const updateBottomContent = useCallback((args: ScrollViewTypes.ReachBottomEvent) => {
    updateContent(args, 'ReachBottom');
  }, [updateContent]);

  const pullDownValueChanged = useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    setPullDown(args.value);
  }, [setPullDown]);

  const reachBottomValueChanged = useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    scrollViewRef.current.instance.option('onReachBottom', args.value ? updateBottomContent : null);
  }, [updateBottomContent]);

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
