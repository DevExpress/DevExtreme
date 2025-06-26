import Widget from '@js/ui/widget/ui.widget';
import { extend } from '@ts/core/utils/m_extend';

import {
  DEFAULT_SCHEDULER_INTEGRATION_OPTIONS,
  DEFAULT_SCHEDULER_INTERNAL_OPTIONS,
  DEFAULT_SCHEDULER_OPTIONS,
  DEFAULT_SCHEDULER_OPTIONS_RULES,
  DEPRECATED_SCHEDULER_OPTIONS,
} from './constants';
import { SchedulerOptionsValidator, SchedulerOptionsValidatorErrorsHandler } from './options_validator';
import type {
  DateOption, NormalizedView, SafeSchedulerOptions, SchedulerOptionsRule, View,
} from './types';
import {
  getCurrentView, getViews, parseCurrentDate, parseDateOption,
} from './utils';

const isDateOption = (
  optionName: string,
): optionName is DateOption => ['currentDate', 'min', 'max'].includes(optionName);

export class SchedulerBaseWidgetOptions extends Widget<SafeSchedulerOptions> {
  protected views: NormalizedView[] = [];

  public currentView!: NormalizedView;

  private _optionsValidator!: SchedulerOptionsValidator;

  private _optionsValidatorErrorHandler!: SchedulerOptionsValidatorErrorsHandler;

  _init(): void {
    // @ts-expect-error
    super._init();
    this._updateViews();
    this._optionsValidator = new SchedulerOptionsValidator();
    this._optionsValidatorErrorHandler = new SchedulerOptionsValidatorErrorsHandler();
  }

  _getDefaultOptions(): SafeSchedulerOptions {
    // @ts-expect-error
    const options = super._getDefaultOptions();

    return {
      ...options,
      ...DEFAULT_SCHEDULER_OPTIONS,
      ...DEFAULT_SCHEDULER_INTERNAL_OPTIONS,
      integrationOptions: {
        ...options.integrationOptions,
        ...DEFAULT_SCHEDULER_INTEGRATION_OPTIONS.integrationOptions,
      },
    } as SafeSchedulerOptions;
  }

  _setDeprecatedOptions(): void {
    // @ts-expect-error
    super._setDeprecatedOptions();

    // @ts-expect-error
    extend(this._deprecatedOptions, DEPRECATED_SCHEDULER_OPTIONS);
  }

  _defaultOptionsRules(): SchedulerOptionsRule[] {
    // @ts-expect-error
    const rules: SchedulerOptionsRule[] = super._defaultOptionsRules();

    return rules.concat(DEFAULT_SCHEDULER_OPTIONS_RULES);
  }

  _updateViews(): void {
    this.views = getViews(this.option('views') ?? []);
    this.currentView = getCurrentView(
      this.option('currentView') ?? '',
      this.option('views') ?? [],
    );
  }

  _schedulerOptionChanged<K extends keyof SafeSchedulerOptions>(args: {
    name: K;
    value: SafeSchedulerOptions[K];
  }): void {
    this.validateOptions();
    switch (args.name) {
      case 'currentView':
      case 'views':
        this._updateViews();
        break;
      default:
    }
  }

  private validateOptions(): void {
    const currentViewOptions = {
      ...this.option(),
      // NOTE: We override this.option values here
      // because the old validation logic checked only current view options.
      // Changing it and validate all views configuration will be a BC.
      startDayHour: this.getViewOption('startDayHour'),
      endDayHour: this.getViewOption('endDayHour'),
      offset: this.getViewOption('offset'),
      cellDuration: this.getViewOption('cellDuration'),
    };
    const validationResult = this._optionsValidator.validate(currentViewOptions);
    this._optionsValidatorErrorHandler.handleValidationResult(validationResult);
  }

  getViewOption<K extends keyof SafeSchedulerOptions>(optionName: K): SafeSchedulerOptions[K] {
    if (optionName === 'currentDate') {
      const currentDate = parseCurrentDate(this.option('currentDate'));
      return currentDate as SafeSchedulerOptions[K];
    }

    const viewOptionValue = this.currentView?.[optionName as keyof View];
    const optionValue = (viewOptionValue ?? this.option(optionName)) as SafeSchedulerOptions[K];

    if (isDateOption(optionName)) {
      const dateValue = optionValue as SafeSchedulerOptions[DateOption];
      return parseDateOption(dateValue) as SafeSchedulerOptions[K];
    }

    return optionValue;
  }

  hasAgendaView(): boolean {
    return this.views.some(
      (view) => view.type === 'agenda' || view.name === 'agenda',
    );
  }
}
