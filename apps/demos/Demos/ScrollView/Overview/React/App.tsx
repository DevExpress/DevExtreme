import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';

import CheckBox from 'devextreme-react/check-box';
import type { CheckBoxTypes } from 'devextreme-react/check-box';
import ScrollView from 'devextreme-react/scroll-view';
import type { ScrollViewRef, ScrollViewTypes } from 'devextreme-react/scroll-view';
import SelectBox from 'devextreme-react/select-box';

import service from './data.ts';

type UpdateContentArgs = ScrollViewTypes.PullDownEvent | ScrollViewTypes.ReachBottomEvent;
type CheckBoxValue = CheckBoxTypes.Properties['value'];

const showScrollBarModeLabel = { 'aria-label': 'Show Scrollbar Mode' };
let updateContentTimer: ReturnType<typeof setTimeout>;

const App = () => {
  const [showScrollBarMode, setShowScrollBarMode] = useState<ScrollViewTypes.Properties['showScrollbar']>('onScroll');
  const [useNative, setUseNative] = useState<CheckBoxValue>(false);
  const [pullDown, setPullDown] = useState<CheckBoxValue>(false);
  const [scrollByContent, setScrollByContent] = useState<CheckBoxValue>(true);
  const [scrollByThumb, setScrollByThumb] = useState<CheckBoxValue>(true);
  const [content, setContent] = useState<string>(service.getContent());
  const [reachBottom, setReachBottom] = useState<CheckBoxValue>(true);

  const scrollViewRef = useRef<ScrollViewRef>(null);

  const updateContent = useCallback((args: UpdateContentArgs, eventName: string) => {
    const updateContentText = `\n Content has been updated on the ${eventName} event.\n\n`;
    if (updateContentTimer) {
      clearTimeout(updateContentTimer);
    }
    updateContentTimer = setTimeout(() => {
      setContent(eventName === 'PullDown' ? updateContentText + content : content + updateContentText);
      args.component.release(false);
    }, 500);
  }, [content]);

  const updateTopContent = useCallback((args: ScrollViewTypes.PullDownEvent) => {
    updateContent(args, 'PullDown');
  }, [updateContent]);

  const updateBottomContent = useCallback((args: ScrollViewTypes.ReachBottomEvent) => {
    updateContent(args, 'ReachBottom');
  }, [updateContent]);

  useEffect(() => {
    setUseNative(scrollViewRef.current?.instance().option('useNative'));
  }, []);

  const useNativeValueChanged = useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    setUseNative(args.value);
    scrollViewRef.current?.instance().option('useNative', args.value);
    if (args.value) {
      setShowScrollBarMode((mode) => (mode === 'never' ? 'onScroll' : mode));
    }
  }, []);

  const pullDownValueChanged = useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    setPullDown(args.value);
  }, []);

  const reachBottomValueChanged = useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    setReachBottom(args.value);
  }, []);

  return (
    <div id="scrollview-demo">
      <ScrollView
        id="scrollview"
        ref={scrollViewRef}
        reachBottomText="Updating..."
        scrollByContent={!!scrollByContent}
        bounceEnabled={!!pullDown}
        onReachBottom={reachBottom ? updateBottomContent : undefined}
        onPullDown={updateTopContent}
        showScrollbar={showScrollBarMode}
        scrollByThumb={!!scrollByThumb}
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
            disabled={!!useNative}
            onValueChange={setShowScrollBarMode}
          />
        </div>
        <div className="option">
          <CheckBox
            text="Use browser scrolling logic"
            value={useNative}
            onValueChanged={useNativeValueChanged}
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
            disabled={!!useNative}
            onValueChange={setScrollByContent}
          />
        </div>
        <div className="option">
          <CheckBox
            text="Scroll by thumb"
            value={scrollByThumb}
            disabled={!!useNative}
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
