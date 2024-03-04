import type { GlobalErrorHandler, OptionsValidatorResult } from './types';

export abstract class OptionsValidatorErrorHandler<TValidators extends string> {
  protected constructor(
    private readonly validatorNameToErrorCodeMap: Partial<Record<TValidators, string>>,
    private readonly globalErrorHandler: GlobalErrorHandler,
  ) {}

  handleValidationResult(
    optionsValidatorResult: OptionsValidatorResult<TValidators>,
  ): void {
    if (optionsValidatorResult === true) {
      return;
    }

    const uniqErrorCodes = (Object.keys(optionsValidatorResult) as TValidators[])
      .reduce((set, validatorName) => {
        const errorCode: string | undefined = this.validatorNameToErrorCodeMap[validatorName];

        if (errorCode) {
          set.add(errorCode);
        }

        return set;
      }, new Set<string>());

    const errorCodeArray = [...uniqErrorCodes];
    errorCodeArray.forEach((errorCode, idx) => {
      const isLastErrorCode = idx === errorCodeArray.length - 1;

      // NOTE: For stopping code stack execution and not creating
      // the special error code for this case,
      // we log all errors and throw the last one.
      if (!isLastErrorCode) {
        this.globalErrorHandler.logError(errorCode);
      } else {
        this.globalErrorHandler.throwError(errorCode);
      }
    });
  }
}
