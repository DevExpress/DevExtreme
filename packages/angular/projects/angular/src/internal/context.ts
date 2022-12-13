import { Injectable } from '@angular/core';
import {
  BehaviorSubject, filter, OperatorFunction, pipe, take,
} from 'rxjs';

@Injectable()
export class ContextService<TContext> {
  private contextSubject = new BehaviorSubject<TContext | undefined>(
    undefined,
  );

  context$ = this.contextSubject.asObservable();

  setContext(context: TContext): void {
    this.contextSubject.next(context);
  }
}

export function doIfContextExist<TContext>(): OperatorFunction<TContext | undefined, TContext> {
  return pipe(
    take(1),
    filter((context): context is TContext => !!context),
  );
}

export function waitContextAndDo<TContext>(): OperatorFunction<TContext | undefined, TContext> {
  return pipe(
    filter((context): context is TContext => !!context),
    take(1),
  );
}
