import React, { useCallback, useState } from 'react';
import TreeMap, {
  Colorizer, Tooltip, ITreeMapOptions, ITooltipProps,
} from 'devextreme-react/tree-map';
import { TreeMapLayoutAlgorithm } from 'devextreme/viz/tree_map';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import { populationByAge, algorithmLabel } from './data.ts';

const algorithms: (TreeMapLayoutAlgorithm | 'custom')[] = ['sliceanddice', 'squarified', 'strip', 'custom'];

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[2]);
  const [
    currentAlgorithm,
    setCurrentAlgorithm,
  ] = useState<ITreeMapOptions['layoutAlgorithm']>(getCurrentAlgorithm(algorithms[2]));

  const setAlgorithm = useCallback((data: SelectBoxTypes.ValueChangedEvent) => {
    setSelectedAlgorithm(data.value);
    setCurrentAlgorithm(() => getCurrentAlgorithm(data.value));
  }, [setSelectedAlgorithm, setCurrentAlgorithm]);

  return (
    <React.Fragment>
      <TreeMap
        id="treemap"
        dataSource={populationByAge}
        layoutAlgorithm={currentAlgorithm}
        title="Population by Age Groups"
      >
        <Colorizer
          colorizeGroups={true}
          type="discrete"
        />
        <Tooltip
          enabled={true}
          customizeTooltip={customizeTooltip}
          format="thousands"
        />
      </TreeMap>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Tiling Algorithm </span>
          <SelectBox
            dataSource={algorithms}
            width={200}
            inputAttr={algorithmLabel}
            value={selectedAlgorithm}
            onValueChanged={setAlgorithm}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

const customAlgorithm: ITreeMapOptions['layoutAlgorithm'] = (arg) => {
  const totalRect = arg.rect.slice();
  let totalSum = arg.sum;
  let side = 0;

  arg.items.forEach((item) => {
    const size = Math.round(((totalRect[side + 2] - totalRect[side]) * item.value) / totalSum);
    const rect = totalRect.slice();

    totalSum -= item.value;
    totalRect[side] += size;
    rect[side + 2] = totalRect[side];
    item.rect = rect;
    side = 1 - side;
  });
};

function getCurrentAlgorithm(selectedAlgorithm: (TreeMapLayoutAlgorithm | 'custom')): ITreeMapOptions['layoutAlgorithm'] {
  let currentAlgorithm: ITreeMapOptions['layoutAlgorithm'] | 'custom' = selectedAlgorithm;
  if (currentAlgorithm === 'custom') {
    currentAlgorithm = customAlgorithm;
  }

  return currentAlgorithm;
}

const customizeTooltip: ITooltipProps['customizeTooltip'] = (arg) => {
  const { data } = arg.node;
  const parentData = arg.node.getParent().data;

  return {
    text: arg.node.isLeaf()
      ? `<span class='country'>${parentData.name}</span><br />${data.name}<br />${arg.valueText}(${((100 * data.value) / parentData.total).toFixed(1)}%)`
      : `<span class='country'>${data.name}</span>`,
  };
};

export default App;
