import React, { useState, useRef, useCallback } from 'react';
import DataGrid, { Selection } from 'devextreme-react/data-grid';

const FIRE_CAP = 40;

const rows = [
  { id: 1, name: 'One' },
  { id: 2, name: 'Two' },
  { id: 3, name: 'Three' },
];

export default function PlanBSelectionProbe() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([1]);
  const [renders, setRenders] = useState(0);
  const fireCount = useRef(0);
  const frozen = useRef(false);

  // count renders (StrictMode double-invokes in dev; relative growth is what matters)
  React.useEffect(() => { setRenders((r) => r + 1); }, [selectedRowKeys]);

  const onSelectionChanged = useCallback((e: any) => {
    fireCount.current += 1;
    // eslint-disable-next-line no-console
    console.log('%c[handler] onSelectionChanged', 'color:green', {
      fire: fireCount.current,
      selectedRowKeys: e.selectedRowKeys,
    });

    if (fireCount.current >= FIRE_CAP) {
      if (!frozen.current) {
        frozen.current = true;
        // eslint-disable-next-line no-console
        console.error(`LOOP DETECTED — onSelectionChanged fired ${FIRE_CAP}+ times. Stopping.`);
      }
      return;
    }
    setSelectedRowKeys([...e.selectedRowKeys]);
  }, []);

  const reset = () => {
    fireCount.current = 0;
    frozen.current = false;
    setSelectedRowKeys([1]);
  };

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <h3>Controlled selectedRowKeys loop test</h3>
      <div>
        selectedRowKeys={JSON.stringify(selectedRowKeys)} &nbsp;|&nbsp;
        onSelectionChanged fires: {fireCount.current} &nbsp;|&nbsp; renders: {renders}
      </div>

      <div style={{ marginTop: 12, maxWidth: 500 }}>
        <DataGrid
          dataSource={rows}
          keyExpr="id"
          selectedRowKeys={selectedRowKeys}
          onSelectionChanged={onSelectionChanged}
        >
          <Selection mode="multiple" />
        </DataGrid>
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button onClick={() => { 
          console.log('%c--- programmatic select [2] ---', 'font-weight:bold');
          fireCount.current = 0;
          frozen.current = false;
          setSelectedRowKeys([2]); 
        }}>
          programmatic: select [2]
        </button>
        <button onClick={reset}>reset (clear counter)</button>
      </div>
    </div>
  );
}
