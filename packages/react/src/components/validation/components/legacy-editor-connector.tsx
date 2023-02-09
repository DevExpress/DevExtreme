import { DefaultAdapter } from '@devextreme/interim';
import $ from '@devextreme/interim/src/core/renderer';
import { useEffect, useRef } from 'react';
import { ValidatorImpl } from '../types';

let renderer = $;

interface LegacyEditorConnectorProps {
  validator: ValidatorImpl,
  setEditorAdapter: (adapter: DefaultAdapter) => void
}
// eslint-disable-next-line import/exports-last
export function LegacyEditorConnector({ validator, setEditorAdapter }: LegacyEditorConnectorProps) {
  const domAccessor = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const legacyEditor = (renderer(domAccessor.current?.parentNode as Element) as any).data('dx-validation-target');
    const editorAdapter = new DefaultAdapter(legacyEditor, validator);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editorAdapter.getName = () => (legacyEditor as any).option('name');
    setEditorAdapter(editorAdapter);
  });

  return <span ref={domAccessor} style={{ display: 'none' }} />;
}

LegacyEditorConnector.setRenderer = (newRenderer: typeof $) => {
  renderer = newRenderer;
};
