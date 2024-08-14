import devices from '../../../../core/devices';

export interface EditorStateProps {
  hoverStateEnabled?: boolean;
  activeStateEnabled?: boolean;
  focusStateEnabled?: boolean;
}

export const EditorStateDefaultProps: EditorStateProps = {
  hoverStateEnabled: true,
  activeStateEnabled: true,
  focusStateEnabled: devices.real().deviceType === 'desktop' && !devices.isSimulator(),
};
