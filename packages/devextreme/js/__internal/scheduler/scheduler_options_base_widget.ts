import Widget from '@js/ui/widget/ui.widget';
import { extend } from '@ts/core/utils/m_extend';

import {
  DEFAULT_SCHEDULER_INTEGRATION_OPTIONS,
  DEFAULT_SCHEDULER_INTERNAL_OPTIONS,
  DEFAULT_SCHEDULER_OPTIONS,
  DEFAULT_SCHEDULER_OPTIONS_RULES,
} from './utils/options/constants';
import { DEFAULT_VIEW_OPTIONS } from './utils/options/constants_view';
import { resolveSkippedDays } from './utils/options/normalize_hidden_days';
import type {
  NormalizedView, SafeSchedulerOptions, SchedulerOptionsRule, View,
} from './utils/options/types';
import { getCurrentView, getViewOption, getViews } from './utils/options/utils';
import { SchedulerOptionsValidator, SchedulerOptionsValidatorErrorsHandler } from './utils/options_validator/index';
import timeZoneUtils from './utils_time_zone';

export class SchedulerOptionsBaseWidget extends Widget<SafeSchedulerOptions> {
  protected views: NormalizedView[] = [];

  public currentView!: NormalizedView;

  private optionsValidator!: SchedulerOptionsValidator;

  private optionsValidatorErrorHandler!: SchedulerOptionsValidatorErrorsHandler;

  protected _init(): void {
    // @ts-expect-error
    super._init();
    this.optionsValidator = new SchedulerOptionsValidator();
    this.optionsValidatorErrorHandler = new SchedulerOptionsValidatorErrorsHandler();
  }

  protected _getDefaultOptions(): SafeSchedulerOptions {
    // @ts-expect-error
    const options = super._getDefaultOptions();

    return extend(true, options, {
      ...DEFAULT_SCHEDULER_OPTIONS,
      ...DEFAULT_SCHEDULER_INTERNAL_OPTIONS,
      ...DEFAULT_SCHEDULER_INTEGRATION_OPTIONS,
    }) as SafeSchedulerOptions;
  }

  protected _defaultOptionsRules(): SchedulerOptionsRule[] {
    // @ts-expect-error
    const rules: SchedulerOptionsRule[] = super._defaultOptionsRules();

    return rules.concat(DEFAULT_SCHEDULER_OPTIONS_RULES);
  }

  protected updateViews(): void {
    const views = this.option('views') ?? [];
    this.views = getViews(views);
    this.currentView = getCurrentView(
      this.option('currentView') ?? '',
      views,
    );
  }

  protected _initMarkup(): void {
    // @ts-expect-error
    super._initMarkup();
    this.updateViews();
    this.validateOptions();
  }

  protected schedulerOptionChanged<K extends keyof SafeSchedulerOptions>(args: {
    name: K;
    value: SafeSchedulerOptions[K];
  }): void {
    switch (args.name) {
      case 'currentView':
      case 'views':
        this.updateViews();
        break;
      default:
        break;
    }
    this.validateOptions();
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
    const validationResult = this.optionsValidator.validate(currentViewOptions);
    this.optionsValidatorErrorHandler.handleValidationResult(validationResult);
  }

  getTimeZone(): string {
    return (this.option('timeZone') || timeZoneUtils.getMachineTimezoneName()) ?? 'Etc/UTC';
  }

  getViewOption<K extends keyof SafeSchedulerOptions>(optionName: K): SafeSchedulerOptions[K] {
    const viewOptionValue = this.currentView?.[optionName as keyof View];
    const optionValue = (viewOptionValue ?? this.option(optionName)) as SafeSchedulerOptions[K];

    if (optionName === 'hiddenWeekDays') {
      if (!this.currentView) {
        return optionValue;
      }

      return resolveSkippedDays(
        this.currentView.hiddenWeekDays,
        this.option('hiddenWeekDays'),
        DEFAULT_VIEW_OPTIONS[this.currentView.type].skippedDays,
      ) as SafeSchedulerOptions[K];
    }

    return getViewOption(
      optionName,
      optionValue,
    );
  }

  hasAgendaView(): boolean {
    return this.views.some(
      (view) => view.type === 'agenda' || view.name === 'agenda',
    );
  }
}
