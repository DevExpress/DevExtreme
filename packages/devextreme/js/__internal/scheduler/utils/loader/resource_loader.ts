import {
  getAppointmentResourceAccessor,
  getResourceIndex,
  type ResourceIdAccessor,
} from '../data_accessor/appointment_resource_data_accessor';
import { ResourceDataAccessor } from '../data_accessor/resource_data_accessor';
import { Loader } from './loader';
import type {
  RawResourceData,
  ResourceConfig,
  ResourceData,
} from './types';

export class ResourceLoader extends Loader<RawResourceData, ResourceData> {
  public idsGetter: ResourceIdAccessor['idsGetter'];

  public idsSetter: ResourceIdAccessor['idsSetter'];

  public dataAccessor: ResourceDataAccessor;

  public allowMultiple: boolean;

  public useColorAsDefault: boolean;

  public resourceIndex: string;

  public resourceName?: string;

  public icon?: string;

  constructor(config: ResourceConfig) {
    super(config, { pageSize: 0 });
    const accessor = getAppointmentResourceAccessor(config);

    this.idsGetter = accessor.idsGetter;
    this.idsSetter = accessor.idsSetter;
    this.dataAccessor = new ResourceDataAccessor(config);
    this.allowMultiple = Boolean(config.allowMultiple);
    this.useColorAsDefault = Boolean(config.useColorAsDefault);
    this.resourceIndex = String(getResourceIndex(config));
    this.resourceName = config.label;
    this.icon = config.icon;
    this.onInit();
  }

  protected onLoadTransform(items: RawResourceData[]): ResourceData[] {
    return items.map((item) => ({
      id: this.dataAccessor.get('id', item),
      text: this.dataAccessor.get('text', item),
      color: this.dataAccessor.get('color', item),
    }));
  }

  protected applyChanges(items: RawResourceData[]): void {
    super.applyChanges(items);
  }

  protected onLoadError(): void {}

  protected onChange(): void {}
}
