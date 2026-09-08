/*
 * The decision pages: every question the roles audit leaves for a person, as standalone HTML.
 *
 *   node tools/review/roles-pages.mjs   # → scss/widgets/fluent-next/ROLES_*.html
 *
 * Three audiences, three pages, one source - `node tools/review/roles.mjs --json` plus the decisions
 * banked in tests/roles.baseline.json, so a page cannot drift from the gate that holds the list.
 * Every question carries a number so an answer can be given as "Д3 - вариант 2" without quoting it
 * back. Nothing is filtered out: what needs no decision is listed too, with the reason, so the set
 * is closed rather than curated.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const themeDir = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const base = JSON.parse(readFileSync(join(packageRoot, 'tests', 'roles.baseline.json'), 'utf8'));
const data = JSON.parse(execSync('node tools/review/roles.mjs --json', {
  cwd: packageRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
}));

/*
 * --check makes a stale page a red test instead of something to remember. The pages are the
 * deliverable, and a generated file that is only regenerated when somebody thinks of it will
 * eventually disagree with the data it claims to show - which already happened once, when a
 * hardcoded "39%" sat next to a computed 226 of 714.
 */
const checkOnly = process.argv.includes('--check');
const stale = [];
const emit = (name, html) => {
  const path = join(themeDir, name);
  if (!checkOnly) { writeFileSync(path, html); console.log(name); return; }
  const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (current !== html) stale.push(name);
};

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const code = (s) => `<code>${esc(s)}</code>`;
const roleList = (rs) => rs.map((r) => code(r.replace(/^color-/, ''))).join(' · ');

const CSS = `
:root { color-scheme: light dark; --fg:#161616; --bg:#fff; --muted:#616161; --line:#e1e1e1;
        --accent:#0f6cbd; --warn:#c50f1f; --panel:#f8f8f8; }
@media (prefers-color-scheme: dark) { :root { --fg:#f5f5f5; --bg:#242424; --muted:#a1a1a1;
        --line:#4c4c4c; --accent:#4b90d9; --warn:#e4554f; --panel:#1d1d1d; } }
* { box-sizing: border-box; }
body { margin:0; padding:2.5rem 1.5rem 6rem; background:var(--bg); color:var(--fg);
       font:15px/1.6 "Segoe UI", system-ui, sans-serif; }
main { max-width: 62rem; margin: 0 auto; }
h1 { font-size:1.9rem; font-weight:600; margin:0 0 .3rem; letter-spacing:-.01em; }
h2 { font-size:1.3rem; font-weight:600; margin:3rem 0 .6rem; padding-top:1.2rem;
     border-top:2px solid var(--line); }
h3 { font-size:1.05rem; font-weight:600; margin:2rem 0 .5rem; }
p, li { margin:.5rem 0; }
.lede { color:var(--muted); margin-bottom:2rem; }
table { border-collapse:collapse; width:100%; margin:.9rem 0; font-size:.92em; }
th, td { border:1px solid var(--line); padding:.45rem .6rem; text-align:left; vertical-align:top; }
th { background:var(--panel); font-weight:600; }
code { font:.88em ui-monospace, "Cascadia Code", Menlo, monospace;
       background:var(--panel); padding:.1em .35em; border-radius:3px; }
.q { border:1px solid var(--line); border-left:3px solid var(--accent); border-radius:4px;
     padding:.9rem 1.1rem; margin:1.1rem 0; background:var(--panel); }
.q > .id { font-weight:600; color:var(--accent); font-size:.85em; letter-spacing:.06em;
     text-transform:uppercase; display:block; margin-bottom:.25rem; }
.q > .t { font-weight:600; margin-bottom:.4rem; }
.q .opt { margin:.5rem 0 0 0; padding-left:1.2rem; }
.warn { color:var(--warn); font-weight:600; }
.swatch { display:inline-block; width:.85em; height:.85em; border:1px solid var(--line);
     border-radius:2px; vertical-align:-.1em; margin-right:.3em; }
.meta { color:var(--muted); font-size:.88em; }
.none { color:var(--muted); font-style:italic; }
footer { margin-top:4rem; padding-top:1rem; border-top:1px solid var(--line);
     color:var(--muted); font-size:.85em; }
`;

const page = (title, bodyHtml) => `<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${CSS}</style></head>
<body><main>${bodyHtml}
<footer>Сгенерировано <code>node tools/review/roles-pages.mjs</code> ·
пакет <code>@devexpress/design-tokens-internal@${data.summary.tokensVersion}</code> ·
данные: <code>tools/review/roles.mjs</code> + <code>tests/roles.baseline.json</code> ·
править руками не нужно, перегенерируйте.</footer>
</main></body></html>
`;

const q = (id, title, bodyHtml) => `<div class="q"><span class="id">${esc(id)}</span>
<div class="t">${title}</div>${bodyHtml}</div>`;

const swatch = (hex) => (/^#[0-9a-f]{3,8}$/i.test(hex ?? '') ? `<span class="swatch" style="background:${hex}"></span>` : '');
const pair = (light, dark) => `${swatch(light)}${code(light ?? '?')} / ${swatch(dark)}${code(dark ?? '?')}`;


// ---------------------------------------------------------------------------------------------
// страница 1 — вопросы, которые решает человек
// ---------------------------------------------------------------------------------------------

const find = (name) => data.findings.find((f) => f.name === name);
const values = (name) => {
  const f = find(name);
  return f?.swap?.ours ? pair(f.swap.ours.light, f.swap.ours.dark) : '';
};


/*
 * Русский текст вопросов. Базлайн остаётся английским - он читается гейтом и живёт рядом с кодом,
 * - а страница уходит дизайну, поэтому текст здесь. Дублирование удерживается проверкой ниже:
 * запись без перевода роняет генерацию, а не выходит на страницу по-английски.
 */
const RU = {
  'gallery-nav-button-bg': 'Content-роль использована как <b>подложка</b> под навигационными кнопками поверх картинок. Bg-роли с таким значением в пакете нет, а сам пакет красит этой ролью глиф стрелки, а не диск под ним. Вопрос: нужна ли отдельная роль затемняющей подложки, или диск берёт существующую bg-роль и меняет тон.',
  'gallery-nav-button-bg-disabled': 'Тот же вопрос о подложке, неактивное состояние.',
  'switch-on-border-focused': 'Два соседа по трио (покой и наведение) уже переведены на border-роли равнозначно. Третий не переведён: <code>border-primary-shared-active</code> совпадает в светлом и <b>двигает тёмный</b> — #003c70 → #005397. Вопрос: принимаем сдвиг ради однородности трио.',
  'tree-view-checkbox-border-disabled': 'Content-роль красит <code>border-color</code>. Пакет для чекбокса разводит их: рамке неактивного состояния он даёт <code>border-disabled</code> (#d7d7d7 / #4c4c4c), заметно светлее нашего #ababab / #767676. Это прямой ответ на вопрос из журнала: 06.08 одно значение разложили на три роли и записали, что совпадение «видно в коде» — вот чем оно должно было разойтись.',
  'accordion-title-bg': 'Наведение и нажатие читают одну роль: нажать на заголовок аккордеона выглядит ровно как навести. Fluent 2 здесь однозначен — <code>colorSubtleBackgroundHover</code> #f5f5f5 и <code>colorSubtleBackgroundPressed</code> #e0e0e0 у него разные токены, и пакет несёт оба значения как <code>bg-hovered</code> / <code>bg-active</code>. Не применили только потому, что приведение уводит пиксель от legacy-fluent, а это решение продукта (NFR-1).',
  'tile-view-bg': 'Покой и наведение — одно значение, а нажатие отличается. Слот явно задуман с лестницей, плоская у него ступень наведения. Доказательство слабее, чем у аккордеона: плитка не обязана вести себя как «subtle surface» из Fluent 2.',
  '.dx-splitter .dx-resize-handle': 'Грип ресайза даёт <b>2.8 в тёмном</b> при пороге 3:1 для нетекстового элемента управления. Проходящая роль есть — <code>content</code> даёт 4.54, — но она же делает грип заметно темнее в светлом (6 → 11.15). Пол задаёт стандарт, выбор роли — нет.',
  'tabs-tab-border-disabled': 'Единственный член собственной лестницы не на border-роли: <code>selected-active</code>, <code>selected-hovered</code>, <code>selected-focused</code>, <code>active</code> и <code>hovered</code> читают <code>border-*</code>, и только <code>disabled</code> — <code>content-disabled</code>.<br><b>Варианты:</b> ① <code>border-disabled</code> — лестница становится согласованной, индикатор бледнеет с #ababab / #767676 до #d7d7d7 / #4c4c4c, что для неактивного состояния и ожидается; ② оставить и записать как осознанное исключение. Рекомендация — ①: это следование собственной лестнице, а не смена вкуса.',
  'load-indicator-segment-inner-border': 'Внутренняя рамка лоад-индикатора красится <code>bg-primary-subtle</code>, потому что border-роли с этой насыщенностью в пакете <b>не существует</b>. Менять не на что — нужна роль <code>border-primary-subtle</code>.',
  '.dx-messagelist-context-menu-content .dx-menu-item:has(.dx-icon-trash).dx-state-focused': 'Пункт удаления в контекстном меню списка сообщений даёт <b>3.05</b> при пороге 4.5 для подписи. Проверены все роли семейства: самая сильная, <code>content-danger-hovered</code>, даёт на той же поверхности 3.87 — тоже провал. Нет danger-content роли, проходящей AA на своей же наведённой поверхности в тёмном.',
};
const ruText = (key) => {
  const text = RU[key];
  if (!text) throw new Error(`нет русского текста для "${key}" - добавьте в RU в tools/review/roles-pages.mjs`);
  return text;
};

let n = 0;
const num = (prefix) => `${prefix}${++n}`;

// --- A. дизайн: роль выбрана спорно
n = 0;
const design = base.open.filter((x) => x.decision === 'design');
const roleQs = design.map((x) => {
  const f = find(x.name);
  const near = (f?.near ?? []).slice(0, 2)
    .map((c) => `${code(c.role.replace(/^color-/, ''))} — двигает ${c.moves.join(' и ')}`).join('<br>');
  return q(num('Д'), `${code(x.name)} = ${roleList(x.roles)}`,
    `<p class="meta">Значение сейчас: ${values(x.name) || '—'}</p>`
    + `<p>${ruText(x.name)}</p>`
    + (near ? `<p class="opt"><b>Ближайшие роли верного семейства:</b><br>${near}</p>` : ''));
});

const ladderQs = base.ladders.filter((x) => x.decision === 'design').map((x) => q(num('Д'),
  `${code(x.stem)} — состояния ${x.states.map((s2) => code(s2)).join(' = ')} дают одну роль ${roleList(x.role)}`,
  `<p>${ruText(x.stem)}</p>`));

const contrastQs = base.contrast.filter((x) => x.decision === 'design').map((x) => q(num('Д'),
  `Контраст: ${code(x.selector)}`,
  `<p class="meta">${code(x.fgRole.replace(/^color-/, ''))} на ${code(x.bgRole.replace(/^color-/, ''))} — `
  + `светлый <b>${x.contrast.light}</b>, тёмный <b class="warn">${x.contrast.dark}</b></p>`
  + `<p>${ruText(x.selector)}</p>`));

const slotQs = base.slotLies.filter((x) => x.decision === 'design').map((x) => q(num('Д'),
  `${code(x.name)} — слот обещает ${code(x.slotSays)}, красит ${x.paints.map(code).join(', ')}`,
  `<p>${ruText(x.name)}</p>`));

const conceptRows = base.concepts.filter((x) => x.decision === 'design').map((c) => q(num('Д'),
  `Одно понятие, разные роли: <b>${esc(c.concept)}</b>`,
  `<p class="meta">Семейства: ${c.families.join(' / ')}</p><table><tr><th>Компонент</th><th>Роль</th></tr>`
  + c.members.map((m) => `<tr><td>${esc(m.folder)}</td><td>${code(m.role.replace(/^color-/, ''))}</td></tr>`).join('')
  + '</table><p>Вопрос: должны ли эти компоненты красить одно и то же одинаково, и если да — какой ролью.</p>'));

// --- B. заявки в пакет
n = 0;
const pkgQs = [...base.open, ...base.contrast].filter((x) => x.decision === 'package-gap')
  .map((x) => q(num('П'), code(x.name ?? x.selector), `<p>${ruText(x.name ?? x.selector)}</p>`));

// --- C. унификация
n = 0;
const spellQs = base.concepts.filter((x) => x.decision === 'spelling').map((c) => q(num('У'),
  `<b>${esc(c.concept)}</b> — один цвет записан ${c.roles.length} ролями`,
  `<p>${roleList(c.roles)}</p><p>Правка ничего не двигает. Нужно назвать каноническую запись.</p>`));

// --- D. переименование
const renames = base.slotLies.filter((x) => x.decision === 'naming');

// --- E. неиспользуемые роли
n = 0;
const famOf = (r) => r.replace(/-(hovered|active|selected|disabled|read-only)$/, '');
const groups = new Map();
for (const u of data.unusedRoles.capability) {
  const k = famOf(u.role);
  if (!groups.has(k)) groups.set(k, { roles: [], sets: new Set() });
  groups.get(k).roles.push(u.role);
  u.sets.forEach((x) => groups.get(k).sets.add(x));
}
const notable = [...groups].filter(([k]) => /focus|on-color|-info|static/.test(k));
const unusedQs = [
  q(num('Н'), 'Индикатор фокуса — четыре роли пакета не читаются нигде',
    `<p>${roleList(['color-focus', 'color-focus-inverted', 'color-focus-static', 'color-focus-static-inverted'])}</p>`
    + '<p>Тема красит фокус ролью границы <code>border-primary-shared</code>. Fluent 2 рисует фокус '
    + '<b>двухтонной обводкой</b> — <code>colorStrokeFocus1</code> #ffffff внутри '
    + '<code>colorStrokeFocus2</code> #000000, — чтобы она выживала на любом фоне. Это не оттенок в '
    + 'сторону, а другой механизм. Вариантов <code>inverted</code> и <code>static</code> у темы нет вовсе.</p>'),
  q(num('Н'), 'Интент <code>info</code> не используется',
    `<p>Пакет назначает ${roleList(['color-bg-info', 'color-content-info', 'color-border-info'])} и их состояния. `
    + 'Тема не читает ни одной: компоненты с модификатором <code>info</code> (informer, toast, pagination) '
    + 'красят его нейтральными ролями.</p>'),
  q(num('Н'), 'Лестница «на цветной поверхности» (<code>on-color</code>) не используется',
    `<p>${roleList(['color-content-on-color', 'color-content-on-color-shared', 'color-content-on-color-subtler', 'color-bg-on-color', 'color-bg-on-color-alpha', 'color-border-on-color-shared'])}</p>`
    + '<p>Пакет описывает ими элементы, лежащие на залитой акцентом поверхности — например вариант '
    + '<code>on-surface</code> чекбокса. У темы такого варианта нет.</p>'),
  q(num('Н'), 'Статические роли (<code>static-dark</code> / <code>static-light</code>) не используются',
    '<p>Роли, не меняющиеся между режимами. Тема вместо них берёт <code>content-static-dark</code> '
    + 'в отдельных местах, а поверхностные и границы — нет.</p>'),
];

const noAction = [
  ['confirmed', base.open.filter((x) => x.decision === 'confirmed').length, 'пакет назначает ровно эту роль — расходится только слово слота'],
  ['rule-5', base.open.filter((x) => x.decision === 'rule-5').length + base.slotLies.filter((x) => x.decision === 'rule-5').length, 'одно значение в двух свойствах, названо по доминирующей роли; принято ревью-раундом 2'],
  ['hairline', base.slotLies.filter((x) => x.decision === 'hairline').length, 'волосяная линия фоном сохраняет border-роль; подтверждено core (у tabs это слот selector)'],
  ['no-rung', base.ladders.filter((x) => x.decision === 'no-rung').length, 'состояния схлопнуты там же, где их схлопывает сама система'],
  ['shade', base.concepts.filter((x) => x.decision === 'shade').length, 'то же семейство, другой оттенок — расхождение, которое компоненты вправе иметь'],
  ['graphic-ok', base.contrast.filter((x) => x.decision === 'graphic-ok').length, 'глиф, порог 3:1 взят'],
  ['bridge / known', 2, 'уже инвентаризовано в BRIDGES.md и DIVERGENCES.md'],
  ['stale в наборах соседей', data.unusedRoles.stale.length, 'blazor и wpf ссылаются на имена, которых семантический слой не объявляет — их дрейф, не наш'],
];


// --- Ж. покрытие и как его поднять
const ncCount = data.summary.byVerdict['no-counterpart'];
const ncPct = (ncCount / data.summary.declarations * 100).toFixed(1);
const ncByFolder = {};
for (const f of data.findings) {
  if (f.package?.verdict !== 'no-counterpart') continue;
  ncByFolder[f.folder] = (ncByFolder[f.folder] ?? 0) + 1;
}
const cov = base.coverage;
let running = ncCount;
const ladder = cov.levers.filter((l) => l.status !== 'сделано').map((l) => {
  running -= l.covers;
  return `<tr><td>${esc(l.id)}</td><td>${esc(l.lever)}</td><td>−${l.covers}</td>`
    + `<td>${running} (${(running / data.summary.declarations * 100).toFixed(1)}%)</td></tr>`;
}).join('');

const coverageSection = `
<p><b>${ncCount} цветовых объявлений из ${data.summary.declarations} — ${ncPct}% темы — сравнивать не с чем.</b>
Это компоненты, которых нет ни у core, ни у vnext, ни у blazor, ни у wpf в пакете токенов. По ним
работали только проверки темы против себя самой: семейство, слот против свойства, лестницы состояний,
контраст и согласованность понятий между компонентами.</p>
<table><tr><th>Папка</th><th>Объявлений</th></tr>
${Object.entries(ncByFolder).sort((a, b2) => b2[1] - a[1])
    .map(([f, c]) => `<tr><td>${esc(f)}</td><td>${c}</td></tr>`).join('')}
</table>

<h3>Чем это сокращается — измерено ${esc(cov.measuredOn)}</h3>
<p>Числа сняты по репозиториям за пределами этого, поэтому инструмент их не пересчитывает: они
забанкованы вместе с источником и протухнут заметно, если прочитать их рядом со свежим счётчиком выше.</p>
${cov.levers.map((l) => q(l.id, `${esc(l.lever)} — ${l.status === 'сделано' ? '<b>сделано</b>' : `покрывает ${l.covers}`}`,
    `<p>${esc(l.detail)}</p>`
    + (l.status === 'сделано' ? '' : `<p class="meta"><b>Что нужно:</b> ${esc(l.needs)}</p>`))).join('')}

<h3>Куда это приводит</h3>
<table><tr><th></th><th>Рычаг</th><th>Покрывает</th><th>Останется</th></tr>
<tr><td>—</td><td>сейчас</td><td></td><td>${ncCount} (${ncPct}%)</td></tr>
${ladder}</table>
<p>Ниже этого не опускается: <b>${cov.floor.declarations} объявлений</b> в папках
${cov.floor.folders.map((f) => `<code>${esc(f)}</code>`).join(', ')}. ${esc(cov.floor.why)}</p>
${cov.rejected.map((r) => `<p class="meta"><b>Померено и отброшено.</b> ${esc(r.lever)}: ${esc(r.why)}</p>`).join('')}

<h3>Оговорка о самой проверке</h3>
<p>Правки инструмента шли в одну сторону — к меньшему числу находок: конфликтов семейств 11 → 3,
cross-family 24 → 15, кнопочных лестниц 8 → 0. Каждое сокращение проверено вручную и описано в
коммите, но направление у них одно: скорее недосчитал, чем перебрал.</p>
`;


// --- З. согласны ли соседи между собой
const na = base.neighbourAgreement;
const agreementSection = `
<p>Весь аудит сравнивает наши роли с чужими, поэтому он стоит ровно столько, сколько стоит
согласованность самих соседей. Замер ${esc(na.measuredOn)} по четырём наборам пакета: сравнивались
только слоты, у которых <b>полностью совпадает путь анатомии</b> — компонент плюс всё после
<code>color.</code>.</p>
<p><b>Там, где они говорят об одном и том же одними словами, они согласны.</b>
${na.comparableSlots} сравнимых слотов, роль совпадает у ${na.agreeing}
(${(na.agreeing / na.comparableSlots * 100).toFixed(0)}%).</p>
<table><tr><th>Пара</th><th>Общих слотов</th><th>Совпадает</th></tr>
${na.pairs.map((x) => `<tr><td>${esc(x.pair)}</td><td>${x.shared}</td><td>${x.agree}%</td></tr>`).join('')}
</table>
<p class="meta">core и vnext — практически один набор (vnext = core плюс <code>field</code>), поэтому их
100% ничего не доказывают. Значимы пары с blazor и wpf. У пары blazor ↔ wpf всего три общих слота —
это не выборка.</p>

<p><b>Но одними словами они почти ничего не описывают.</b> Пересечение анатомии, а не ролей, —
вот что расходится:</p>
<table><tr><th>Компонент</th><th>Наборы</th><th>Путей всего</th><th>Общих для всех</th></tr>
${na.anatomyOverlap.map((x) => `<tr><td>${esc(x.component)}</td><td class="meta">${esc(x.sets)}</td>`
    + `<td>${x.paths}</td><td>${x.sharedByAll === 0 ? '<span class="warn">0</span>' : x.sharedByAll}</td></tr>`).join('')}
</table>
<p>У <code>button</code> четыреста один путь анатомии на четыре продукта и <b>ноль</b> общих для всех
четырёх. Каждый моделирует свои варианты, суб-элементы и состояния.</p>

<p><b>Расхождений всего ${na.disagreeing}, и ${na.staleNoneSpelling} из них — не расхождения.</b>
Blazor запинен на 262.9.1 и всё ещё пишет <code>bg-none</code> / <code>border-none</code> /
<code>content-none</code> там, где в действующем слое одна роль <code>none</code>. Настоящих
остаётся <b>${na.realDisagreements}</b>:</p>
${na.realExamples.map((x) => `<p><b>${esc(x.what)}.</b> ${esc(x.detail)}</p>`).join('')}

<h3>Что из этого следует для самой проверки</h3>
<p>${esc(na.conclusion)}</p>
<p>Отсюда и устройство сравнения: оно <b>на уровне слота, а не пути</b>. Сравнение по полному пути
нашло бы почти ничего — наша анатомия не совпадает с чужой ровно так же, как их анатомии не
совпадают между собой. Цена этого выбора честная: инструмент отвечает на вопрос «использует ли пакет
эту роль для слота такого рода в этом компоненте», а не «использует ли он её именно здесь». Поэтому
<code>cross-family</code> сформулирован как вопрос, а не как вердикт.</p>
`;


// --- почему контраст не роняет CI
const wc = base.whyContrastDoesNotFailCi;
const whyContrast = `
<div class="q"><span class="id">почему это не ловит CI</span>
<p>Тёмный a11y-прогон существует, и <code>color-contrast</code> в нём включён — но ни одна из
строк выше его не роняет. Причины проверены по исходнику axe-core 4.12.1, а не предположены:</p>
${wc.reasons.map((r) => `<p><b>${esc(r.reason)}.</b> ${esc(r.detail)}<br>`
    + `<span class="meta">Касается: ${esc(r.covers)}</span></p>`).join('')}
<p>${esc(wc.consequence)}</p></div>
`;


// --- нетекстовый контраст (WCAG 1.4.11)
const nt = base.nonTextContrast;
const nonTextSection = `
<div class="q"><span class="id">нетекстовый контраст · WCAG 1.4.11</span>
<div class="t">Порог 3:1 для границ элементов управления и графики</div>
<p>Его не реализует ни одно правило axe и не видит ни один скриншот — в CI его не меряет никто.
Замер ${esc(nt.measuredOn)}, и он появился как проверка того, стоит ли действовать по строке грипа выше.</p>
<table><tr><th>Что</th><th>Пара</th><th>Светлый</th><th>Тёмный</th></tr>
${nt.findings.map((f) => {
    const bad = (v) => (v < 3 ? `<b class="warn">${v}</b>` : v);
    return `<tr><td>${esc(f.what)}</td><td>${code(f.pair)}</td><td>${bad(f.light)}</td><td>${bad(f.dark)}</td></tr>`;
  }).join('')}
</table>
${nt.findings.map((f) => `<p class="meta"><b>${esc(f.what)}:</b> ${esc(f.verdict)}</p>`).join('')}
<p>${esc(nt.consequence)}</p>
<p class="meta"><b>Оговорка:</b> ${esc(nt.comment[3])}</p></div>
`;

const questionsPage = page('Fluent-next: открытые вопросы по ролям', `
<h1>Fluent-next: открытые вопросы по ролям</h1>
<p class="lede">Всё, что аудит нашёл и не стал решать сам. Ответы можно давать номерами: «Д3 — второй вариант».<br>
Проверено ${data.summary.declarations} цветовых объявлений в 64 папках; применено девять правок —
семь равнозначных по значению и две решённые порогом WCAG. Всё на этой странице двигает пиксель,
меняет публичное имя или требует расширения пакета.</p>

<h2>А. Дизайн — ${roleQs.length + ladderQs.length + contrastQs.length + slotQs.length + conceptRows.length} вопросов</h2>
<h3>Роль выбрана спорно</h3>${roleQs.join('')}
<h3>Состояние неотличимо от соседнего</h3>${ladderQs.join('')}
<h3>Контраст ниже порога</h3>${contrastQs.join('')}${nonTextSection}${whyContrast}
<h3>Имя обещает одно, красит другое</h3>${slotQs.join('')}
<h3>Одно понятие покрашено по-разному в разных компонентах</h3>${conceptRows.join('')}

<h2>Б. Команда пакета токенов — ${pkgQs.length} заявки</h2>
<p>Роли, которая нужна, в пакете нет — обменять не на что.</p>${pkgQs.join('')}

<h2>В. Унификация, правка бесплатна — ${spellQs.length}</h2>
<p>Компоненты кладут один и тот же цвет и пишут его ролями из разных семейств. Пока каноническая
запись не выбрана, следующая перепривязка палитры разведёт их молча.</p>${spellQs.join('')}

<h2>Г. Переименование компонентного тира — ${renames.length} имён</h2>
<p>Роль верна, врёт слово в имени.</p>
<p><b>Окно открыто:</b> компонентный тир fluent-next ещё не отгружен, поэтому переименования и
удаления сейчас бесплатны — ни ченджлога, ни цикла устаревания. После релиза каждое такое имя
становится контрактом с приложениями, и та же правка будет стоить депрекации. Это довод сделать
волну до выпуска, а не после.</p>
<p class="meta">Не путать с легаси-38: <code>--dx-toolbar-height</code>,
<code>--dx-font-size-heading-*</code> и ещё пятнадцать имён отгружены с 25.2 и решением 27.08.2026
заморожены — их это окно не касается.</p>
<table><tr><th>Имя</th><th>Слот обещает</th><th>Красит</th></tr>
${renames.map((x) => `<tr><td>${code(x.name)}</td><td>${esc(x.slotSays)}</td><td>${x.paints.map(esc).join(', ')}</td></tr>`).join('')}
</table>
<p class="meta">Четырнадцать из ${renames.length} — filterBuilder: его чипы уходят в базовый
<code>button-color()</code>, который ставит фон, а названы они <code>-content</code>.</p>

<h2>Д. Возможности пакета, которыми тема не пользуется — ${data.unusedRoles.capability.length} ролей</h2>
<p>Счёт от пакета внутрь, а не от наших объявлений наружу: целое семейство может отсутствовать, и при
этом ни одно объявление не выглядит неверным. Из ${data.summary.rolesOffered} ролей, которые
назначают четыре набора, тема читает ${data.summary.rolesRead}.</p>
${unusedQs.join('')}
<details><summary>Полный список ${data.unusedRoles.capability.length} ролей</summary>
<table><tr><th>Роль</th><th>Назначают</th></tr>
${data.unusedRoles.capability.map((u) => `<tr><td>${code(u.role.replace(/^color-/, ''))}</td><td>${u.sets.join(', ')}</td></tr>`).join('')}
</table></details>

<h2>Е. Решения не требуется — записано, чтобы не переоткрывали</h2>
<table><tr><th>Класс</th><th>Сколько</th><th>Почему закрыто</th></tr>
${noAction.map(([k, c, why]) => `<tr><td>${code(k)}</td><td>${c}</td><td>${esc(why)}</td></tr>`).join('')}
</table>

<h2>Ж. Чего эта проверка не видела, и как это сократить</h2>
${coverageSection}

<h2>З. Согласны ли соседи между собой</h2>
${agreementSection}
`);

emit('ROLES_QUESTIONS.html', questionsPage);

// ---------------------------------------------------------------------------------------------
// страница 2 — типографика
// ---------------------------------------------------------------------------------------------

const px = (rem) => (typeof rem === 'string' && rem.endsWith('rem') ? `${parseFloat(rem) * 16}px` : String(rem));
const offGrid = data.typography.filter((t) => !t.roles.length);
const onGrid = data.typography.filter((t) => t.roles.length);

const byStep = new Map();
for (const t of offGrid) {
  const k = `${t.family}-${t.step}`;
  if (!byStep.has(k)) byStep.set(k, []);
  byStep.get(k).push(t);
}
const order = ['font-weight', 'font-size', 'line-height'];
const stepGroups = [...byStep.entries()].sort((a, b) => order.indexOf(a[1][0].family) - order.indexOf(b[1][0].family)
  || b[1].length - a[1].length);

// одно исключение: имя файла это данные, а не заголовок
const WEIGHT_400 = new Set(['file-uploader-file-name-font-weight']);

n = 0;
const weightPlaces = byStep.get('font-weight-500') ?? [];
const weightQ = q(num('Т'), `<code>font-weight: 500</code> — ${weightPlaces.length} мест`,
  '<p>Ближайшие роли: <b>400</b> (Regular) и <b>600</b> (Semibold). Промежуточного веса у Fluent 2 нет, '
  + 'и у Segoe UI грани 500 тоже нет — на Windows эти места уже сегодня рендерятся как Regular 400, '
  + 'просто непредсказуемо по платформам.</p>'
  + '<p>Почти всё это заголовки групп, метки и подписи, то есть элементы с усилением. Колонка '
  + '«предложение» — наша рекомендация, не решение.</p>'
  + '<table><tr><th>Где</th><th>Переменная</th><th>Предложение</th></tr>'
  + weightPlaces.map((t) => `<tr><td>${code(t.where.replace('scss/widgets/fluent-next/', ''))}</td>`
    + `<td>${code(t.variable)}</td><td>${WEIGHT_400.has(t.variable) ? '<b>400</b> — имя файла это данные, не заголовок' : '600'}</td></tr>`).join('')
  + '</table>');

const headingQ = q(num('Т'), 'Рампа заголовков — 4 места, следствие на все приложения',
  '<p>Самое дорогое решение: <code>--dx-font-size-heading-1…6</code> — публичные переменные, их читают приложения.</p>'
  + '<table><tr><th></th><th>h1</th><th>h2</th><th>h3</th><th>h4</th><th>h5</th><th>h6</th></tr>'
  + '<tr><td>сейчас, <b>default</b></td><td>40 ✓</td><td class="warn">36</td><td>32 ✓</td>'
  + '<td class="warn">26</td><td class="warn">22</td><td class="warn">22</td></tr>'
  + '<tr><td>сейчас, <b>compact</b></td><td>32 ✓</td><td>28 ✓</td><td>24 ✓</td><td>20 ✓</td><td>16 ✓</td><td>16 ✓</td></tr>'
  + '<tr><td><b>Fluent 2</b> / сетка ролей</td><td>40</td><td>32</td><td>28</td><td>24</td><td>20</td><td>16</td></tr>'
  + '</table><p class="meta">✓ — значение уже лежит на роли.</p>'
  + '<p><b>Compact-ветка целиком на сетке, а default — нет.</b> У default совпадают только h1 и h3. '
  + 'Если привести default к той же логике, что уже действует в compact, получится ровно ряд Fluent 2: '
  + '40 / 32 / 28 / 24 / 20 / 16. Цена: h2 36→32, h4 26→24, h5 22→20, h6 22→16 — последнее самое заметное.</p>'
  + '<p class="meta">Отдельно: <code>$typography-s-font-size</code> (18px) формально попадает в список, но это '
  + '<b>утилита</b> <code>.dx-font-sm</code>, а не текстовая роль — в коде так и написано, что ряд xl/l/m/s/xs '
  + 'намеренно сидит на базовой шкале. Трогать не предлагаем.</p>');

const sizeGroups = stepGroups.filter(([k]) => k.startsWith('font-size') && !k.endsWith('-500'));
const sizeRows = sizeGroups.flatMap(([, places]) => places)
  .filter((t) => !t.where.includes('typography/_sizes.scss'));
const sizeQ = q(num('Т'), `Одиночные размеры компонентов — ${sizeRows.length} мест`,
  '<table><tr><th>Где</th><th>Переменная</th><th>Сейчас</th><th>Вниз</th><th>Вверх</th></tr>'
  + sizeRows.map((t) => {
    const below = t.nearest.filter((x) => x.step < t.step).sort((a, b) => b.step - a.step)[0];
    const above = t.nearest.filter((x) => x.step > t.step).sort((a, b) => a.step - b.step)[0];
    const fmt = (r) => (r ? `${r.step / 10}px <code>${r.role}</code>` : '—');
    return `<tr><td>${code(t.where.replace('scss/widgets/fluent-next/', ''))}</td><td>${code(t.variable)}</td>`
      + `<td>${t.step / 10}px</td><td>${fmt(below)}</td><td>${fmt(above)}</td></tr>`;
  }).join('')
  + '</table><p>Большая часть — scheduler. Если решение по нему будет одно («округляем вниз» или «вверх»), '
  + 'оно закроет список почти целиком.</p>');

const lhRows = stepGroups.filter(([k]) => k.startsWith('line-height')).flatMap(([, v]) => v);
const lhQ = q(num('Т'), `<code>line-height</code> вне сетки — ${lhRows.length} мест`,
  '<p>Оговорка: шкала межстрочного у пакета <b>не полностью</b> повторяет Fluent 2 — у Fluent 2 есть 22 и 26, '
  + 'у пакета вместо них 24 и 28. Наши значения 12 и 18 не встречаются ни там, ни там.</p>'
  + '<table><tr><th>Где</th><th>Переменная</th><th>Сейчас</th><th>Ближайшая роль</th></tr>'
  + lhRows.map((t) => {
    const near = t.nearest.slice(0, 2).map((r) => `${r.step / 10}px <code>${r.role}</code>`).join(' · ');
    return `<tr><td>${code(t.where.replace('scss/widgets/fluent-next/', ''))}</td><td>${code(t.variable)}</td>`
      + `<td>${t.step / 10}px</td><td>${near}</td></tr>`;
  }).join('')
  + '</table><p>У большинства межстрочное <b>меньше самой низкой роли</b>. Три из них — аппойнтменты scheduler '
  + 'на 10 и 15 минут, где высота строки прижата к высоте ячейки: там 12→14 может не поместиться, это надо '
  + 'смотреть на макете, а не решать по таблице.</p>');

const unmarked = onGrid.filter((t) => !t.marker);
const onGridQ = q(num('Т'), `Роль существует, а тема читает ступень — ${onGrid.length} мест`,
  '<p>Здесь значение <b>не меняется</b>: роль, называющая эту ступень, резолвится в неё же. Перевод '
  + 'равнозначен по построению. Решить нужно только, <b>какая</b> роль — на одной ступени их бывает '
  + 'несколько (caption / base / title), и это выбор смысла, а не значения.</p>'
  + `<p class="meta">${unmarked.length} из них не несут даже маркера: гейт <code>px-audit</code> смотрит только `
  + 'на литералы, а чтение ступени — не литерал, поэтому они не доезжали ни до SCALES.md, ни до дизайна.</p>'
  + '<table><tr><th>Где</th><th>Переменная</th><th>Читает</th><th>Роли с этой ступенью</th><th>Маркер</th></tr>'
  + onGrid.map((t) => `<tr><td>${code(t.where.replace('scss/widgets/fluent-next/', ''))}</td>`
    + `<td>${code(t.variable)}</td><td>${t.step / 10}px</td>`
    + `<td>${t.roles.map(code).join(' · ')}</td>`
    + `<td>${t.marker ? code(t.marker) : '<span class="warn">нет</span>'}</td></tr>`).join('')
  + '</table>');

const typoPage = page('Fluent-next: типографика вне ролевой сетки', `
<h1>Fluent-next: типографика вне ролевой сетки</h1>
<p class="lede">Материал к <a href="https://github.com/DevExpress/design/issues/1555">design#1555</a>.
${offGrid.length} мест вне сетки и ещё ${onGrid.length}, где роль есть, а тема читает ступень.<br>
Типографика не зависит от режима — у каждого места одно значение, светлая и тёмная темы одинаковы.</p>

<h2>Главное: карточка сформулирована в обратную сторону</h2>
<p>design#1555 спрашивает, «каким ступеням нужны семантические роли». Сверка с Fluent 2 показывает,
что вопрос не к пакету:</p>
<ul>
<li>веб-рампа Fluent 2 знает <b>три начертания</b> — Regular, Semibold, Bold. <b>Medium (500) в ней нет</b>;</li>
<li>её размеры — <b>10 / 12 / 14 / 16 / 20 / 24 / 28 / 32 / 40 / 68 px</b>, и сетка ролей пакета
повторяет их точно, кроме Display 68.</li>
</ul>
<p>Ни <code>font-weight: 500</code>, ни размеры 11 / 18 / 22 / 26 / 30 / 36 px в Fluent 2 не существуют.
Пакет верен источнику. Все эти места — <b>значения, унаследованные от legacy-темы fluent</b>, которые
миграция сохранила по требованию «визуально это тот же fluent» (NFR-1).</p>
<p>Решать нужно не «расширять ли пакет», а <b>что важнее в каждом месте: совпадение с legacy или
соответствие Fluent 2</b>.</p>

<h2>Решения</h2>
${weightQ}${headingQ}${sizeQ}${lhQ}${onGridQ}

<h2>Если решения приняты</h2>
<p>Правки механические, значения меняются ровно в перечисленных строках, режимы не расходятся.
После них потребуется пересъёмка эталонов скриншотов затронутых компонентов — отдельный проход,
а не «заодно».</p>
`);

emit('ROLES_TYPOGRAPHY.html', typoPage);

if (checkOnly) {
  if (!stale.length) console.log('страницы совпадают с данными');
  else {
    console.error(`страницы устарели: ${stale.join(', ')}`);
    console.error('перегенерируйте: node tools/review/roles-pages.mjs');
    process.exit(1);
  }
}
