import React, { useCallback, useState } from 'react';
import {
  Chart,
  Series,
  Legend,
  ValueAxis,
  ChartTypes,
} from 'devextreme-react/chart';
import { Button } from 'devextreme-react/button';
import service from './data.ts';

const colors = ['#6babac', '#e55253'];

function App() {
  const [isFirstLevel, setIsFirstLevel] = useState(true);
  const [data, setData] = useState(service.filterData(''));

  const customizePoint = useCallback((): {
    color: string,
    hoverStyle?: {
      color?: string,
      hatching?: string
    }
  } => ({
    color: colors[Number(isFirstLevel)],
    hoverStyle: !isFirstLevel ? {
      hatching: 'none',
    } : {},
  }), [isFirstLevel]);

  const onPointClick = useCallback((e: ChartTypes.PointClickEvent) => {
    if (isFirstLevel) {
      setIsFirstLevel(false);
      setData(service.filterData(e.target.originalArgument.toString()));
    }
  }, [isFirstLevel, setData, setIsFirstLevel]);

  const onButtonClick = useCallback(() => {
    if (!isFirstLevel) {
      setIsFirstLevel(true);
      setData(service.filterData(''));
    }
  }, [isFirstLevel, setData, setIsFirstLevel]);

  return (
    <div>
      <Chart
        id="chart"
        title="The Most Populated Countries by Continents"
        customizePoint={customizePoint}
        onPointClick={onPointClick}
        className={isFirstLevel ? 'pointer-on-bars' : ''}
        dataSource={data}
      >
        <Series type="bar" />
        <ValueAxis showZero={false} />
        <Legend visible={false} />
      </Chart>
      <Button className="button-container"
        text="Back"
        icon="chevronleft"
        visible={!isFirstLevel}
        onClick={onButtonClick}
      />
    </div>
  );
}

export default App;
