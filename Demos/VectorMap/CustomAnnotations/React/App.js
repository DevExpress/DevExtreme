import React from 'react';
import VectorMap, {
  Layer,
  CommonAnnotationSettings,
  Annotation,
} from 'devextreme-react/vector-map';

import * as mapsData from 'devextreme-dist/js/vectormap-data/usa.js';
import { statesData } from './data.js';
import AnnotationTemplate from './AnnotationTemplate.js';

const bounds = [-118, 55, -80, 23];

export default function App() {
  return (
    <VectorMap
      id="vector-map"
      bounds={bounds}>
      <Layer
        dataSource={mapsData.usa}
      >
      </Layer>
      <CommonAnnotationSettings
        type="custom"
        render={AnnotationTemplate}
      >
      </CommonAnnotationSettings>
      {statesData.map((state) => (
        <Annotation
          coordinates={state.coordinates}
          offsetX={state.offsetX}
          offsetY={state.offsetY}
          key={state.data.name}
          data={state.data}
        >
        </Annotation>
      ))
      }
    </VectorMap>
  );
}

