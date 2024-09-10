import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  EmbeddedViewRef,
  ComponentRef, Type,
} from '@angular/core';
import { DxPopupComponent, DxPopupTypes } from '../component';
import { DxPopupServiceComponent as DxPopupServiceCmp } from './service.component';

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

  open<T>(contentComponent: Type<T>, popupOptions?: DxPopupTypes.Properties) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DxPopupServiceCmp<T>);
    const componentRef = componentFactory.create(this.injector);
    const cmpInstance = componentRef.instance;

    cmpInstance.onHidden.subscribe(() => {
      this.applicationRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });

    cmpInstance.afterViewInit$.subscribe(() => {
      if (popupOptions) {
        cmpInstance.instance.option(popupOptions);
      }

      componentRef.instance.contentRef = cmpInstance.contentInsertion?.viewContainerRef.createComponent(contentComponent);
    });

    this.applicationRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);

    cmpInstance.visible = true;

    this.applicationRef.tick();

    return componentRef.instance as DxPopupServiceComponent<T>;
  }
}
