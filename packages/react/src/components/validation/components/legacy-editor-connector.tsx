import { DefaultAdapter } from '@devextreme/interim';
import $ from '@devextreme/interim/src/core/renderer';
import { useContext, useEffect, useRef } from 'react';
import { EditorContext } from '../../common/index';
import { ValidatorImpl } from '../types';

let renderer = $;

interface LegacyEditorConnectorProps {
  validator: ValidatorImpl,
  setEditorAdapter: (adapter: DefaultAdapter) => void
}
// eslint-disable-next-line import/exports-last
export function LegacyEditorConnector({ validator, setEditorAdapter }: LegacyEditorConnectorProps) {
  const domAccessor = useRef<HTMLSpanElement>(null);
  const editorContext = useContext(EditorContext);
  useEffect(() => {
    if (!editorContext) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const legacyEditor = (renderer(domAccessor.current?.parentNode as any).data as any)('dx-validation-target');
      const editorAdapter = new DefaultAdapter(legacyEditor, validator);
      editorAdapter.getName = () => legacyEditor.option('name');
      setEditorAdapter(editorAdapter);
    }
  });

  return editorContext
    ? null
    : <span ref={domAccessor} style={{ display: 'none' }} />;
}

LegacyEditorConnector.setRenderer = (newRenderer: typeof $) => {
  renderer = newRenderer;
};
