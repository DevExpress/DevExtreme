import devices from '@js/core/devices';

export interface EditorStateProps {
  hoverStateEnabled: boolean;

  activeStateEnabled: boolean;

  focusStateEnabled: boolean;
}

export const defaultEditorStateProps: EditorStateProps = {
  hoverStateEnabled: true,
  activeStateEnabled: true,
  focusStateEnabled: devices.real().deviceType === 'desktop' && !devices.isSimulator(),
};
