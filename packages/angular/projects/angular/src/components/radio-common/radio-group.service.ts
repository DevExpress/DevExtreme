import { Injectable } from '@angular/core';
import { RadioGroupStore } from '@devextreme/components';
import { ContextService } from '../../internal';

@Injectable()
export class RadioGroupService extends ContextService<RadioGroupStore<unknown>> {}
