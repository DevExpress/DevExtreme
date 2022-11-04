import {TemplateRef, Type} from '@angular/core';

// angular has bad typed templates, so we need any here.
type AngularTemplate<TComponent> = TemplateRef<any> | Type<TComponent>;

export type {
  AngularTemplate,
}
