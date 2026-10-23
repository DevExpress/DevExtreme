import React, { useCallback, useMemo, useState } from 'react';
import Chart, {
  CommonSeriesSettings,
  Series,
  Reduction,
  ArgumentAxis,
  Label,
  Format,
  ValueAxis,
  Title,
  ZoomAndPan,
  ScrollBar,
  Legend,
  Export,
  Tooltip,
} from 'devextreme-react/chart';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import { dataSource } from './data.js';

const dayMs = 24 * 60 * 60 * 1000;
const panStepFraction = 0.25;
const zoomFactor = 0.75;
const minVisibleSpanMs = 3 * dayMs;
const minVisualRangeLength = { days: 3 };
const initialStart = new Date(1994, 3, 14, 12);
const initialEnd = new Date(1994, 3, 29, 12);
const dataMin = dataSource[0].date.getTime();
const dataMax = dataSource[dataSource.length - 1].date.getTime();
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function getRange(range) {
  return {
    start: range.startValue.getTime(),
    end: range.endValue.getTime(),
  };
}
function customizeTooltip(arg) {
  if (!('openValue' in arg)) {
    return { text: '' };
  }
  return {
    text: `Open: $${arg.openValue}<br/>
    Close: $${arg.closeValue}<br/>
    High: $${arg.highValue}<br/>
    Low: $${arg.lowValue}<br/>`,
  };
}
function App() {
  const [visualRange, setVisualRange] = useState({
    startValue: initialStart,
    endValue: initialEnd,
  });
  const onVisualRangeChange = useCallback((range) => {
    setVisualRange(range);
  }, []);
  const setRange = useCallback((start, end) => {
    const span = clamp(end - start, minVisibleSpanMs, dataMax - dataMin);
    const center = (start + end) / 2;
    const newStart = clamp(center - span / 2, dataMin, dataMax - span);
    setVisualRange({
      startValue: new Date(newStart),
      endValue: new Date(newStart + span),
    });
  }, []);
  const pan = useCallback(
    (direction) => {
      const { start, end } = getRange(visualRange);
      const shift = (end - start) * panStepFraction * direction;
      setRange(start + shift, end + shift);
    },
    [visualRange, setRange],
  );
  const zoom = useCallback(
    (factor) => {
      const { start, end } = getRange(visualRange);
      const center = (start + end) / 2;
      const half = ((end - start) * factor) / 2;
      setRange(center - half, center + half);
    },
    [visualRange, setRange],
  );
  const resetZoom = useCallback(() => {
    setRange(initialStart.getTime(), initialEnd.getTime());
  }, [setRange]);
  const panLeftButtonOptions = useMemo(
    () => ({
      icon: 'chevronleft',
      hint: 'Pan Left',
      onClick: () => pan(-1),
    }),
    [pan],
  );
  const panRightButtonOptions = useMemo(
    () => ({
      icon: 'chevronright',
      hint: 'Pan Right',
      onClick: () => pan(1),
    }),
    [pan],
  );
  const zoomInButtonOptions = useMemo(
    () => ({
      icon: 'plus',
      hint: 'Zoom In',
      onClick: () => zoom(zoomFactor),
    }),
    [zoom],
  );
  const zoomOutButtonOptions = useMemo(
    () => ({
      icon: 'minus',
      hint: 'Zoom Out',
      onClick: () => zoom(1 / zoomFactor),
    }),
    [zoom],
  );
  const resetZoomButtonOptions = useMemo(
    () => ({
      icon: 'refresh',
      hint: 'Reset Zoom',
      onClick: resetZoom,
    }),
    [resetZoom],
  );
  return (
    <>
      <Toolbar>
        <Item
          location="after"
          widget="dxButton"
          options={panLeftButtonOptions}
        />
        <Item
          location="after"
          widget="dxButton"
          options={panRightButtonOptions}
        />
        <Item
          location="after"
          widget="dxButton"
          options={zoomInButtonOptions}
        />
        <Item
          location="after"
          widget="dxButton"
          options={zoomOutButtonOptions}
        />
        <Item
          location="after"
          widget="dxButton"
          options={resetZoomButtonOptions}
        />
      </Toolbar>
      <Chart
        id="chart"
        title="Stock Price"
        dataSource={dataSource}
      >
        <CommonSeriesSettings
          argumentField="date"
          type="stock"
        />
        <Series
          name="E-Mart"
          openValueField="o"
          highValueField="h"
          lowValueField="l"
          closeValueField="c"
        >
          <Reduction color="red" />
        </Series>
        <ZoomAndPan
          argumentAxis="both"
          dragToZoom={true}
          allowMouseWheel={true}
        />
        <ScrollBar
          visible={true}
          position="bottom"
        />
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
        />
        <ArgumentAxis
          visualRange={visualRange}
          onVisualRangeChange={onVisualRangeChange}
          minVisualRangeLength={minVisualRangeLength}
        >
          <Label
            format="MMM dd"
            overlappingBehavior="rotate"
            rotationAngle={30}
          />
        </ArgumentAxis>
        <ValueAxis
          tickInterval={1}
          position="right"
        >
          <Title text="US dollars" />
          <Label>
            <Format
              precision={0}
              type="currency"
            />
          </Label>
        </ValueAxis>
        <Export enabled={true} />
        <Tooltip
          enabled={true}
          customizeTooltip={customizeTooltip}
          location="edge"
        />
      </Chart>
    </>
  );
}
export default App;
