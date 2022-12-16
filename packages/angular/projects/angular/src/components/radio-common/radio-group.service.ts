import { Injectable } from '@angular/core';
import { RadioGroupCore, RadioGroupValue } from '@devextreme/components';
import { ContextService } from '../../internal';

@Injectable()
export class RadioGroupService extends ContextService<RadioGroupCore<RadioGroupValue>> {}
