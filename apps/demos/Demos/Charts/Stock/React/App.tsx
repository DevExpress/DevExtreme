import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
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
  Tooltip,
} from 'devextreme-react/chart';
import type { ChartRef, ChartTypes } from 'devextreme-react/chart';
import type { VisualRange } from 'devextreme-react/common/charts';
import type { ButtonTypes } from 'devextreme-react/button';
import type { DropDownButtonTypes } from 'devextreme-react/drop-down-button';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import { formatDate } from 'devextreme/localization';
import 'devextreme/ui/drop_down_button';
import { dataSource } from './data.ts';

const dayMs = 24 * 60 * 60 * 1000;
const panStepFraction = 0.25;
const zoomFactor = 0.75;
const minVisualRangeLength = { days: 3 };
const minVisibleSpanMs = minVisualRangeLength.days * dayMs;
const tooltipFormat = { type: 'currency', precision: 2 } as const;
const exportFormats = ['PNG', 'PDF', 'JPEG', 'GIF', 'SVG'] as const;
const exportItems = [
  { text: 'Print' },
  ...exportFormats.map((format) => ({ text: `${format} file`, format })),
];

const initialEnd = new Date(1994, 3, 29, 12);

const dataMin = dataSource[0].date.getTime();
const dataMax = dataSource[dataSource.length - 1].date.getTime();
const rangeMin = dataMin - dayMs / 2;
const rangeMax = dataMax + dayMs / 2;
const initialStart = new Date(rangeMin);

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getRange(range: VisualRange) {
  return {
    start: (range.startValue as Date).getTime(),
    end: (range.endValue as Date).getTime(),
  };
}

function getNextRange(start: number, end: number): VisualRange {
  const span = clamp(end - start, minVisibleSpanMs, rangeMax - rangeMin);
  const center = (start + end) / 2;
  const newStart = clamp(center - span / 2, rangeMin, rangeMax - span);

  return {
    startValue: new Date(newStart),
    endValue: new Date(newStart + span),
  };
}

function customizeLabelText({ value }: { value?: Date | number | string }): string {
  const date = value as Date;
  const isMidnight = date.getHours() === 0 && date.getMinutes() === 0;

  return formatDate(date, isMidnight ? 'MMM dd' : 'shortTime');
}

function customizeTooltip(arg: ChartTypes.PointInfo): Record<string, string> {
  if (!('openValue' in arg)) {
    return { text: '' };
  }

  return {
    text: [
      `Open: ${arg.openValueText}`,
      `Close: ${arg.closeValueText}`,
      `High: ${arg.highValueText}`,
      `Low: ${arg.lowValueText}`,
    ].join('<br/>'),
  };
}

function App() {
  const chartRef = useRef<ChartRef>(null);

  const [visualRange, setVisualRange] = useState<VisualRange>({
    startValue: initialStart,
    endValue: initialEnd,
  });

  const onVisualRangeChange = useCallback((range: VisualRange | (Date | number | string)[]) => {
    setVisualRange(range as VisualRange);
  }, []);

  const pan = useCallback((direction: number) => {
    setVisualRange((range) => {
      const { start, end } = getRange(range);
      const shift = (end - start) * panStepFraction * direction;
      return getNextRange(start + shift, end + shift);
    });
  }, []);

  const zoom = useCallback((factor: number) => {
    setVisualRange((range) => {
      const { start, end } = getRange(range);
      const center = (start + end) / 2;
      const half = ((end - start) * factor) / 2;
      return getNextRange(center - half, center + half);
    });
  }, []);

  const resetZoom = useCallback(() => {
    setVisualRange(getNextRange(initialStart.getTime(), initialEnd.getTime()));
  }, []);

  const panLeftButtonOptions = useMemo<ButtonTypes.Properties>(() => ({
    icon: 'arrowleft',
    hint: 'Pan Left',
    elementAttr: { 'aria-label': 'Pan Left' },
    onClick: () => pan(-1),
  }), [pan]);

  const panRightButtonOptions = useMemo<ButtonTypes.Properties>(() => ({
    icon: 'arrowright',
    hint: 'Pan Right',
    elementAttr: { 'aria-label': 'Pan Right' },
    onClick: () => pan(1),
  }), [pan]);

  const zoomInButtonOptions = useMemo<ButtonTypes.Properties>(() => ({
    icon: 'zoominoutline',
    hint: 'Zoom In',
    elementAttr: { 'aria-label': 'Zoom In' },
    onClick: () => zoom(zoomFactor),
  }), [zoom]);

  const zoomOutButtonOptions = useMemo<ButtonTypes.Properties>(() => ({
    icon: 'zoomoutoutline',
    hint: 'Zoom Out',
    elementAttr: { 'aria-label': 'Zoom Out' },
    onClick: () => zoom(1 / zoomFactor),
  }), [zoom]);

  const resetZoomButtonOptions = useMemo<ButtonTypes.Properties>(() => ({
    icon: 'refresh',
    hint: 'Reset Zoom',
    elementAttr: { 'aria-label': 'Reset Zoom' },
    onClick: resetZoom,
  }), [resetZoom]);

  const exportButtonOptions = useMemo<DropDownButtonTypes.Properties>(() => ({
    icon: 'export',
    hint: 'Exporting/Printing',
    elementAttr: { 'aria-label': 'Exporting/Printing' },
    stylingMode: 'text',
    useSelectMode: false,
    dropDownOptions: { width: 100 },
    displayExpr: 'text',
    items: exportItems,
    onItemClick: ({ itemData }) => {
      if (itemData.format) {
        chartRef.current?.instance().exportTo('file', itemData.format);
      } else {
        chartRef.current?.instance().print();
      }
    },
  }), []);

  return (
    <>
      <Toolbar>
        <Item location="before" text="Stock Price" cssClass="chart-title" />
        <Item location="after" widget="dxButton" options={panLeftButtonOptions} />
        <Item location="after" widget="dxButton" options={panRightButtonOptions} />
        <Item location="after" widget="dxButton" options={zoomOutButtonOptions} />
        <Item location="after" widget="dxButton" options={zoomInButtonOptions} />
        <Item location="after" widget="dxButton" options={resetZoomButtonOptions} />
        <Item location="after" widget="dxDropDownButton" options={exportButtonOptions} />
      </Toolbar>
      <Chart
        id="chart"
        ref={chartRef}
        dataSource={dataSource}
        resizePanesOnZoom={true}
      >
        <CommonSeriesSettings argumentField="date" type="stock" />
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
        <ScrollBar visible={true} position="bottom" />
        <Legend verticalAlignment="bottom" horizontalAlignment="center" />
        <ArgumentAxis
          visualRange={visualRange}
          onVisualRangeChange={onVisualRangeChange}
          minVisualRangeLength={minVisualRangeLength}
        >
          <Label
            overlappingBehavior="rotate"
            rotationAngle={30}
            customizeText={customizeLabelText}
          />
        </ArgumentAxis>
        <ValueAxis tickInterval={1} position="right">
          <Title text="US dollars" />
          <Label>
            <Format precision={0} type="currency" />
          </Label>
        </ValueAxis>
        <Tooltip
          enabled={true}
          format={tooltipFormat}
          customizeTooltip={customizeTooltip}
          location="edge"
        />
      </Chart>
    </>
  );
}

export default App;
