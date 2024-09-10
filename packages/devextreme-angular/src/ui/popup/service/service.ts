import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  EmbeddedViewRef,
  ComponentRef, Type,
} from '@angular/core';
import { DxPopupComponent, DxPopupTypes } from '../component';
import { PopupServiceComponent } from './service.component';

export type DxPopupServiceComponent<T = any> = DxPopupComponent & { contentRef: ComponentRef<T> }

@Injectable({
  providedIn: 'root',
})
export class DxPopupService {
  constructor(
    private readonly injector: Injector,
    private readonly applicationRef: ApplicationRef,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
  ) {}

  open<T>(contentComponent: Type<T>, popupOptions?: DxPopupTypes.Properties): DxPopupServiceComponent<T> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PopupServiceComponent<T>);
    const componentRef = componentFactory.create(this.injector);
    const cmpInstance = componentRef.instance;

    cmpInstance.onHidden.subscribe(() => {
      this.applicationRef.detachView(componentRef.hostView);

      componentRef.destroy();
    });

    cmpInstance.afterViewInit$.subscribe(() => {
      if (popupOptions) {
        cmpInstance.setPopupOptions(popupOptions);
      }

      cmpInstance.setContentComponent(contentComponent);
    });

    this.applicationRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);

    cmpInstance.visible = true;

    this.applicationRef.tick();

    return componentRef.instance;
  }
}
