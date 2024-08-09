import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  EmbeddedViewRef,
  ComponentRef,
} from '@angular/core';
import { DxPopupComponent, DxPopupTypes } from 'devextreme-angular/ui/popup';
import { DxServicePopupComponent } from './service.component';

@Injectable({
  providedIn: 'root',
})
export class DxPopupService {
  constructor(
    private readonly injector: Injector,
    private readonly applicationRef: ApplicationRef,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
  ) {}

  open(contentComponentType: any, popupOptions?: DxPopupTypes.Properties) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DxServicePopupComponent);
    const componentRef: ComponentRef<DxServicePopupComponent> = componentFactory.create(this.injector);
    const cmpInstance = componentRef.instance;

    cmpInstance.onHidden.subscribe(() => {
      this.applicationRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });

    cmpInstance.afterViewInit$.subscribe(() => {
      if (popupOptions) {
        cmpInstance.instance.option(popupOptions);
      }

      cmpInstance.insertionPoint?.viewContainerRef.createComponent(contentComponentType);
    });

    this.applicationRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);

    cmpInstance.visible = true;

    return componentRef.instance as DxPopupComponent;
  }
}
