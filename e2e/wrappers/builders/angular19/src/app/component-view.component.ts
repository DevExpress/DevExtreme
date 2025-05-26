import {
  Component,
  inject,
  ViewContainerRef,
  OnInit,
  Injector,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { findComponentByPath } from '../utils/componentFinder';

@Component({
  selector: 'app-component-view',
  standalone: true,
  template: '<ng-container #vc></ng-container>',
})
export class ComponentViewComponent implements OnInit {
  private route = inject(ActivatedRoute);

  private vcRef = inject(ViewContainerRef);

  private injector = inject(Injector);

  async ngOnInit() {
    const path = this.route.snapshot.paramMap.get('examplePath');
    const entry = findComponentByPath(path!);

    if (entry) {
      const component = await entry.component;
      this.vcRef.createComponent(component, { injector: this.injector });
    } else {
      this.vcRef.element.nativeElement.innerHTML = '<p>404 – Component not found</p>';
    }
  }
}
