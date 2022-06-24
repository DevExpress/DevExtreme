import { renderTemplate } from '@devextreme/runtime/declarations';

// This is WA for templates in nested components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// istanbul ignore next: should be tested in React infrastructure
export const getRenderEditorTemplate = (
  editorTemplate: JSX.Element,
) => (item: unknown, container: unknown): void => {
  renderTemplate(
    () => editorTemplate,
    {
      item,
      container,
    },
    null,
  );
};
