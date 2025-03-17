import { Component } from 'inferno';

import type { DataRow } from '../../../columns_controller/types';

export interface Properties {
  row: DataRow | null;
}

export class EditPopup extends Component<Properties> {

}
