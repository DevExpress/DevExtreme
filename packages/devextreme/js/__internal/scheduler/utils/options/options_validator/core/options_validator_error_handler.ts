import type { GlobalErrorHandler, OptionsValidatorResult, ValidatorErrors } from './types';

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

    const uniqErrorCodes = Object.entries(optionsValidatorResult)
      .reduce((set, [validatorName, result]) => {
        const errorCode: string | undefined = this.validatorNameToErrorCodeMap[validatorName];

        if (errorCode) {
          const results = Object.values(result as ValidatorErrors);
          const lastArgs = results[results.length - 1];
          set.set(errorCode, typeof lastArgs === 'object' ? lastArgs.arguments : []);
        }

        return set;
      }, new Map<string, string[] | undefined>());

    const resultArray = [...uniqErrorCodes.entries()];
    resultArray.forEach((value, idx) => {
      const [errorCode, args = []] = value;
      const isLastErrorCode = idx === resultArray.length - 1;

      // NOTE: For stopping code stack execution and not creating
      // the special error code for this case,
      // we log all errors and throw the last one.
      if (!isLastErrorCode) {
        this.globalErrorHandler.logError(errorCode, ...args);
      } else {
        this.globalErrorHandler.throwError(errorCode, ...args);
      }
    });
  }
}
