/* eslint-disable max-classes-per-file */
import { NgModule, Pipe, PipeTransform } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func = (...args: any[]) => any;

@Pipe({ name: 'apply' })
export class ApplyPipe implements PipeTransform {
  // eslint-disable-next-line class-methods-use-this
  transform<TFunc extends Func>(value: TFunc, ...args: Parameters<TFunc>): ReturnType<TFunc> {
    return value(...args);
  }
}

@NgModule({
  declarations: [ApplyPipe],
  exports: [ApplyPipe],
})
export class ApplyPipeModule {
}
