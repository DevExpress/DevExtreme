import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import dateSerialization from '@js/core/utils/date_serialization';
import { inputType } from '@js/core/utils/support';
import type { Format } from '@js/localization';
import type { TextBoxType } from '@js/ui/text_box';
import { getGlobalFormatByDataType } from '@ts/core/global_format_config';
import type { DateBoxBaseProperties } from '@ts/ui/date_box/date_box.base';
import type DateBox from '@ts/ui/date_box/date_box.base';
import DateBoxStrategy from '@ts/ui/date_box/date_box.strategy';
import dateUtils from '@ts/ui/date_box/date_utils';
import type { PopupProperties } from '@ts/ui/popup/popup';

class NativeStrategy extends DateBoxStrategy {
  constructor(dateBox: DateBox) {
    super(dateBox);

    this.NAME = 'Native';
  }

  popupConfig(popupConfig: PopupProperties): PopupProperties {
    return {
      ...popupConfig,
      width: 'auto',
    };
  }

  getParsedText(text?: string): Date | null | undefined {
    if (!text) {
      return null;
    }

    const { type } = this.dateBox.option();
    // NOTE: Required for correct date parsing when native picker is used (T418155)
    if (type === 'datetime') {
      return new Date(text.replace(/-/g, '/').replace('T', ' ').split('.')[0]);
    }

    return dateUtils.fromStandardDateFormat(text);
  }

  renderPopupContent(): void {}

  _getDateBoxType(): string {
    const { type = 'date' } = this.dateBox.option();

    if (!dateUtils.SUPPORTED_FORMATS.includes(type)) {
      return 'date';
    }
    if (type === 'datetime' && !inputType(type)) {
      return 'datetime-local';
    }

    return type;
  }

  customizeButtons(): void {
    const dropDownButton = this.dateBox.getButton('dropDown');
    if (devices.real().android && dropDownButton) {
      dropDownButton.on('click', () => {
        (this.dateBox._input().get(0) as HTMLInputElement).click();
      });
    }
  }

  getDefaultOptions(): DateBoxBaseProperties {
    return {
      mode: this._getDateBoxType() as TextBoxType,
    };
  }

  getDisplayFormat(displayFormat?: Format | null): Format {
    const type = this._getDateBoxType();
    const globalFormat: Format = type === 'date' || type === 'datetime' || type === 'datetime-local'
      ? getGlobalFormatByDataType(type === 'datetime-local' ? 'datetime' : type)
      : undefined;

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return displayFormat || globalFormat || dateUtils.FORMATS_MAP[type] as string;
  }

  renderInputMinMax($input?: dxElementWrapper): void {
    const { type = 'date' } = this.dateBox.option();
    const defaultFormat = 'yyyy-MM-dd';
    const format = {
      datetime: 'yyyy-MM-ddTHH:mm:ss',
      date: defaultFormat,
      time: 'HH:mm:ss',
    }[type] ?? defaultFormat;

    // @ts-expect-error requires renderer types improvements
    $input.attr({
      min: dateSerialization.serializeDate(this.dateBox.getDateOption('min'), format),
      max: dateSerialization.serializeDate(this.dateBox.getDateOption('max'), format),
    });
  }
}

export default NativeStrategy;
