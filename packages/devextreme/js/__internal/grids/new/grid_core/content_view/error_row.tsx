/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type dxToast from '@js/ui/toast';
import { Toast } from '@ts/grids/new/grid_core/inferno_wrappers/toast';
import { Component, createRef } from 'inferno';

import type { GridError } from '../error_controller/error_controller';

export const CLASSES = {
  errorRow: 'dx-gridcore-error-row',
};

export interface ErrorRowProperties {
  errors: GridError[];

  enabled: boolean;

  onRemoveButtonClicked?: (index: number) => void;
}

export class ErrorRow extends Component<ErrorRowProperties> {
  private readonly ref = createRef<HTMLDivElement>();

  private readonly toastRef = createRef<dxToast>();

  public render(): JSX.Element {
    const lastError = this.props.errors.at(-1);

    return (
      <div ref={this.ref} className={CLASSES.errorRow}>
        {this.props.enabled && lastError && (
          <Toast
            componentRef={this.toastRef}
            key={lastError.id}
            visible={true}
            message={lastError.text}
            type={'error'}
          />
        )}
      </div>
    );
  }

  public componentDidUpdate(): void {
    this.toastRef.current?.option('position', {
      my: 'bottom',
      at: 'bottom',
      of: this.ref.current!,
    });
  }
}
