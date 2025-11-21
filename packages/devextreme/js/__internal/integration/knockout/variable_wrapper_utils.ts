import { variableWrapper } from '@ts/core/utils/m_variable_wrapper';
// eslint-disable-next-line import/no-extraneous-dependencies
import ko from 'knockout';

if (ko) {
  variableWrapper.inject({
    isWrapped: ko.isObservable,
    isWritableWrapped: ko.isWritableObservable,
    wrap: ko.observable,
    unwrap(value) {
      if (ko.isObservable(value)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return ko.utils.unwrapObservable(value);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.callBase(value);
    },
    assign(variable, value) {
      if (ko.isObservable(variable)) {
        variable(value);
      } else {
        this.callBase(variable, value);
      }
    },
  });
}
