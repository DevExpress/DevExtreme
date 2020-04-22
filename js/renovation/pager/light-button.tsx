// tslint:disable-next-line: max-line-length
import { Component, ComponentBindings, JSXComponent, OneWay, Slot, Event, Ref, Effect } from 'devextreme-generator/component_declaration/common';
import clickEvent from '../../events/click';
import eventsEngine from '../../events/core/events_engine';

export const viewFunction = ({ widgetRef,
                               props: { className, children: content, label } }: LightButton) => {
    return (
        <div
            ref={widgetRef as any}
            className={className}
            tabIndex={0}
            role={'button'}
            label={label}
        >
            {content}
        </div>);
};

@ComponentBindings()
export class LightButtonProps {
    @Slot() children?: any = null;
    @OneWay() className?: string = '';
    label?: string = '';
    @Event() onClick?: (e: any) => void;
}

function dxClickEffect(element, handler) {
    if (handler) {
        eventsEngine.on(element, clickEvent.name, handler);
        return () => eventsEngine.off(element, clickEvent.name, handler);
    }
    return null;
}
// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules: null,
    view: viewFunction,
})

export default class LightButton extends JSXComponent<LightButtonProps> {
    @Ref() widgetRef!: HTMLDivElement;
    @Effect() clickEffect() {
        return dxClickEffect(this.widgetRef, this.props.onClick);
    }
}
