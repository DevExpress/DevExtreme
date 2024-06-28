import { Observable, Subscribable, Updatable } from "@js/__internal/core/reactive";
import { ChangedOptionInfo } from "@js/events";
import Widget, {WidgetOptions} from "@js/ui/widget/ui.widget";

export class OptionsController<TProps extends Record<string, unknown>> {
  private observables: {[TProp in keyof TProps]?: Observable<TProps[TProp]>} = {}

  static dependencies = [Widget] as any;

  constructor(private component: Widget<TProps>) {
    component.on('optionChanged', (e: ChangedOptionInfo) => {
      if (Object.keys(this.observables).includes(e.name)) {
        this.observables[e.name]!.update(e.value);
      }
    })
  }

  oneWay<TProp extends (keyof TProps) & string>(name: TProp): Subscribable<TProps[TProp]> {
    if (name.includes('.')) {
      throw new Error('no nested')
    }
    const existingObs = this.observables[name]
    if (existingObs) {
      return existingObs;
    }
    const newObs = new Observable<TProps[TProp]>((this.component.option as any)(name));
    this.observables[name] = newObs;
    return newObs;
  }

  twoWay<TProp extends (keyof TProps) & string>(name: TProp): Subscribable<TProps[TProp]> & Updatable<TProps[TProp]> {
    throw 'not implemented';
  }
}