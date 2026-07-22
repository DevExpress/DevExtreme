import React, { useState, useCallback } from 'react';
import NumberBox from 'devextreme-react/number-box';

export default function PlanBProbe() {
  const [value, setValue] = useState(50);
  const [max, setMax] = useState(100);

  const onValueChanged = useCallback((e: any) => {
    // eslint-disable-next-line no-console
    console.log('%c[handler] onValueChanged', 'color:green', {
      value: e.value,
      previousValue: e.previousValue,
    });
    // controlled pattern
    setValue(e.value);
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <h3>NumberBox echo vs cascade</h3>
      <div>value={value} &nbsp; max={max}</div>

      <div style={{ marginTop: 12 }}>
        <NumberBox
          min={0}
          max={max}
          value={value}
          onValueChanged={onValueChanged}
        />
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button onClick={() => { console.log('%c--- ECHO: setValue(2) ---', 'font-weight:bold'); setValue(2); }}>
          echo: setValue(2)
        </button>

        <button onClick={() => { console.log('%c--- CASCADE: setMax(30) ---', 'font-weight:bold'); setMax(30); }}>
          cascade: setMax(30)
        </button>

        <button onClick={() => { console.log('%c--- reset ---', 'font-weight:bold'); setValue(50); setMax(100); }}>
          reset
        </button>
      </div>
    </div>
  );
}
