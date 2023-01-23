import { Injectable } from '@angular/core';

@Injectable()
export class ContextService<TContext> {
  context?: TContext;
}
