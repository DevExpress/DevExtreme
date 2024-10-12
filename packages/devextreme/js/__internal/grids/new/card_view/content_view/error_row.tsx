import { Button } from '@ts/grids/new/grid_core/inferno_wrappers/button';

export const CLASSES = {
  errorRow: 'dx-gridcore-error-row',
  error: 'dx-gridcore-error-row-error',
  text: 'dx-gridcore-error-row-text',
  button: 'dx-gridcore-error-row-button',
};

export interface ErrorRowProperties {
  errors: string[];

  onRemoveButtonClicked?: (index: number) => void;
}

export function ErrorRow(props: ErrorRowProperties): JSX.Element {
  return (
    <div className={CLASSES.errorRow}>
      {props.errors.map((error, index) => (
        <div className={CLASSES.error}>
          <div className={CLASSES.text}>
            {error}
          </div>
          <Button
            icon='close'
            elementAttr={{ class: CLASSES.button }}
            onClick={(): void => { props.onRemoveButtonClicked?.(index); }}
          />
        </div>
      ))}
    </div>
  );
}
