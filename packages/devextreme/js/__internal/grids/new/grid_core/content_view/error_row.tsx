import type dxToast from '@js/ui/toast';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';
import { Toast } from '@ts/grids/new/grid_core/inferno_wrappers/toast';
import { createRef } from 'inferno';

import type { GridError } from '../error_controller/error_controller';
import { wrapRef } from '../inferno_wrappers/utils';

export const CLASSES = {
  errorRow: 'dx-gridcore-error-row',
};

export interface ErrorRowProperties {
  errors: GridError[];

  enabled: boolean;
}

export class ErrorRow extends BaseInfernoComponent<ErrorRowProperties> {
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
            position={{
              my: 'bottom',
              at: 'bottom',
              // @ts-expect-error
              of: wrapRef(this.ref),
            }}
          />
        )}
      </div>
    );
  }
}
