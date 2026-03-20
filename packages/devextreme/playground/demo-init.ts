import jq from 'jquery';
import '../js/integration/jquery';
import { setLicenseCheckSkipCondition } from '../js/__internal/core/license/license_validation';
import ArrayStore from '../js/data/array_store';
import CustomStore from '../js/data/custom_store';
import DataSource from '../js/data/data_source';
import query from '../js/data/query';
import notify from '../js/ui/notify';
import * as dialog from '../js/ui/dialog';
import * as localization from '../js/localization';
import * as timeZoneUtils from '../js/time_zone_utils';
import config from '../js/core/config';
import setTemplateEngine from '../js/core/set_template_engine';
import { Guid } from '../js/__internal/core/m_guid';
import {
    getPalette,
    registerPalette,
    currentPalette,
    generateColors,
} from '../js/viz/palette';
import repaintFloatingActionButton from '../js/ui/speed_dial_action/repaint_floating_action_button';
import Ajax from '../js/core/utils/ajax';
import RemoteFileSystemProvider from '../js/file_management/remote_provider';
import { registerPattern, registerGradient } from '../js/common/charts';

(window as any).$ = (window as any).jQuery = jq;

const AspNet = {
    createStore(options: any) {
        return new CustomStore({
            key: options.key,
            load: (loadOptions: any) => Ajax.sendRequest({
                url: options.loadUrl,
                method: 'GET',
                data: loadOptions,
                dataType: 'json',
            }),
            insert: options.insertUrl ? (values: any) => Ajax.sendRequest({
                url: options.insertUrl,
                method: 'POST',
                data: JSON.stringify(values),
                contentType: 'application/json',
                dataType: 'json',
            }) : undefined,
            update: options.updateUrl ? (key: any, values: any) => Ajax.sendRequest({
                url: options.updateUrl,
                method: 'PUT',
                data: JSON.stringify({ key, values }),
                contentType: 'application/json',
                dataType: 'json',
            }) : undefined,
            remove: options.deleteUrl ? (key: any) => Ajax.sendRequest({
                url: options.deleteUrl,
                method: 'DELETE',
                data: JSON.stringify(key),
                contentType: 'application/json',
                dataType: 'json',
            }) : undefined,
        });
    },
    sendRequest: (options: any) => Ajax.sendRequest(options),
};

(window as any).DevExpress = {
    config,
    setTemplateEngine,
    data: { ArrayStore, CustomStore, DataSource, query, Guid, AspNet },
    ui: { notify, dialog, repaintFloatingActionButton },
    localization,
    utils: { getTimeZones: timeZoneUtils.getTimeZones, ajax: Ajax },
    viz: { getPalette, registerPalette, currentPalette, generateColors, map: { sources: {} } },
    fileManagement: { RemoteFileSystemProvider },
    common: { charts: { registerPattern, registerGradient } },
};

import '../js/ui/accordion';
import '../js/ui/card_view';
import '../js/ui/action_sheet';
import '../js/ui/autocomplete';
import '../js/ui/box';
import '../js/ui/button';
import '../js/ui/button_group';
import '../js/ui/calendar';
import '../js/ui/chat';
import '../js/ui/check_box';
import '../js/ui/color_box';
import '../js/ui/context_menu';
import '../js/ui/data_grid';
import '../js/ui/date_box';
import '../js/ui/date_range_box';
import '../js/ui/diagram';
import '../js/ui/draggable';
import '../js/ui/drawer';
import '../js/ui/drop_down_box';
import '../js/ui/drop_down_button';
import '../js/ui/file_manager';
import '../js/ui/file_uploader';
import '../js/ui/filter_builder';
import '../js/ui/form';
import '../js/ui/gallery';
import '../js/ui/gantt';
import '../js/ui/html_editor';
import '../js/ui/list';
import '../js/ui/load_indicator';
import '../js/ui/load_panel';
import '../js/ui/lookup';
import '../js/ui/map';
import '../js/ui/menu';
import '../js/ui/multi_view';
import '../js/ui/number_box';
import '../js/ui/pagination';
import '../js/ui/pivot_grid';
import '../js/ui/pivot_grid_field_chooser';
import '../js/ui/popover';
import '../js/ui/popup';
import '../js/ui/progress_bar';
import '../js/ui/radio_group';
import '../js/ui/range_slider';
import '../js/ui/recurrence_editor';
import '../js/ui/resizable';
import '../js/ui/responsive_box';
import '../js/ui/scheduler';
import '../js/ui/scroll_view';
import '../js/ui/select_box';
import '../js/ui/slider';
import '../js/ui/sortable';
import '../js/ui/speed_dial_action';
import '../js/ui/splitter';
import '../js/ui/stepper';
import '../js/ui/switch';
import '../js/ui/tab_panel';
import '../js/ui/tabs';
import '../js/ui/tag_box';
import '../js/ui/text_area';
import '../js/ui/text_box';
import '../js/ui/tile_view';
import '../js/ui/toast';
import '../js/ui/toolbar';
import '../js/ui/tooltip';
import '../js/ui/tree_list';
import '../js/ui/tree_view';
import '../js/ui/validation_group';
import '../js/ui/validation_summary';
import '../js/ui/validator';
import '../js/viz/bar_gauge';
import '../js/viz/bullet';
import '../js/viz/chart';
import '../js/viz/circular_gauge';
import '../js/viz/funnel';
import '../js/viz/linear_gauge';
import '../js/viz/pie_chart';
import '../js/viz/polar_chart';
import '../js/viz/range_selector';
import '../js/viz/sankey';
import '../js/viz/sparkline';
import '../js/viz/tree_map';
import '../js/viz/vector_map';

setLicenseCheckSkipCondition();

const themeLoaders = import.meta.glob('../artifacts/css/dx.*.css', { query: '?url', import: 'default' });
const themeId = localStorage.getItem('currentThemeId');
const themeKey = themeId
    ? Object.keys(themeLoaders).find((p) => p.includes(`dx.${themeId}.css`))
    : Object.keys(themeLoaders)[0];

if (themeKey) {
    const rawUrl = await (themeLoaders[themeKey] as () => Promise<string>)();
    const url = new URL(rawUrl, import.meta.url).href;
    await new Promise<void>((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = () => resolve();
        document.head.appendChild(link);
    });
}
