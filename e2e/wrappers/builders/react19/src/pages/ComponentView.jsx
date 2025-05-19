import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { findComponentByPath } from '../utils/componentFinder';

export default function ComponentView() {
  const { examplePath } = useParams();
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    const componentData = findComponentByPath(examplePath);

    componentData.component()
      .then(module => {
        setComponent(() => module.default);
      })
  }, [examplePath]);

  return (
    <div className="component-view">
       <Suspense fallback={<div>Loading...</div>}>
          {Component && <Component />}
        </Suspense>
    </div>
  );
} 