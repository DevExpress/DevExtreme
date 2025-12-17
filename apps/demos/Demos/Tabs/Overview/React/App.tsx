import React, { useCallback, useState } from 'react';
import Tabs from 'devextreme-react/tabs';
import SelectBox from 'devextreme-react/select-box';
import type { SelectBoxTypes } from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import type { CheckBoxTypes } from 'devextreme-react/check-box';
import type { Orientation, TabsIconPosition, TabsStyle } from 'devextreme/common';

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
} from './data.ts';

const STRICT_WIDTH_CLASS = 'strict-width';

interface OptionWrapperProps {
  caption?: string;
  children?: React.ReactNode;
}

function OptionWrapper({ caption, children }: OptionWrapperProps) {
  return (
    <div className="option">
      {caption && <span>{caption}</span>}
      {children}
    </div>
  );
}

const App = () => {
  const [orientation, setOrientation] = useState<Orientation>(orientations[0]);
  const [stylingMode, setStylingMode] = useState<TabsStyle>(stylingModes[1]);
  const [iconPosition, setIconPosition] = useState<TabsIconPosition>(iconPositions[0]);
  const [showNavigation, setShowNavigation] = useState<boolean>(false);
  const [scrollContent, setScrollContent] = useState<boolean>(false);
  const [fullWidth, setFullWidth] = useState<boolean>(false);
  const [width, setWidth] = useState<string>('auto');
  const [rtlEnabled, setRtlEnabled] = useState<boolean>(false);
  const [widgetWrapperClasses, setWidgetWrapperClasses] = useState<string>('widget-wrapper widget-wrapper-horizontal');

  const enforceWidthConstraint = useCallback(
    (shouldRestrictWidth: boolean): void => {
      const callback = (prevClasses: string): string => {
        const restClasses = prevClasses.split(' ').filter((className: string): boolean => className !== STRICT_WIDTH_CLASS).join(' ');
        const strictWidthClass = shouldRestrictWidth ? STRICT_WIDTH_CLASS : '';

        return `${restClasses} ${strictWidthClass}`;
      };

      setWidgetWrapperClasses(callback);
    }, [],
  );

  const stylingModeChanged = useCallback(({ value }: SelectBoxTypes.ValueChangedEvent): void => {
    setStylingMode(value);
  }, []);

  const iconPositionChanged = useCallback(({ value }: SelectBoxTypes.ValueChangedEvent): void => {
    setIconPosition(value);
  }, []);

  const orientationChanged = useCallback(({ value }: SelectBoxTypes.ValueChangedEvent): void => {
    const isVertical = value === 'vertical';

    const callback = (prevClasses: string): string => {
      const restClasses = prevClasses
        .split(' ')
        .filter((className) => (className !== (isVertical ? 'widget-wrapper-horizontal' : 'widget-wrapper-vertical')))
        .join(' ');

      return `${restClasses} widget-wrapper-${value}`;
    };

    setWidgetWrapperClasses(callback);

    setOrientation(value);
  }, []);

  const showNavigationChanged = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
    const shouldRestrictWidth = value || scrollContent;

    enforceWidthConstraint(shouldRestrictWidth);
    setShowNavigation(value);
  }, [scrollContent, enforceWidthConstraint]);

  const scrollContentChanged = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
    const shouldRestrictWidth = value || showNavigation;

    enforceWidthConstraint(shouldRestrictWidth);
    setScrollContent(value);
  }, [showNavigation, enforceWidthConstraint]);

  const fullWidthChanged = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
    setFullWidth(value);
    setWidth(value ? '100%' : 'auto');
  }, []);

  const rtlEnabledChanged = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
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

        <OptionWrapper caption='Orientation'>
          <SelectBox
            items={orientations}
            inputAttr={orientationLabel}
            value={orientation}
            onValueChanged={orientationChanged}
          />
        </OptionWrapper>

        <OptionWrapper caption='Styling mode'>
          <SelectBox
            items={stylingModes}
            inputAttr={stylingModeLabel}
            value={stylingMode}
            onValueChanged={stylingModeChanged}
          />
        </OptionWrapper>

        <OptionWrapper caption='Icon position'>
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
