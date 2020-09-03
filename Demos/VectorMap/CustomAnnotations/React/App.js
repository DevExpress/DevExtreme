import React from 'react';
import VectorMap, {
  Layer,
  CommonAnnotationSettings,
  Annotation
} from 'devextreme-react/vector-map';

import * as mapsData from 'devextreme/dist/js/vectormap-data/usa.js';
import { statesData } from './data.js';
import AnnotationTemplate from './AnnotationTemplate.js';

const bounds = [-118, 55, -80, 23];

export default function App() {
  function customizeAnnotation(annotationItem) {
    if (annotationItem.data.name === 'Illinois') {
      annotationItem.offsetY = -80;
      annotationItem.offsetX = -100;
    }

    return annotationItem;
  }
  return (
    <VectorMap
      id="vector-map"
      bounds={bounds}
      customizeAnnotation={customizeAnnotation}>
      <Layer
        dataSource={mapsData.usa}
      >
      </Layer>
      <CommonAnnotationSettings
        type="custom"
        render={AnnotationTemplate}
      >
      </CommonAnnotationSettings>
      {statesData.map(state => {
        return (
          <Annotation
            coordinates={state.coordinates}
            key={state.data.name}
            data={state.data}
          >
          </Annotation>
        );
      })
      }
    </VectorMap>
  );
}

