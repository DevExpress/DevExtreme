import VerticalAppointmentsStrategy from './rendering_strategies/strategy_vertical';
import HorizontalAppointmentsStrategy from './rendering_strategies/strategy_horizontal';
import HorizontalMonthLineAppointmentsStrategy from './rendering_strategies/strategy_horizontal_month_line';
import HorizontalMonthAppointmentsStrategy from './rendering_strategies/strategy_horizontal_month';
import AgendaAppointmentsStrategy from './rendering_strategies/strategy_agenda';

const RENDERING_STRATEGIES = {
    'horizontal': HorizontalAppointmentsStrategy,
    'horizontalMonth': HorizontalMonthAppointmentsStrategy,
    'horizontalMonthLine': HorizontalMonthLineAppointmentsStrategy,
    'vertical': VerticalAppointmentsStrategy,
    'agenda': AgendaAppointmentsStrategy
};

export class AppointmentViewModel {
    initRenderingStrategy(options) {
        const RenderingStrategy = RENDERING_STRATEGIES[options.viewRenderingStrategyName];
        this.renderingStrategy = new RenderingStrategy(options);
    }

    generate(options) {
        const {
            isRenovatedAppointments,
            filteredItems,
            isVerticalOrientation
        } = options;
        const appointments = filteredItems
            ? filteredItems.slice()
            : [];

        this.initRenderingStrategy(options);

        const positionMap = this.getRenderingStrategy().createTaskPositionMap(appointments);
        const viewModel = this.postProcess(filteredItems, positionMap, isVerticalOrientation, isRenovatedAppointments);

        if(isRenovatedAppointments) {
            // TODO this structure should be by default after remove old render
            return this.makeRenovatedViewModel(viewModel);
        }

        return viewModel;
    }
    postProcess(filteredItems, positionMap, isVerticalOrientation, isRenovatedAppointments) {
        return filteredItems.map((data, index) => {
            // TODO research do we need this code
            if(!this.getRenderingStrategy().keepAppointmentSettings()) {
                delete data.settings;
            }

            // TODO Seems we can analize direction in the rendering strategies
            const appointmentSettings = positionMap[index];
            appointmentSettings.forEach((item) => {
                item.direction = isVerticalOrientation && !item.allDay
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
    makeRenovatedViewModel(viewModel) {
        const result = [];
        const strategy = this.getRenderingStrategy();

        viewModel.forEach(({ itemData, settings }) => {
            const items = settings.map((options) => {
                const geometry = strategy.getAppointmentGeometry(options);

                return {
                    appointment: itemData,
                    geometry: {
                        ...geometry,
                        // TODO move to the rendering strategies
                        leftVirtualWidth: options.leftVirtualWidth,
                        topVirtualHeight: options.topVirtualHeight
                    },
                    info: options.info
                };
            });

            result.push(...items);
        });

        return result;
    }

    getRenderingStrategy() {
        return this.renderingStrategy;
    }
}
