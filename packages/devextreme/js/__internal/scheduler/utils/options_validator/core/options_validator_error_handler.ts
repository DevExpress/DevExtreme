import type {
  GlobalErrorHandler, OptionsValidatorResult, ValidatorErrors, ValidatorRuleError,
} from './types';

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
          results.forEach((item) => {
            const args = (item as ValidatorRuleError).arguments ?? [];
            const key = `${errorCode}${JSON.stringify(args)}`;
            set.set(key, {
              errorCode,
              args,
            });
          });
        }

        return set;
      }, new Map<string, {
        errorCode: string;
        args: string[];
      }>());

    const resultArray = [...uniqErrorCodes.entries()];
    const errors = resultArray.filter(([code]) => code.startsWith('E'));
    const warnings = resultArray.filter(([code]) => code.startsWith('W'));
    warnings.forEach((value) => {
      const [, { errorCode, args }] = value;
      this.globalErrorHandler.logError(errorCode, ...args);
    });
    errors.forEach((value, idx) => {
      const [, { errorCode, args }] = value;
      const isLastErrorCode = idx === errors.length - 1;

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
