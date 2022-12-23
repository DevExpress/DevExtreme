import { Injectable } from '@angular/core';
import { RadioGroupCore } from '@devextreme/components';
import { ContextService } from '../../internal';

@Injectable()
export class RadioGroupService extends ContextService<RadioGroupCore<unknown>> {}
