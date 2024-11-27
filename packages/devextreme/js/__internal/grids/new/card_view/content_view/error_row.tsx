import { Toast } from '@ts/grids/new/grid_core/inferno_wrappers/toast';
import { createRef } from 'inferno';

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
  const ref = createRef<HTMLDivElement>();

  return (
    <div ref={ref} className={CLASSES.errorRow}>
      {props.errors.map((error) => (
        <Toast
          key={error}
          visible={true}
          message={error}
        />
      ))}
    </div>
  );
}
