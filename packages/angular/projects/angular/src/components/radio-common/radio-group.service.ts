import { Injectable } from '@angular/core';
import { RadioGroupCore } from '@devextreme/components';
import { ContextService } from '../../internal';
import { RadioGroupValue } from './types.js';

@Injectable()
export class RadioGroupService extends ContextService<RadioGroupCore<RadioGroupValue>> {}
