import React, { useCallback, useRef } from 'react';
import {
  Chart,
  CommonSeriesSettings,
  Series,
  Legend,
  Title,
  Subtitle,
} from 'devextreme-react/chart';
import type { ChartRef } from 'devextreme-react/chart';
import { Button } from 'devextreme-react/button';
import { exportFromMarkup } from 'devextreme/viz/export';
import { Canvg } from 'canvg';
import { dataSource } from './data.ts';
import Form from './Form.tsx';

const barPadding = 0.3;

const prepareMarkup = (chartSVG: string, markup: string) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  svg.setAttribute('version', '1.1');
  svg.setAttribute('width', '820px');
  svg.setAttribute('height', '420px');
  svg.innerHTML = markup;

  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('transform', 'translate(305,12)');
  group.innerHTML = chartSVG;
  svg.appendChild(group);

  return svg;
};

function App() {
  const childRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartRef>(null);

  const onClick = useCallback(() => {
    exportFromMarkup(
      prepareMarkup(chartRef.current?.instance().svg() ?? '',
        childRef.current?.innerHTML ?? ''), {
        width: 820,
        height: 420,
        margin: 0,
        format: 'png',
        svgToCanvas(svg: Node, canvas: HTMLCanvasElement) {
          return new Promise((resolve): void => {
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              resolve(() => {});
              return;
            }

            const v = Canvg.fromString(
              ctx,
              new XMLSerializer().serializeToString(svg)
            );

            resolve(v.render());
          });
        },
      },
    );
  }, []);

  return (
    <div id="chart-demo">
      <div className="chart_environment">
        <Form ref={childRef} />
        <Chart
          ref={chartRef}
          id="chart"
          dataSource={dataSource}
          palette="Violet"
        >
          <CommonSeriesSettings barPadding={barPadding} argumentField="state" type="bar" />
          <Series valueField="year2000" name="2000" />
          <Series valueField="year2010" name="2010" />
          <Series valueField="year2020" name="2020" />
          <Series valueField="year2021" name="2021" />
          <Series valueField="year2022" name="2022" />
          <Legend verticalAlignment="bottom" horizontalAlignment="center" />
          <Title text="Oil Production">
            <Subtitle text="(in millions tonnes)" />
          </Title>
        </Chart>
      </div>
      <div className="controls-pane">
        <Button
          id="export"
          width={145}
          icon="export"
          text="Export"
          type="default"
          onClick={onClick}
        />
      </div>
    </div>
  );
}

export default App;
