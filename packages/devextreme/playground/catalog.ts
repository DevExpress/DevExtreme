import '../js/integration/jquery';
import $ from 'jquery';
import { registry } from './widgets/registry';

const $nav = $('#nav');
const $container = $('#container');
const $header = $('#header');

Object.entries(registry).forEach(([id, { label }]) => {
    const $li = $('<li>').appendTo($nav);
    $('<a>').attr('href', `#${id}`).text(label).appendTo($li);
});

function loadWidget(id: string): void {
    const entry = registry[id];
    if (!entry) return;

    $nav.find('a').removeClass('active');
    $nav.find(`a[href="#${id}"]`).addClass('active');
    $header.text(entry.label);
    $container.empty();

    const $el = $('<div>').appendTo($container);
    entry.init($el);
}

window.addEventListener('hashchange', () => {
    loadWidget(location.hash.slice(1));
});

const initial = location.hash.slice(1);
if (initial && registry[initial]) {
    loadWidget(initial);
} else {
    const first = Object.keys(registry)[0];
    location.hash = first;
}
