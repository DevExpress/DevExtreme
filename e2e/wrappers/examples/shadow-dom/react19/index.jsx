import React, { useRef, useEffect, useState, useCallback } from 'react';
import root from 'react-shadow';
import * as StyleLoader from './styleLoader';
import { Button as DxButton } from 'devextreme-react/button';

export default function App() {
  const shadowRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (shadowRef.current) {
      StyleLoader.createShadowContainer(shadowRef.current, 'test-container');
      setReady(true);
    }
  }, []);

  return (
    <root.div className="shadow" ref={shadowRef} mode="open">
      <TestButton shadowRef={shadowRef} ready={ready} />
    </root.div>
  );
}


function TestButton({ shadowRef, ready }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = useCallback(() => {
    const newStyle = document.createElement('style');
    newStyle.textContent = `
      .dx-widget {
        color: blue !important;
      }
    `;
    document.head.appendChild(newStyle);

    StyleLoader.addShadowDomStyles($(shadowRef.current));

    setClicked(true);
  }, []);

  return (
    <div style={{ padding: 20, border: '2px solid blue', margin: '10px 0' }}>
        <h1>Shadow DOM test</h1>
        {ready && (
          <DxButton
            onClick={handleClick}
            container={shadowRef.current.shadowRoot}
            text="Click me!"
          />
        )}
        {clicked && <p className="result">Styles updated</p>}
      </div>
  )
}