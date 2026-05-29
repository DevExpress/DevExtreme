import type { ViewType } from '../../../types';
import { DEFAULT_VIEW_OPTIONS, VIEWS } from '../../../utils/options/constants_view';
import { ViewDataGenerator } from '../m_view_data_generator';
import { ViewDataGeneratorDay } from '../m_view_data_generator_day';
import { ViewDataGeneratorMonth } from '../m_view_data_generator_month';
import { ViewDataGeneratorTimelineMonth } from '../m_view_data_generator_timeline_month';
import { ViewDataGeneratorWeek } from '../m_view_data_generator_week';

type ViewDataGeneratorConstructor = new (viewType: ViewType) => ViewDataGenerator;

const VIEW_DATA_GENERATOR_BY_VIEW_TYPE: Partial<Record<ViewType, ViewDataGeneratorConstructor>> = {
  [VIEWS.MONTH]: ViewDataGeneratorMonth,
  [VIEWS.TIMELINE_MONTH]: ViewDataGeneratorTimelineMonth,
  [VIEWS.DAY]: ViewDataGeneratorDay,
  [VIEWS.TIMELINE_DAY]: ViewDataGeneratorDay,
  [VIEWS.WEEK]: ViewDataGeneratorWeek,
  [VIEWS.TIMELINE_WEEK]: ViewDataGeneratorWeek,
  [VIEWS.WORK_WEEK]: ViewDataGeneratorWeek,
  [VIEWS.TIMELINE_WORK_WEEK]: ViewDataGeneratorWeek,
};

export const getViewDataGeneratorByViewType = (viewType: ViewType): ViewDataGenerator => {
  const Generator = VIEW_DATA_GENERATOR_BY_VIEW_TYPE[viewType] ?? ViewDataGenerator;
  const generator = new Generator(viewType);
  const defaultViewOptions = DEFAULT_VIEW_OPTIONS[viewType];

  generator.skippedDays = defaultViewOptions ? defaultViewOptions.skippedDays : [];

  return generator;
};
