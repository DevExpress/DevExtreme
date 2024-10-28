import devices from '@js/core/devices';
export const EditorStateProps = {
  hoverStateEnabled: true,
  activeStateEnabled: true,
  get focusStateEnabled() {
    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
  }
};
