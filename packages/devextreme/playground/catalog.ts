import '../js/integration/jquery';
import { setLicenseCheckSkipCondition } from '../js/__internal/core/license/license_validation';
import $ from 'jquery';
import { registry } from './widgets/registry';
import type { WidgetInit } from './widgets/registry';
import { setupThemeSelector } from './newThemeSelector';
import type { WidgetId } from './widget-ids';
import demosMap from 'virtual:demos-meta';

setLicenseCheckSkipCondition();

const RECENTS_KEY = 'dx-playground-recents';
const MAX_RECENTS = 5;

const widgetGroups: { label: string; ids: WidgetId[] }[] = [
    {
        label: 'Grids',
        ids: ['dataGrid', 'treeList', 'filterBuilder', 'sortable', 'draggable'],
    },
    {
        label: 'Scheduler',
        ids: ['scheduler', 'pivotGrid', 'pivotGridFieldChooser', 'pagination', 'gantt', 'recurrenceEditor'],
    },
    {
        label: 'Editors',
        ids: [
            'autocomplete', 'calendar', 'chat', 'checkBox', 'colorBox', 'dateBox', 'dateRangeBox',
            'dropDownBox', 'dropDownButton', 'fileUploader', 'htmlEditor', 'loadPanel', 'lookup',
            'map', 'numberBox', 'popover', 'popup', 'progressBar', 'radioGroup', 'rangeSlider',
            'selectBox', 'slider', 'switch', 'tagBox', 'textArea', 'textBox', 'toast', 'tooltip',
            'validationGroup', 'validationSummary', 'validator',
        ],
    },
    {
        label: 'Navigation',
        ids: [
            'accordion', 'actionSheet', 'box', 'button', 'buttonGroup', 'contextMenu', 'diagram',
            'drawer', 'fileManager', 'form', 'gallery', 'list', 'loadIndicator', 'menu', 'multiView',
            'resizable', 'responsiveBox', 'scrollView', 'speedDialAction', 'splitter', 'stepper',
            'tabPanel', 'tabs', 'tileView', 'toolbar', 'treeView',
            'barGauge', 'bullet', 'chart', 'circularGauge', 'funnel', 'linearGauge', 'pieChart',
            'polarChart', 'rangeSelector', 'sankey', 'sparkline', 'treeMap', 'vectorMap',
        ],
    },
];

function getRecents(): WidgetId[] {
    try {
        return JSON.parse(localStorage.getItem(RECENTS_KEY) ?? '[]') as WidgetId[];
    } catch {
        return [];
    }
}

function pushRecent(id: WidgetId): void {
    const recents = getRecents().filter((r) => r !== id);
    recents.unshift(id);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recents.slice(0, MAX_RECENTS)));
    renderRecents();
}

function deleteRecent(id: WidgetId): void {
    const recents = getRecents().filter((r) => r !== id);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
    renderRecents();
}

function renderRecents(): void {
    const $section = $('#recents-section');
    const $list = $('#recents-list');
    const recents = getRecents().filter((id) => registry[id]);

    $list.empty();

    if (recents.length === 0) {
        $section.hide();
        return;
    }

    $section.show();

    const currentId = location.hash.slice(1);

    recents.forEach((id) => {
        const entry = registry[id];
        const $li = $('<li class="recent-item">').appendTo($list);
        $('<a>').attr('href', `#${id}`).text(entry.label).toggleClass('active', id === currentId).appendTo($li);
        $('<button class="btn-remove-recent" title="Remove">×</button>')
            .on('click', (e) => {
                e.preventDefault();
                deleteRecent(id);
            })
            .appendTo($li);
    });
}

function buildNav(filter: string): void {
    const $nav = $('#groups-nav');
    $nav.empty();
    const lc = filter.toLowerCase();
    const currentId = location.hash.slice(1);

    widgetGroups.forEach((group) => {
        const matching = group.ids.filter((id) => {
            if (!registry[id]) return false;
            if (!lc) return true;
            return registry[id].label.toLowerCase().includes(lc) || id.toLowerCase().includes(lc);
        });

        if (matching.length === 0) return;

        const $details = $('<details>').attr('open', '').appendTo($nav);
        $('<summary class="group-summary">').text(group.label).appendTo($details);
        const $ul = $('<ul class="group-list">').appendTo($details);

        matching.forEach((id) => {
            const $li = $('<li>').appendTo($ul);
            $('<a>')
                .attr('href', `#${id}`)
                .text(registry[id].label)
                .toggleClass('active', id === currentId)
                .appendTo($li);
        });
    });
}

function setActiveLink(id: string): void {
    $('#groups-nav a, #recents-list a').removeClass('active');
    $(`#groups-nav a[href="#${id}"], #recents-list a[href="#${id}"]`).addClass('active');
}

const $header = $('#header');
const $container = $('#container');

function getWidgetName(id: WidgetId): string {
    return registry[id].label.replace(/\s/g, '');
}

function renderDemoLinks(id: WidgetId): void {
    const widgetName = getWidgetName(id);
    const demos = demosMap[widgetName] ?? [];
    if (demos.length === 0) return;

    const $section = $('<div class="demo-list">').appendTo($container);
    $('<div class="demo-list-caption">').text('Official Demos').appendTo($section);
    const $chips = $('<div class="demo-chips">').appendTo($section);

    demos.forEach(({ title, name }) => {
        $('<a class="demo-chip">')
            .attr('href', `#demo/${widgetName}/${name}`)
            .text(title)
            .appendTo($chips);
    });
}

function loadWidget(id: string): void {
    const entry = registry[id as WidgetId];
    if (!entry) return;

    setActiveLink(id);
    $header.text(entry.label);
    $container.empty();

    const $el = $('<div>').appendTo($container);
    (entry.init as WidgetInit)($el);

    renderDemoLinks(id as WidgetId);

    pushRecent(id as WidgetId);
    setActiveLink(id);
}

function loadDemo(widget: string, name: string): void {
    $header.html(
        `<a class="demo-back" href="#${findWidgetId(widget) ?? ''}">← ${widget}</a> &nbsp; ${name}`,
    );
    $container.empty();
    $('<iframe>')
        .attr('src', `/demos/${widget}/${name}/`)
        .css({ width: '100%', height: 'calc(100vh - 53px)', border: 'none', display: 'block' })
        .appendTo($container);
}

function findWidgetId(widgetName: string): WidgetId | undefined {
    return Object.keys(registry).find(
        (id) => registry[id as WidgetId].label.replace(/\s/g, '') === widgetName,
    ) as WidgetId | undefined;
}

$('#search').on('input', function () {
    buildNav((this as HTMLInputElement).value);
});

window.addEventListener('hashchange', () => {
    const hash = location.hash.slice(1);
    if (hash.startsWith('demo/')) {
        const parts = hash.split('/');
        loadDemo(parts[1], parts[2]);
    } else {
        loadWidget(hash);
    }
});

setupThemeSelector('theme-selector').then(() => {
    buildNav('');
    renderRecents();

    const hash = location.hash.slice(1);
    if (hash.startsWith('demo/')) {
        const parts = hash.split('/');
        loadDemo(parts[1], parts[2]);
        return;
    }

    const lastRecent = getRecents()[0];
    const target = (hash && registry[hash as WidgetId])
        ? hash
        : (lastRecent ?? widgetGroups[0].ids[0]);
    location.hash = target;
});
