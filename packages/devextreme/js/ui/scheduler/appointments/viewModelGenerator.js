import VerticalAppointmentsStrategy from './rendering_strategies/strategy_vertical';
import WeekAppointmentRenderingStrategy from './rendering_strategies/strategy_week';
import HorizontalAppointmentsStrategy from './rendering_strategies/strategy_horizontal';
import HorizontalMonthLineAppointmentsStrategy from './rendering_strategies/strategy_horizontal_month_line';
import HorizontalMonthAppointmentsStrategy from './rendering_strategies/strategy_horizontal_month';
import AgendaAppointmentsStrategy from './rendering_strategies/strategy_agenda';
import { getAppointmentKey } from '../../../renovation/ui/scheduler/appointment/utils';

const RENDERING_STRATEGIES = {
    'horizontal': HorizontalAppointmentsStrategy,
    'horizontalMonth': HorizontalMonthAppointmentsStrategy,
    'horizontalMonthLine': HorizontalMonthLineAppointmentsStrategy,
    'vertical': VerticalAppointmentsStrategy,
    'week': WeekAppointmentRenderingStrategy,
    'agenda': AgendaAppointmentsStrategy
};

export class AppointmentViewModelGenerator {
    initRenderingStrategy(options) {
        const RenderingStrategy = RENDERING_STRATEGIES[options.appointmentRenderingStrategyName];
        this.renderingStrategy = new RenderingStrategy(options);
    }

    generate(filteredItems, options) {
        const {
            isRenovatedAppointments
        } = options;
        const appointments = filteredItems
            ? filteredItems.slice()
            : [];

        this.initRenderingStrategy(options);

        const renderingStrategy = this.getRenderingStrategy();
        const positionMap = renderingStrategy.createTaskPositionMap(appointments); // TODO - appointments are mutated inside!
        const viewModel = this.postProcess(appointments, positionMap, isRenovatedAppointments);

        if(isRenovatedAppointments) {
            // TODO this structure should be by default after remove old render
            return this.makeRenovatedViewModels(
                viewModel,
                options.supportAllDayRow,
                options.isVerticalGroupOrientation,
            );
        }

        return {
            positionMap,
            viewModel
        };
    }
    postProcess(filteredItems, positionMap, isRenovatedAppointments) {
        const renderingStrategy = this.getRenderingStrategy();

        return filteredItems.map((data, index) => {
            // TODO research do we need this code
            if(!renderingStrategy.keepAppointmentSettings()) {
                delete data.settings;
            }

            // TODO Seems we can analize direction in the rendering strategies
            const appointmentSettings = positionMap[index];
            appointmentSettings.forEach((item) => {
                item.direction = renderingStrategy.getDirection() === 'vertical' && !item.allDay
                    ? 'vertical'
                    : 'horizontal';
            });

            const item = {
                itemData: data,
                settings: appointmentSettings
            };

            if(!isRenovatedAppointments) {
                item.needRepaint = true;
                item.needRemove = false;
            }

            return item;
        });
    }
    makeRenovatedViewModels(viewModel, supportAllDayRow, isVerticalGrouping) {
        const strategy = this.getRenderingStrategy();
        const regularViewModels = [];
        const allDayViewModels = [];
        const compactOptions = [];
        const isAllDayPanel = supportAllDayRow && !isVerticalGrouping;

        viewModel.forEach(({ itemData, settings }) => {
            settings.forEach((options) => {
                const item = this.prepareViewModel(options, strategy, itemData);
                if(options.isCompact) {
                    compactOptions.push({
                        compactViewModel: options.virtual,
                        appointmentViewModel: item
                    });
                } else if(options.allDay && isAllDayPanel) {
                    allDayViewModels.push(item);
                } else {
                    regularViewModels.push(item);
                }
            });
        });

        const compactViewModels = this.prepareCompactViewModels(compactOptions, supportAllDayRow);

        const result = {
            allDay: allDayViewModels,
            regular: regularViewModels,
            ...compactViewModels,
        };

        return result;
    }

    prepareViewModel(options, strategy, itemData) {
        const geometry = strategy.getAppointmentGeometry(options);

        const viewModel = {
            key: getAppointmentKey(geometry),
            appointment: itemData,
            geometry: {
                ...geometry,
                // TODO move to the rendering strategies
                leftVirtualWidth: options.leftVirtualWidth,
                topVirtualHeight: options.topVirtualHeight
            },
            info: {
                ...options.info,
                allDay: options.allDay,
                direction: options.direction,
                appointmentReduced: options.appointmentReduced,
                groupIndex: options.groupIndex,
            },
        };

        return viewModel;
    }

    getCompactViewModelFrame(compactViewModel) {
        return {
            isAllDay: !!compactViewModel.isAllDay,
            isCompact: compactViewModel.isCompact,
            groupIndex: compactViewModel.groupIndex,
            geometry: {
                left: compactViewModel.left,
                top: compactViewModel.top,
                width: compactViewModel.width,
                height: compactViewModel.height,
            },
            items: {
                colors: [],
                data: [],
                settings: [],
            },
        };
    }
    prepareCompactViewModels(compactOptions, supportAllDayRow) {
        const regularCompact = {};
        const allDayCompact = {};

        compactOptions.forEach(({ compactViewModel, appointmentViewModel }) => {
            const {
                index,
                isAllDay,
            } = compactViewModel;
            const viewModel = isAllDay && supportAllDayRow
                ? allDayCompact
                : regularCompact;

            if(!viewModel[index]) {
                viewModel[index] = this.getCompactViewModelFrame(compactViewModel);
            }

            const {
                settings,
                data,
                colors
            } = viewModel[index].items;

            settings.push(appointmentViewModel);
            data.push(appointmentViewModel.appointment);
            colors.push(appointmentViewModel.info.resourceColor);
        });

        const toArray = (items) => Object
            .keys(items)
            .map((key) => ({ key, ...items[key] }));

        const allDayViewModels = toArray(allDayCompact);
        const regularViewModels = toArray(regularCompact);

        return {
            allDayCompact: allDayViewModels,
            regularCompact: regularViewModels
        };
    }

    getRenderingStrategy() {
        return this.renderingStrategy;
    }
}
