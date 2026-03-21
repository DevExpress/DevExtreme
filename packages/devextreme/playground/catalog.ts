import '../js/integration/jquery';
import { setLicenseCheckSkipCondition } from '../js/__internal/core/license/license_validation';
import $ from 'jquery';
import { registry } from './widgets/registry';
import type { WidgetInit } from './widgets/registry';
import { setupThemeSelector } from './newThemeSelector';
import type { WidgetId } from './widget-ids';
import demosMeta from 'virtual:demos-meta';

const { demosRoot, demos: demosMap } = demosMeta;

setLicenseCheckSkipCondition();

const RECENTS_KEY = 'dx-playground-recents';
const PINNED_KEY = 'dx-playground-pinned';
const PINNED_DEMOS_KEY = 'dx-playground-pinned-demos';
const RECENT_DEMOS_KEY = 'dx-playground-recent-demos';
const MAX_RECENTS = 5;
const MAX_RECENT_DEMOS = 20;

interface PinnedDemo { widget: string; name: string; title: string }
interface RecentDemo { widget: string; name: string }

const widgetGroups: { label: string; ids: WidgetId[] }[] = [
    {
        label: 'Grids',
        ids: ['dataGrid', 'cardView', 'treeList', 'filterBuilder', 'sortable', 'draggable'],
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

function getPinned(): WidgetId[] {
    try {
        return JSON.parse(localStorage.getItem(PINNED_KEY) ?? '[]') as WidgetId[];
    } catch {
        return [];
    }
}

function isPinned(id: WidgetId): boolean {
    return getPinned().includes(id);
}

function togglePin(id: WidgetId): void {
    const pinned = getPinned();
    const idx = pinned.indexOf(id);
    if (idx === -1) {
        pinned.push(id);
    } else {
        pinned.splice(idx, 1);
    }
    localStorage.setItem(PINNED_KEY, JSON.stringify(pinned));
    renderPinned();
    buildNav($('#search').val() as string);
}

function getPinnedDemos(): PinnedDemo[] {
    try {
        return JSON.parse(localStorage.getItem(PINNED_DEMOS_KEY) ?? '[]') as PinnedDemo[];
    } catch {
        return [];
    }
}

function isDemoPinned(widget: string, name: string): boolean {
    return getPinnedDemos().some((d) => d.widget === widget && d.name === name);
}

function toggleDemoPin(widget: string, name: string, title: string): void {
    const demos = getPinnedDemos();
    const idx = demos.findIndex((d) => d.widget === widget && d.name === name);
    if (idx === -1) {
        demos.push({ widget, name, title });
    } else {
        demos.splice(idx, 1);
    }
    localStorage.setItem(PINNED_DEMOS_KEY, JSON.stringify(demos));
    renderPinned();
}

function renderPinned(): void {
    const $section = $('#pinned-section');
    const $list = $('#pinned-list');
    const pinned = getPinned().filter((id) => registry[id]);
    const pinnedDemos = getPinnedDemos();

    $list.empty();

    if (pinned.length === 0 && pinnedDemos.length === 0) {
        $section.hide();
        return;
    }

    $section.show();

    const currentHash = location.hash.slice(1);

    pinned.forEach((id) => {
        const entry = registry[id];
        const $li = $('<li class="pinned-item">').appendTo($list);
        $('<a>').attr('href', `#${id}`).text(entry.label).toggleClass('active', id === currentHash).appendTo($li);
        $('<button class="btn-unpin" title="Unpin">×</button>')
            .on('click', (e) => { e.preventDefault(); togglePin(id); })
            .appendTo($li);
    });

    pinnedDemos.forEach(({ widget, name, title }) => {
        const hash = `demo/${widget}/${name}`;
        const $li = $('<li class="pinned-item pinned-demo">').appendTo($list);
        $('<a>').attr('href', `#${hash}`).toggleClass('active', currentHash === hash)
            .html(`<span class="pinned-demo-badge">${widget}</span>${title}`)
            .appendTo($li);
        $('<button class="btn-unpin" title="Unpin">×</button>')
            .on('click', (e) => { e.preventDefault(); toggleDemoPin(widget, name, title); })
            .appendTo($li);
    });
}

function getRecentDemos(): RecentDemo[] {
    try {
        return JSON.parse(localStorage.getItem(RECENT_DEMOS_KEY) ?? '[]') as RecentDemo[];
    } catch {
        return [];
    }
}

function pushRecentDemo(widget: string, name: string): void {
    const recents = getRecentDemos().filter((d) => !(d.widget === widget && d.name === name));
    recents.unshift({ widget, name });
    localStorage.setItem(RECENT_DEMOS_KEY, JSON.stringify(recents.slice(0, MAX_RECENT_DEMOS)));
}

function getDemoChipColors(widget: string, name: string): { borderColor: string; color: string; background: string } {
    const idx = getRecentDemos().findIndex((d) => d.widget === widget && d.name === name);
    if (idx === -1) {
        return { borderColor: 'hsl(217, 8%, 78%)', color: 'hsl(217, 8%, 58%)', background: '#fff' };
    }
    const t = idx / Math.max(MAX_RECENT_DEMOS - 1, 1);
    const s = Math.round(78 - t * 58);
    const borderL = Math.round(54 + t * 18);
    const textL = Math.round(34 + t * 18);
    const bgL = Math.round(95 + t * 3);
    return {
        borderColor: `hsl(217, ${s}%, ${borderL}%)`,
        color: `hsl(217, ${s}%, ${textL}%)`,
        background: `hsl(217, ${s}%, ${bgL}%)`,
    };
}

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
    const currentHash = location.hash.slice(1);

    widgetGroups.forEach((group) => {
        const matching = group.ids.filter((id) => {
            if (!registry[id]) return false;
            if (!lc) return true;
            const widgetMatches = registry[id].label.toLowerCase().includes(lc) || id.toLowerCase().includes(lc);
            const demoMatches = (demosMap[getWidgetName(id as WidgetId)] ?? []).some(
                (d) => d.title.toLowerCase().includes(lc) || d.name.toLowerCase().includes(lc),
            );
            return widgetMatches || demoMatches;
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
                .toggleClass('active', id === currentHash)
                .appendTo($li);
            $('<button class="btn-pin" title="Pin">')
                .text('◈')
                .toggleClass('pinned', isPinned(id))
                .on('click', (e) => {
                    e.preventDefault();
                    togglePin(id);
                })
                .appendTo($li);

            if (lc) {
                const widgetName = getWidgetName(id as WidgetId);
                const widgetMatches = registry[id].label.toLowerCase().includes(lc) || id.toLowerCase().includes(lc);
                const matchingDemos = (demosMap[widgetName] ?? []).filter(
                    (d) => d.title.toLowerCase().includes(lc) || d.name.toLowerCase().includes(lc),
                );
                if (!widgetMatches && matchingDemos.length > 0) {
                    const $demos = $('<ul class="demo-search-results">').appendTo($li);
                    matchingDemos.forEach((d) => {
                        const hash = `demo/${widgetName}/${d.name}`;
                        $('<li>').append(
                            $('<a class="demo-search-link">')
                                .attr('href', `#${hash}`)
                                .toggleClass('active', currentHash === hash)
                                .text(d.title),
                        ).appendTo($demos);
                    });
                }
            }
        });
    });
}

function setActiveLink(id: string): void {
    $('#groups-nav a, #recents-list a, #pinned-list a').removeClass('active');
    $(`#groups-nav a[href="#${CSS.escape(id)}"], #recents-list a[href="#${CSS.escape(id)}"], #pinned-list a[href="#${CSS.escape(id)}"]`).addClass('active');
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
        const colors = getDemoChipColors(widgetName, name);
        $('<a class="demo-chip">')
            .attr('href', `#demo/${widgetName}/${name}`)
            .text(title)
            .css({ borderColor: colors.borderColor, color: colors.color, background: colors.background })
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
    const entry = demosMap[widget]?.find((d) => d.name === name);
    const title = entry?.title ?? name;

    $header.empty();
    $('<a class="demo-back">').attr('href', `#${findWidgetId(widget) ?? ''}`).text(`← ${widget}`).appendTo($header);
    $('<span class="demo-header-title">').text(`\u00a0\u00a0${title}`).appendTo($header);
    $('<button class="btn-pin-demo-header" title="Pin demo">')
        .text('◈')
        .toggleClass('pinned', isDemoPinned(widget, name))
        .on('click', function () {
            toggleDemoPin(widget, name, title);
            $(this).toggleClass('pinned', isDemoPinned(widget, name));
        })
        .appendTo($header);

    $container.empty();

    if (demosRoot && entry?.files.length) {
        const jqueryDir = `${demosRoot}/${widget}/${name}/jQuery`;
        const $bar = $('<div class="demo-files-bar">').appendTo($container);
        $('<span class="demo-files-label">').text('Source:').appendTo($bar);
        entry.files.forEach((file) => {
            $('<a class="demo-file-link">')
                .attr('href', `vscode://file/${jqueryDir}/${file}`)
                .text(file)
                .appendTo($bar);
        });
    }

    $('<iframe>')
        .attr('src', `demos/${widget}/${name}/`)
        .css({ width: '100%', border: 'none', display: 'block', flex: '1' })
        .appendTo($container);

    pushRecentDemo(widget, name);
    renderPinned();
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
    renderPinned();
    renderRecents();

    const hash = location.hash.slice(1);
    if (hash.startsWith('demo/')) {
        const parts = hash.split('/');
        loadDemo(parts[1], parts[2]);
        return;
    }

    if (hash && registry[hash as WidgetId]) {
        loadWidget(hash);
    } else {
        const lastRecent = getRecents()[0];
        const target = lastRecent ?? widgetGroups[0].ids[0];
        location.hash = target;
    }
});
