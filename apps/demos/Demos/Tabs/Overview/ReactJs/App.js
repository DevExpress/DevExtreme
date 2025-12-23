import React, { useCallback, useState } from 'react';
import Tabs from 'devextreme-react/tabs';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import {
  orientations,
  tabsText,
  stylingModeLabel,
  iconPositionLabel,
  tabsIconAndText,
  stylingModes,
  iconPositions,
  tabsIcon,
  orientationLabel,
} from './data.js';

const STRICT_WIDTH_CLASS = 'strict-width';
function OptionWrapper({ caption, children }) {
  return (
    <div className="option">
      {caption && <span>{caption}</span>}
      {children}
    </div>
  );
}
const App = () => {
  const [orientation, setOrientation] = useState(orientations[0]);
  const [stylingMode, setStylingMode] = useState(stylingModes[1]);
  const [iconPosition, setIconPosition] = useState(iconPositions[0]);
  const [showNavigation, setShowNavigation] = useState(false);
  const [scrollContent, setScrollContent] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [width, setWidth] = useState('auto');
  const [rtlEnabled, setRtlEnabled] = useState(false);
  const [widgetWrapperClasses, setWidgetWrapperClasses] = useState(
    'widget-wrapper widget-wrapper-horizontal',
  );
  const enforceWidthConstraint = useCallback((shouldRestrictWidth) => {
    const callback = (prevClasses) => {
      const restClasses = prevClasses
        .split(' ')
        .filter((className) => className !== STRICT_WIDTH_CLASS)
        .join(' ');
      const strictWidthClass = shouldRestrictWidth ? STRICT_WIDTH_CLASS : '';
      return `${restClasses} ${strictWidthClass}`;
    };
    setWidgetWrapperClasses(callback);
  }, []);
  const stylingModeChanged = useCallback(({ value }) => {
    setStylingMode(value);
  }, []);
  const iconPositionChanged = useCallback(({ value }) => {
    setIconPosition(value);
  }, []);
  const orientationChanged = useCallback(({ value }) => {
    const isVertical = value === 'vertical';
    const callback = (prevClasses) => {
      const restClasses = prevClasses
        .split(' ')
        .filter(
          (className) =>
            className !== (isVertical ? 'widget-wrapper-horizontal' : 'widget-wrapper-vertical'),
        )
        .join(' ');
      return `${restClasses} widget-wrapper-${value}`;
    };
    setWidgetWrapperClasses(callback);
    setOrientation(value);
  }, []);
  const showNavigationChanged = useCallback(
    ({ value }) => {
      const shouldRestrictWidth = value || scrollContent;
      enforceWidthConstraint(shouldRestrictWidth);
      setShowNavigation(value);
    },
    [scrollContent, enforceWidthConstraint],
  );
  const scrollContentChanged = useCallback(
    ({ value }) => {
      const shouldRestrictWidth = value || showNavigation;
      enforceWidthConstraint(shouldRestrictWidth);
      setScrollContent(value);
    },
    [showNavigation, enforceWidthConstraint],
  );
  const fullWidthChanged = useCallback(({ value }) => {
    setFullWidth(value);
    setWidth(value ? '100%' : 'auto');
  }, []);
  const rtlEnabledChanged = useCallback(({ value }) => {
    setRtlEnabled(value);
  }, []);
  return (
    <div className="tabs-demo">
      <div className="widget-container">
        <div className={widgetWrapperClasses}>
          <Tabs
            id="withText"
            width={width}
            defaultSelectedIndex={0}
            rtlEnabled={rtlEnabled}
            dataSource={tabsText}
            scrollByContent={scrollContent}
            showNavButtons={showNavigation}
            orientation={orientation}
            stylingMode={stylingMode}
            iconPosition={iconPosition}
          />

          <Tabs
            id="withIconAndText"
            width={width}
            defaultSelectedIndex={0}
            rtlEnabled={rtlEnabled}
            dataSource={tabsIconAndText}
            scrollByContent={scrollContent}
            showNavButtons={showNavigation}
            orientation={orientation}
            stylingMode={stylingMode}
            iconPosition={iconPosition}
          />

          <Tabs
            id="withIcon"
            width={width}
            defaultSelectedIndex={0}
            rtlEnabled={rtlEnabled}
            dataSource={tabsIcon}
            scrollByContent={scrollContent}
            showNavButtons={showNavigation}
            orientation={orientation}
            stylingMode={stylingMode}
            iconPosition={iconPosition}
          />
        </div>
      </div>

      <div className="options">
        <div className="caption">Options</div>

        <OptionWrapper caption="Orientation">
          <SelectBox
            items={orientations}
            inputAttr={orientationLabel}
            value={orientation}
            onValueChanged={orientationChanged}
          />
        </OptionWrapper>

        <OptionWrapper caption="Styling mode">
          <SelectBox
            items={stylingModes}
            inputAttr={stylingModeLabel}
            value={stylingMode}
            onValueChanged={stylingModeChanged}
          />
        </OptionWrapper>

        <OptionWrapper caption="Icon position">
          <SelectBox
            items={iconPositions}
            inputAttr={iconPositionLabel}
            value={iconPosition}
            onValueChanged={iconPositionChanged}
          />
        </OptionWrapper>

        <div className="option">
          <CheckBox
            id="show-navigation-buttons"
            text="Show navigation buttons"
            value={showNavigation}
            onValueChanged={showNavigationChanged}
          />
        </div>

        <div className="option">
          <CheckBox
            text="Scroll content"
            value={scrollContent}
            onValueChanged={scrollContentChanged}
          />
        </div>

        <div className="option">
          <CheckBox
            text="Full width"
            value={fullWidth}
            onValueChanged={fullWidthChanged}
          />
        </div>

        <div className="option">
          <CheckBox
            text="Right-to-left mode"
            value={rtlEnabled}
            onValueChanged={rtlEnabledChanged}
          />
        </div>
      </div>
    </div>
  );
};
export default App;
