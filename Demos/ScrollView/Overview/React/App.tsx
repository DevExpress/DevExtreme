import React from 'react';
import ScrollView, { ScrollViewTypes } from 'devextreme-react/scroll-view';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import CheckBox, { CheckBoxTypes } from 'devextreme-react/check-box';
import service from './data.ts';

type UpdateContentArgs = ScrollViewTypes.PullDownEvent | ScrollViewTypes.ReachBottomEvent;
const showScrollBarModeLabel = { 'aria-label': 'Show Scrollbar Mode' };
let updateContentTimer;

const App = () => {
  const [showScrollBarMode, setShowScrollBarMode] = React.useState<ScrollViewTypes.Properties['showScrollbar']>('onScroll');
  const [pullDown, setPullDown] = React.useState(false);
  const [scrollByContent, setScrollByContent] = React.useState(true);
  const [scrollByThumb, setScrollByThumb] = React.useState(true);
  const [content, setContent] = React.useState(service.getContent());

  const scrollViewRef = React.useRef(null);

  const getInstance = (ref: { instance: any; }) => {
    scrollViewRef.current = ref.instance;
  };

  const updateContent = React.useCallback((args: UpdateContentArgs, eventName: string) => {
    const updateContentText = `\n Content has been updated on the ${eventName} event.\n\n`;
    if (updateContentTimer) {
      clearTimeout(updateContentTimer);
    }
    updateContentTimer = setTimeout(() => {
      setContent(eventName === 'PullDown' ? updateContentText + content : content + updateContentText);
      args.component.release(false);
    }, 500);
  }, [content, setContent]);

  const updateTopContent = React.useCallback((args: ScrollViewTypes.PullDownEvent) => {
    updateContent(args, 'PullDown');
  }, [updateContent]);

  const updateBottomContent = React.useCallback((args: ScrollViewTypes.ReachBottomEvent) => {
    updateContent(args, 'ReachBottom');
  }, [updateContent]);

  const pullDownValueChanged = React.useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    setPullDown(args.value);
  }, [setPullDown]);

  const reachBottomValueChanged = React.useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    scrollViewRef.current.option('onReachBottom', args.value ? updateBottomContent : null);
  }, [updateBottomContent]);

  const scrollbarModelValueChanged = React.useCallback((args: SelectBoxTypes.ValueChangedEvent) => {
    setShowScrollBarMode(args.value);
  }, [setShowScrollBarMode]);

  const scrollByContentValueChanged = React.useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    setScrollByContent(args.value);
  }, [setScrollByContent]);

  const scrollByThumbValueChanged = React.useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    setScrollByThumb(args.value);
  }, [setScrollByThumb]);

  return (
    <div id="scrollview-demo">
      <ScrollView
        id="scrollview"
        ref={getInstance}
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
            onValueChanged={scrollbarModelValueChanged}
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
            onValueChanged={scrollByContentValueChanged}
          />
        </div>
        <div className="option">
          <CheckBox
            text="Scroll by thumb"
            value={scrollByThumb}
            onValueChanged={scrollByThumbValueChanged}
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
