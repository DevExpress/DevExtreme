import type {
  GlobalErrorHandler, OptionsValidatorResult, ValidatorErrors, ValidatorRuleResult,
} from './types';

interface LogData { errorCode: string; args: string[] }

const getValidatorErrorUniqueKey = (
  errorCode: string,
  validatorError: ValidatorRuleResult,
): string => {
  if (typeof validatorError === 'boolean' || !Array.isArray(validatorError.arguments)) {
    return errorCode;
  }

  return `${errorCode}${JSON.stringify(validatorError.arguments)}`;
};

const getValidatorErrorArguments = (
  validatorError: ValidatorRuleResult,
): string[] => (typeof validatorError === 'boolean' || !Array.isArray(validatorError.arguments)
  ? []
  : validatorError.arguments);

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

    const warningsMap = new Map<string, LogData>();
    const errorsMap = new Map<string, LogData>();

    Object.entries(optionsValidatorResult)
      .forEach(([validatorName, validatorErrorRecord]) => {
        const errorCode: string | undefined = this.validatorNameToErrorCodeMap[validatorName];

        if (!errorCode) {
          return;
        }

        const logMap = errorCode.startsWith('E')
          ? errorsMap
          : warningsMap;

        Object.values(validatorErrorRecord as ValidatorErrors)
          .forEach((validatorError) => {
            const uniqueKey = getValidatorErrorUniqueKey(errorCode, validatorError);
            const args = getValidatorErrorArguments(validatorError);
            logMap.set(uniqueKey, { errorCode, args });
          });
      });

    Array.from(warningsMap).forEach((value) => {
      const [, { errorCode, args }] = value;
      this.globalErrorHandler.logError(errorCode, ...args);
    });

    Array.from(errorsMap).forEach((value, idx) => {
      const [, { errorCode, args }] = value;
      const isLastErrorCode = idx === errorsMap.size - 1;

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
