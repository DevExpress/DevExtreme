import type * as dxButton from '@js/ui/button';
import { current, isFluent } from '@js/ui/themes';
import type * as dxToolbar from '@js/ui/toolbar';

export function getSaveButtonConfig(props: {
  onSave: () => void;
  text: string;
}): dxToolbar.Item {
  const config = {
    toolbar: 'bottom',
    location: 'after' as const,
    widget: 'dxButton' as const,
    options: {
      text: props.text,
      onClick: props.onSave,
    } as dxButton.Properties,
  };

  if (isFluent(current())) {
    config.options.stylingMode = 'contained';
    config.options.type = 'default';
  }

  return config;
}

export function getCancelButtonConfig(props: {
  onCancel: () => void;
  text: string;
}): dxToolbar.Item {
  const config = {
    toolbar: 'bottom',
    location: 'after' as const,
    widget: 'dxButton' as const,
    options: {
      text: props.text,
      onClick: props.onCancel,
    } as dxButton.Properties,
  };

  if (isFluent(current())) {
    config.options.stylingMode = 'outlined';
  }

  return config;
}
