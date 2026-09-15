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
@media (prefers-color-scheme: dark) { :root:not([data-mode]) { --fg:#f5f5f5; --bg:#242424;
        --muted:#a1a1a1; --line:#4c4c4c; --accent:#4b90d9; --warn:#e4554f; --panel:#1d1d1d; } }
:root[data-mode="dark"] { color-scheme: dark; --fg:#f5f5f5; --bg:#242424; --muted:#a1a1a1;
        --line:#4c4c4c; --accent:#4b90d9; --warn:#e4554f; --panel:#1d1d1d; }
:root[data-mode="light"] { color-scheme: light; }
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

/* --- переключатель режима ---------------------------------------------------------------- */
.modebar { position:sticky; top:0; z-index:9; display:flex; gap:.5rem; align-items:center;
     justify-content:flex-end; padding:.5rem 0 .6rem; margin:-1rem 0 1rem;
     background:var(--bg); border-bottom:1px solid var(--line); }
.modebar span { color:var(--muted); font-size:.85em; margin-right:auto; }
.modebar button { font:inherit; font-size:.85em; padding:.3em .9em; cursor:pointer;
     border:1px solid var(--line); background:var(--panel); color:var(--fg); border-radius:4px; }
.modebar button[aria-pressed="true"] { border-color:var(--accent); color:var(--accent); font-weight:600; }

/* --- образцы: каждый узел несёт оба значения, режим выбирает ------------------------------ */
.sp { margin:.8rem 0 .3rem; }
.sp-row { display:flex; flex-wrap:wrap; gap:.7rem; align-items:flex-start; }
.sp-tile { flex:0 0 auto; text-align:center; font-size:.78em; color:var(--muted); max-width:11rem; }
.sp-stage { display:flex; align-items:center; justify-content:center; width:9.5rem; height:4.6rem;
     border:1px solid var(--line); border-radius:4px; overflow:hidden; margin-bottom:.3rem; }
.sp-cap { line-height:1.35; }
.sp-cap b { color:var(--fg); font-weight:600; display:block; }
.sp-num { font:.95em ui-monospace, Menlo, monospace; }
.sp-num.bad { color:var(--warn); font-weight:600; }
.v { background:var(--l-bg, transparent); color:var(--l-fg, inherit);
     border-color:var(--l-bd, transparent); }
:root[data-mode="dark"] .v { background:var(--d-bg, transparent); color:var(--d-fg, inherit);
     border-color:var(--d-bd, transparent); }
.only-light { display:inline; } .only-dark { display:none; }
:root[data-mode="dark"] .only-light { display:none; }
:root[data-mode="dark"] .only-dark { display:inline; }
/* Только width и style: сокращённое border сбросило бы цвет в currentColor и перебило бы
   .v, которое идёт выше - образец тогда рисует край не той ролью, а цветом подписи. */
.sp-chip { min-width:5.2rem; padding:.4em .8em; border-width:1px; border-style:solid; border-radius:4px;
     font-size:.95em; white-space:nowrap; }
.sp-box { width:1.35rem; height:1.35rem; border-width:1.5px; border-style:solid; border-radius:3px;
     display:flex; align-items:center; justify-content:center; font-size:.95rem; line-height:1; }
.sp-ring { width:1.35rem; height:1.35rem; border-width:1.5px; border-style:solid; border-radius:50%;
     display:flex; align-items:center; justify-content:center; }
.sp-dot { width:.6rem; height:.6rem; border-radius:50%; }
.sp-disc { width:2.2rem; height:2.2rem; border-radius:50%; display:flex; align-items:center;
     justify-content:center; font-size:1.05rem; }
.sp-bar { width:.55rem; height:100%; display:flex; align-items:center; justify-content:center; }
.sp-grip { width:.18rem; height:1.1rem; border-radius:1rem; }
.sp-pane { flex:1; height:100%; }
.sp-sheet { width:100%; height:100%; display:flex; align-items:center; justify-content:center;
     gap:.4rem; font-size:.9em; }
.sp-line { width:100%; height:1px; }
.sp-glyph { font-size:1.3rem; line-height:1; }
/* Символ галочки в части шрифтов подхватывается как эмодзи и рисуется своим цветом - образец
   тогда врёт ровно про то, ради чего он нарисован. Рисуем фигурой от currentColor. */
.sp-tick { width:.32rem; height:.62rem; border:solid currentColor; border-width:0 2px 2px 0;
     transform:rotate(45deg); margin-top:-.16rem; }
.sp-dash { width:.62rem; height:2px; background:currentColor; }
`;

const page = (title, bodyHtml) => `<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${CSS}</style></head>
<body><main>
<div class="modebar"><span>Образцы нарисованы значениями темы. Переключатель меняет и страницу, и их.</span>
<button type="button" data-set="light" aria-pressed="false">Светлый</button>
<button type="button" data-set="dark" aria-pressed="false">Тёмный</button>
<button type="button" data-set="" aria-pressed="false">Как в системе</button></div>
${bodyHtml}
<footer>Сгенерировано <code>node tools/review/roles-pages.mjs</code> ·
пакет <code>@devexpress/design-tokens-internal@${data.summary.tokensVersion}</code> ·
данные: <code>tools/review/roles.mjs</code> + <code>tests/roles.baseline.json</code> ·
править руками не нужно, перегенерируйте.</footer>
</main>
<script>
(() => {
  const root = document.documentElement;
  const KEY = 'fluent-next-roles-mode';
  const apply = (mode) => {
    if (mode) root.setAttribute('data-mode', mode); else root.removeAttribute('data-mode');
    for (const b of document.querySelectorAll('.modebar button')) {
      b.setAttribute('aria-pressed', String((b.dataset.set || '') === (mode || '')));
    }
  };
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { saved = null; }
  apply(saved || '');
  for (const b of document.querySelectorAll('.modebar button')) {
    b.addEventListener('click', () => {
      const mode = b.dataset.set || '';
      apply(mode);
      try { localStorage.setItem(KEY, mode); } catch (e) { /* приватное окно - переживём */ }
    });
  }
})();
</script>
</body></html>
`;

/* Вопрос рисуется вместе со своим образцом: SPECIMEN ниже заведён по постоянному номеру,
 * так что закрытие вопроса уносит образец само, без отдельной уборки. */
const drawn = new Set();
const q = (id, title, bodyHtml) => {
  const specimen = SPECIMEN[id];
  if (specimen) drawn.add(id);
  return `<div class="q"><span class="id">${esc(id)}</span>
<div class="t">${title}</div>${bodyHtml}${specimen ? specimen() : ''}</div>`;
};

const swatch = (hex) => (/^#[0-9a-f]{3,8}$/i.test(hex ?? '') ? `<span class="swatch" style="background:${hex}"></span>` : '');
const pair = (light, dark) => `${swatch(light)}${code(light ?? '?')} / ${swatch(dark)}${code(dark ?? '?')}`;

/* ------------------------------------------------------------------------------------------
 * Образцы.
 *
 * Рисуются настоящими значениями темы: hex берётся из палитры, которую печатает
 * tools/review/roles.mjs, поэтому картинка и число под ней разойтись не могут. Оба режима
 * лежат в разметке одновременно (--l-* и --d-*), переключатель меняет только data-mode на
 * корне - страница остаётся одним файлом и работает без сети.
 * ---------------------------------------------------------------------------------------- */
/* Восемь знаков - это альфа-роль: значение вида #rrggbbaa. Мерить её как есть нельзя, она
 * ничего не значит без того, что под ней, поэтому сначала накладываем на поверхность. */
const hexOf = (value, under = null) => {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(String(value ?? '').trim());
  if (!m) return null;
  const body = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
  const rgb = [0, 2, 4].map((i) => parseInt(body.slice(i, i + 2), 16));
  if (body.length !== 8) return rgb;
  const alpha = parseInt(body.slice(6, 8), 16) / 255;
  if (!under) return null;
  return rgb.map((channel, i) => Math.round(alpha * channel + (1 - alpha) * under[i]));
};
const lum = (rgb) => {
  const [r, g, b] = rgb.map((ch) => {
    const c = ch / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
/* Роль -> значение. Литерал, начинающийся с #, и transparent проходят как есть: образцам
 * нужны и цвета, которых у пакета нет ролью. Неизвестная роль роняет генерацию, а не
 * рисуется пустотой - молчаливо белый образец хуже отсутствующего. */
const val = (role, mode) => {
  if (!role) return null;
  if (String(role).startsWith('#') || role === 'transparent') return role;
  const found = data.palette?.[role]?.[mode];
  if (!found) throw new Error(`нет значения роли "${role}" в режиме ${mode} - проверьте палитру`);
  return found;
};
const vars = ({ bg, fg, bd }) => ['l', 'd'].flatMap((k) => {
  const mode = k === 'l' ? 'light' : 'dark';
  return [
    bg ? `--${k}-bg:${val(bg, mode)}` : '',
    fg ? `--${k}-fg:${val(fg, mode)}` : '',
    bd ? `--${k}-bd:${val(bd, mode)}` : '',
  ].filter(Boolean);
}).join(';');

/* Контраст пары ролей, отдельно в каждом режиме: видно то число, которое относится к тому,
 * что сейчас на экране. Порог печатается рядом, чтобы читателю не приходилось его помнить. */
const ratios = (fg, bg, floor, surface = 'color-bg') => ['light', 'dark'].map((mode) => {
  const under = hexOf(val(surface, mode));
  const b = hexOf(val(bg, mode), under);
  const a = hexOf(val(fg, mode), b ?? under);
  if (!a || !b) return '';
  const r = ratio(a, b);
  const bad = floor && r < floor;
  return `<span class="only-${mode} sp-num${bad ? ' bad' : ''}">${r}${floor ? ` / ${floor}` : ''}</span>`;
}).join('');

const tile = (caption, stageHtml, note = '', surface = 'color-bg') => `<div class="sp-tile">`
  + `<div class="sp-stage v" style="${vars({ bg: surface })}">${stageHtml}</div>`
  + `<div class="sp-cap"><b>${caption}</b>${note}</div></div>`;
const row = (tiles) => `<div class="sp"><div class="sp-row">${tiles.join('')}</div></div>`;

const chip = (o) => `<span class="sp-chip v" style="${vars(o)}">${esc(o.text ?? 'Кнопка')}</span>`;
const MARK = { tick: '<span class="sp-tick"></span>', dash: '<span class="sp-dash"></span>' };
const box = (o) => `<span class="sp-box v" style="${vars(o)}">${MARK[o.mark] ?? o.mark ?? ''}</span>`;
const ring = (o) => `<span class="sp-ring v" style="${vars({ bd: o.bd })}">`
  + `<span class="sp-dot v" style="${vars({ bg: o.fill })}"></span></span>`;
const disc = (o) => `<span class="sp-disc v" style="${vars(o)}">${o.mark ?? '›'}</span>`;
const glyph = (o) => `<span class="sp-glyph v" style="${vars({ fg: o.fg })}">${o.mark ?? '◈'}</span>`;
const splitter = (o) => `<span class="sp-pane v" style="${vars({ bg: o.pane })}"></span>`
  + `<span class="sp-bar v" style="${vars({ bg: o.bar })}">`
  + (o.grip ? `<span class="sp-grip v" style="${vars({ bg: o.grip })}"></span>` : '')
  + '</span>'
  + `<span class="sp-pane v" style="${vars({ bg: o.pane })}"></span>`;
const sheet = (o) => `<span class="sp-sheet v" style="${vars({ bg: o.bg, fg: o.fg })}">${esc(o.text ?? 'Текст')}</span>`;
const gridLines = (o) => '<span style="width:72%">'
  + `<span class="sp-line v" style="${vars({ bg: o.weak })};display:block;margin:.4rem 0"></span>`
  + `<span class="sp-line v" style="${vars({ bg: o.strong })};display:block;height:2px;margin:.4rem 0"></span>`
  + `<span class="sp-line v" style="${vars({ bg: o.weak })};display:block;margin:.4rem 0"></span></span>`;


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
  'tabs-tab-border-disabled': 'Единственный член собственной лестницы не на border-роли: <code>selected-active</code>, <code>selected-hovered</code>, <code>selected-focused</code>, <code>active</code> и <code>hovered</code> читают <code>border-*</code>, и только <code>disabled</code> — <code>content-disabled</code>.<br><b>Варианты:</b> ① <code>border-disabled</code> — лестница становится согласованной, индикатор бледнеет с #ababab / #767676 до #d7d7d7 / #4c4c4c, что для неактивного состояния и ожидается; ② оставить и записать как осознанное исключение. Рекомендация — ①: это следование собственной лестнице, а не смена вкуса.',
  'load-indicator-segment-inner-border': 'Внутренняя рамка лоад-индикатора красится <code>bg-primary-subtle</code>, потому что border-роли с этой насыщенностью в пакете <b>не существует</b>. Менять не на что — нужна роль <code>border-primary-subtle</code>.',
  'invalid bg focused': 'Отвечено. Мерили: всё семейство <code>*-danger-shared</code> разрешается в <b>одно значение</b> через bg, border и content <b>в обоих режимах</b> — это и значит shared. Значит сегмент семейства здесь не несёт цвета, он записывает, <b>каким свойством</b> значение красится. Каноническая запись, стало быть, уже задана собственным правилом слота темы (NAMING M3: семейство следует за красящим свойством), а унификация выбросила бы единственную информацию, которую сегмент несёт. Если пакет когда-нибудь разведёт три роли, каждый элемент поедет за своим семейством — ровно то, ради чего вопрос и заводили. Все участники кластера правилу уже следуют: рамка чекбокса красит <code>border-color</code>, заливка чекбокса — <code>background-color</code>, метка чекбокса это глиф, бейдж — заливка. Единственное исключение — radioButton, который красит и рамку, и точку <b>одной</b> переменной; это не выбор записи, а анатомия, и она вынесена в Д21.<br>В этой строке все три роли действительно один цвет (#76000b светлый / #9d0013 тёмный) — чистый кластер записи и ничего кроме.',
  'invalid bg hovered': 'Тот же ответ, что и по предыдущей строке: записи расходятся не по вкусу, а по красящему свойству, и менять нечего.<br><b>Поправка к самой строке:</b> она <b>не</b> одноцветная. Кроме кластера (#9d0013 / #ee726a) в ней сидит slider на <code>border-danger</code> — другой оттенок. Это расхождение оттенка, а не записи, и прежняя формулировка «правка ничего не двигает» на него не распространялась.',
  'invalid bg rest': 'Тот же ответ.<br><b>Поправка к самой строке:</b> она <b>не</b> одноцветная. Кроме кластера (#c50f1f / #e4554f) в ней gridBase на <code>bg-danger-subtler</code>, progressBar на <code>bg-danger</code> и slider на <code>border-danger</code> — три разных оттенка. Та же поправка, что и в строке наведения.',
  'outlined-button-label': 'Обведённые кнопки — <code>default</code>, <code>success</code>, <code>danger</code> — держат подпись на <code>content-&lt;оттенок&gt;</code>, пока заливка идёт по лестнице <code>bg-&lt;оттенок&gt;-subtler</code> через hovered, focused, selected и active. Подпись это текст, порог 4.5, и <b>ни одно состояние после покоя его не берёт</b>: наведение и фокус 4.02–4.43, selected 3.22–3.78, нажатие 2.94–3.18 в светлом.<br>Blazor поднимает <b>обе</b> стороны: <code>outline-primary-hover-color</code> = <code>content-primary-hovered</code>, <code>-active-color</code> = <code>content-primary-active</code>. Померено — ответ неоднородный: <code>content-primary-hovered</code> на <code>bg-primary-subtler-hovered</code> даёт <b>5.85 / 5.11</b>, проходит в обоих режимах против наших 4.02 / 4.11; а <code>content-primary-active</code> на <code>bg-primary-subtler-active</code> даёт 6.10 / <b class="warn">2.05</b> — меняет светлый на тёмный; <code>content-primary-selected</code> не существует вовсе.<br><b>Варианты:</b> ① взять ступени hovered и focused как у Blazor — доказуемо, оба режима, три роли; ② для selected и active проходящей пары в пакете нет: либо не двигать заливку в этих состояниях, либо заявка в пакет; ③ <code>content-on-subtle-primary</code> — роль, которую пакет держит ровно под эту поверхность и которую мы не читаем нигде, — берёт всё с запасом (10.82 / 16), но она <b>нейтральная, не синяя</b>: подпись перестанет быть акцентной. Рекомендация: ① сейчас, ③ только если дизайн хочет нейтральную подпись.',
  'scheduler-grid-line-strength': 'Базовая разметка рисует <b>две силы линии</b> сетки: <code>$scheduler-base-border-color</code> на каждой ячейке и <code>$scheduler-accent-border-color</code> на границе недели или рабочей недели и на правиле нечётной строки. Наша тема даёт обеим <code>ds.$color-border</code> — акцент, заложенный в разметке, не покрашен.<br>Это не регресс: легаси-fluent схлопывает их так же, и material тоже. Но <b>generic не схлопывает</b> — он вручную разводит пару как базовую границу с альфой 0.6 против акцентной, затемнённой на 10%. То есть различие есть в языке продукта и теряет его только линейка fluent. Пакет несёт ровно ту лестницу, которую generic собирает руками: <code>border-subtle</code> / <code>border</code> / <code>border-contrast</code>, и этот же виджет уже читает <code>border-contrast</code> для разделителя групп.<br><b>Варианты:</b> ① оставить схлопнутым, паритет с легаси, записать как осознанное; ② опустить обычную линию ячейки до <code>border-subtle</code>, оставив границу недели на <code>border</code> — граница сохраняет пиксель, меняется только слабая линия; ③ поднять границу недели до <code>border-contrast</code>, к разделителю групп. Рекомендация — ②, меньший ход, если акцент вообще нужен.',
  '.dx-messagelist-context-menu-content .dx-menu-item:has(.dx-icon-trash).dx-state-focused': 'Заявка расширена 09.09 после вопроса «но в других компонентах danger же как-то проходит». <b>Не проходит.</b> Роль настроена под канву и берёт порог только на ней. В тёмном <code>content-danger</code> это danger-80 #e4554f, и он даёт <b>4.58</b> на канве страницы, <b>4.22</b> на обычной поверхности виджета и <b>3.05</b> на наведённой. То есть запас над 4.5 — 0.08, и он кончается, как только текст ложится на что угодно, кроме канвы.<br>На этой роли <b>одиннадцать</b> переменных темы держат настоящий текст: подпись обведённой danger-кнопки, лента алертов чата, пункт удаления в меню чата, невалидное значение fieldset, ошибка AI-чата в гриде, ошибка информера, две подписи невалидного шага степпера, сообщение невалидного текстового редактора, сообщение валидации и сводка валидации. Каждая из них — 4.22 везде, где у виджета есть собственный фон. Ещё три читают роль для <b>глифа</b> (diagram, filterBuilder, cardView) — там порог 3:1 и 4.22 его берёт.<br><b>Заявка распадается надвое.</b> На обычной поверхности недобор 0.28, и его закрывает <b>одна ступень рампы</b>: danger-70 #ee726a даёт 5.36 — это просьба к пакету подвинуть <code>content-danger</code> в тёмном. На наведённой поверхности не проходит <b>ни одна</b> роль семейства: danger-70 даёт там 3.87 — вот это настоящий пробел. Светлый режим в порядке везде (6.07 на канве, 5.56 на наведении).<br><b>Почему аудит видел одну строку, а не двенадцать:</b> правило-локальная проверка требует оба цвета в одном правиле CSS, а сообщение валидации берёт фон у предка. Третий за день случай того же слепого пятна.',
  'tree-focus-on-disabled-node': 'Нашлось 15.09 <b>клавиатурой, а не чтением кода</b>: стрелки заводят фокус на неактивный узел - дерево его не пропускает, <code>aria-disabled</code> стоит на <code>li</code>, а класс <code>dx-state-focused</code> узел всё равно получает. В дереве <b>с чекбоксами</b> там не красится ничего. Фокусное правило намеренно исключает неактивный чекбокс (его disabled-краска должна побеждать), а базовый миксин красит фокусный фон только у <code>.dx-treeview-item-without-checkbox</code> - значит и у строки нет ничего.<br>Померено на собранном бандле: активный узел в фокусе - рамка чекбокса #005397 / #67a2e1; <b>неактивный узел в фокусе - #d7d7d7 / #4c4c4c, ровно то же, что и без фокуса</b>. Вариант <b>без чекбоксов</b> индикацию даёт: строка берёт <code>bg-hovered</code> #f5f5f5 / #3b3b3b, неактивная она или нет. То есть один виджет несёт два разных контракта фокуса, и в одном из них дыра. Это WCAG 2.4.7: индикатор фокуса исчезает посреди списка.<br><br><b>Роли под это у пакета нет и не должно быть.</b> Сочетания «фокус + неактивно» в наборе нет вообще: есть <code>global.color.focus</code>, <code>-inverted</code>, <code>-static</code>, <code>-static-inverted</code> и <code>global.border-width.focus</code> - и ни одной перекрёстной с состоянием. Потому что дизайн-система отмечает фокус <b>отдельным контуром</b>, а не перекраской контрола. Blazor ровно это и делает: <code>treeview/layout.scss</code> рисует <code>outline</code> на <code>.dxbl-treeview-item-container:focus-visible</code> цветом <code>ds.$color-border-focus</code>, и тот же файл <b>явно гасит</b> собственный фокусный контур чекбокса внутри дерева (<code>--dxbl-checkbox-focused-check-element-frame-outline-color: transparent</code>). generic, material и legacy fluent красят чекбокс без охраны <code>:not(disabled)</code> - индикация у них есть, ценой того, что неактивный контрол выглядит активным.<br><br><b>Варианты:</b> ① дать варианту с чекбоксами тот же фокусный фон строки, который уже есть у варианта без них (<code>--dx-tree-view-bg-focused</code>, <code>bg-hovered</code>) - одно правило, новой роли не нужно, дыра закрывается для любого узла, а покраска чекбокса остаётся дополнительным аффордансом для активных; ② перевести дерево на системный фокус-прямоугольник (<code>--dx-focus-rect-outline</code>, им уже пользуются toolbar, dropDownMenu и pivotGrid) - это в точности модель Blazor, но наш прямоугольник управляется классом, поэтому покажется и по клику мышью, тогда как те три виджета прячут его за <code>:focus-visible</code>; ③ снять охрану <code>:not(.dx-state-disabled)</code> и красить неактивный чекбокс, как делают три другие темы - дешевле всего, но охрану 09.09 завели именно потому, что так контрол врёт про своё состояние. Рекомендация: ① сейчас, ② - вместе со стоящим вопросом про фокус-кольцо, куда относятся и четыре неиспользуемых фокусных роли пакета.<br><br><b>Прецедент нашёлся внутри самой темы</b>, померено 15.09 на живом dxTabs: <b>неактивный таб, получивший фокус, метку фокуса сохраняет</b>. Правило <code>.dx-tabs.dx-state-focused .dx-tab.dx-state-focused</code> красит <code>background-color</code> <b>без</b> охраны <code>:not(.dx-state-disabled)</code>, а соседние disabled-правила красят только <code>color</code>. Замер по порядку: покой прозрачный / #161616, фокус <b>#f5f5f5</b> / #161616, фокус+disabled <b>#f5f5f5</b> / #ababab, только disabled прозрачный / #ababab. То есть метка фокуса это фон, который говорит «ты здесь», неактивность говорит цвет содержимого, и друг друга они не отменяют.<br>И роль та же самая: <code>--dx-tabs-tab-bg-focused</code> и <code>--dx-tree-view-bg-focused</code> оба разрешаются в <code>color-bg-hovered</code>, #f5f5f5 в светлом и #3b3b3b в тёмном. Значит вариант ① не выдумка - это то, что тема уже делает соседним виджетом, и ровно на той роли, которую вариант дерева без чекбоксов уже читает.',
  'invalid-focus-rung': 'Нашлось 15.09 при применении Д26: та же форма на danger-рампе, и по ней никто не решал. Невалидный чекбокс в фокусе читает <code>bg-danger-shared-active</code> / <code>border-danger-shared-active</code>, невалидная радиокнопка - <code>$radio-button-invalid-bg-focused</code> = <code>border-danger-shared-active</code>. Эта ступень тоже не переворачивается: <code>bg-danger-shared</code> идёт #c50f1f → #e4554f между режимами, hovered #9d0013 → #ee726a, а active - только #76000b → #9d0013.<br>Померено на собранном бандле: невалидный чекбокс в фокусе это #9d0013 на поверхности #242424, <b>1.81</b> - против 4.22 у того же контрола в покое. Тот же отказ, что в Д26, только рампой левее.<br><br>Д16 перевёл на ступень hovered <b>primary</b>-семейство и danger не трогал, потому что вопрос был про заливку отмеченного; Д26 перевёл радиокнопку на решения чекбокса, а решение чекбокса для невалидного - ступень active, и радиокнопка его унаследовала. Выбора никто не делал.<br><br><b>Варианты:</b> ① симметричная правка - невалидный фокус берёт ступень hovered, <code>danger-shared-hovered</code>: тёмный 1.81 → 4.86, светлый 11.83 → 8.51, шесть переменных на чекбокс и радиокнопку; ② оставить, на доводе «невалидный контрол уже помечен заливкой, а фокусу достаточно отличаться от покоя» - ровно тот довод, который Д26 отклонил для primary; ③ свести в решение по фокус-кольцу, где фокус перестаёт быть перекраской вовсе. Рекомендация: ①, по той же причине, что и в Д26.',
  'invalid content rest': 'Отвечено 15.09: <code>content-danger</code> тем трём, кто красит <b>текст</b> - fieldset, fileUploader и stepper, - и семейство danger-<b>заливки</b> для <code>common</code>, потому что это вообще другой элемент.<br>Участник от <code>common</code> это <code>$invalid-badge-content</code>, белый восклицательный знак <b>внутри</b> невалидного бейджа: он лежит на красном диске, а не на странице, и <code>content-danger</code> дал бы там красное по красному, 1.00. Поэтому ответ пришёлся на диск: <code>$invalid-badge-bg</code> переехал с <code>bg-danger-shared</code> на <code>bg-danger</code>.<br>Причина та же, что у диска галереи в Д1 - <b>пара должна держаться вместе</b>. Знак режимо-статический по роли (<code>content-static-dark</code> это #ffffff в обоих режимах), значит и диск не должен светлеть в тёмном. На стеме shared он уходил в #e4554f, и белый знак падал до <b>3.68</b> против 6.07 в светлом; на <code>bg-danger</code> диск #c50f1f и знак держит 6.07 в обоих.<br>Сама группа - два разных элемента под одним именем: невалидный текст на поверхности и метка на danger-диске. Обе роли верны для того, что красят.',
};
const ruText = (key) => {
  const text = RU[key];
  if (!text) throw new Error(`нет русского текста для "${key}" - добавьте в RU в tools/review/roles-pages.mjs`);
  return text;
};

/*
 * Постоянные номера из базлайна. Считать их от позиции нельзя: закрытая запись сдвигала все
 * следующие, и ссылка «Д8 — вариант 1» через день указывала на другой вопрос. Новая запись без
 * номера роняет генерацию, а не получает чужой.
 */

/* ------------------------------------------------------------------------------------------
 * Образец на каждый открытый вопрос.
 *
 * Ключ - постоянный номер вопроса, а не позиция: вопрос закрывается, номер уходит в closed,
 * и образец уходит вместе с ним. Незнакомый ключ роняет генерацию - образец без вопроса
 * так же бесполезен, как вопрос без образца.
 * ---------------------------------------------------------------------------------------- */
const SPECIMEN = {
  'Д17': () => ['primary', 'success', 'danger'].map((hue) => {
    const c = hue === 'primary' ? 'primary' : hue;
    return row([
      tile('покой', chip({ bg: `color-bg-${c}-subtler`, fg: `color-content-${c}`, bd: `color-border-${c}`, text: 'Кнопка' }),
        `<br>${ratios(`color-content-${c}`, `color-bg-${c}-subtler`, 4.5)}`),
      tile('наведение', chip({ bg: `color-bg-${c}-subtler-hovered`, fg: `color-content-${c}`, bd: `color-border-${c}`, text: 'Кнопка' }),
        `<br>${ratios(`color-content-${c}`, `color-bg-${c}-subtler-hovered`, 4.5)}`),
      tile('наведение, вариант ①', chip({ bg: `color-bg-${c}-subtler-hovered`, fg: `color-content-${c}-hovered`, bd: `color-border-${c}`, text: 'Кнопка' }),
        `<br>подпись тоже едет<br>${ratios(`color-content-${c}-hovered`, `color-bg-${c}-subtler-hovered`, 4.5)}`),
      tile('нажатие', chip({ bg: `color-bg-${c}-subtler-active`, fg: `color-content-${c}`, bd: `color-border-${c}`, text: 'Кнопка' }),
        `<br>${ratios(`color-content-${c}`, `color-bg-${c}-subtler-active`, 4.5)}`),
      tile('вариант ③', chip({ bg: `color-bg-${c}-subtler-active`, fg: 'color-content-on-subtle-primary', bd: `color-border-${c}`, text: 'Кнопка' }),
        `<br><code>content-on-subtle-primary</code><br>${ratios('color-content-on-subtle-primary', `color-bg-${c}-subtler-active`, 4.5)}`),
    ]);
  }).join(''),

  'Д25': () => '<p class="meta">Узел дерева с чекбоксами: фокус красит чекбокс, но неактивный чекбокс исключён - '
    + 'и в фокусе он выглядит точно так же, как без него:</p>'
    + row([
      tile('активный, покой', box({ bg: 'color-content-inverted', bd: 'color-border-contrast' }),
        '<br><code>border-contrast</code>'),
      tile('активный, фокус', box({ bg: 'color-content-inverted', bd: 'color-border-primary-shared-hovered' }),
        `<br><code>border-primary-shared-hovered</code><br>${ratios('color-border-primary-shared-hovered', 'color-bg', 3)}`),
      tile('неактивный, покой', box({ bg: 'color-content-inverted', bd: 'color-border-disabled' }),
        '<br><code>border-disabled</code>'),
      tile('неактивный, фокус', box({ bg: 'color-content-inverted', bd: 'color-border-disabled' }),
        '<br>то же самое -<br><b>индикации нет</b>'),
    ])
    + '<p class="meta">Тот же узел в дереве <b>без</b> чекбоксов - строка красится независимо от того, активен он:</p>'
    + row([
      tile('без чекбоксов, фокус', sheet({ bg: 'color-bg-hovered', fg: 'color-content', text: 'Узел' }),
        '<br><code>bg-hovered</code>'),
      tile('без чекбоксов, неактивный в фокусе', sheet({ bg: 'color-bg-hovered', fg: 'color-content-disabled', text: 'Узел' }),
        '<br><code>bg-hovered</code> +<br><code>content-disabled</code>'),
    ]),

  'Д27': () => '<p class="meta">Невалидный чекбокс по состояниям - фокус снова уходит на ступень <code>active</code>:</p>'
    + row([
      tile('невалидный, покой', box({ bg: 'color-bg-danger-shared', bd: 'color-border-danger-shared', fg: 'color-content-danger-shared', mark: 'tick' }),
        `<br><code>bg-danger-shared</code><br>${ratios('color-bg-danger-shared', 'color-bg', 3)}`),
      tile('он же, наведение', box({ bg: 'color-bg-danger-shared-hovered', bd: 'color-border-danger-shared-hovered', fg: 'color-content-danger-shared', mark: 'tick' }),
        `<br><code>bg-danger-shared-hovered</code><br>${ratios('color-bg-danger-shared-hovered', 'color-bg', 3)}`),
      tile('он же, фокус', box({ bg: 'color-bg-danger-shared-active', bd: 'color-border-danger-shared-active', fg: 'color-content-danger-shared', mark: 'tick' }),
        `<br><code>bg-danger-shared-active</code><br>${ratios('color-bg-danger-shared-active', 'color-bg', 3)}`),
    ]),

};

const idOf = (key) => {
  const id = base.questionIds?.map?.[key];
  if (!id) {
    throw new Error(`нет постоянного номера для "${key}" - перевыдайте номера в tests/roles.baseline.json `
      + `(questionIds.map, следующий свободный ${base.questionIds?.next ?? '?'})`);
  }
  return id;
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
  return q(idOf(`open:${x.name}`), `${code(x.name)} = ${roleList(x.roles)}`,
    `<p class="meta">Значение сейчас: ${values(x.name) || '—'}</p>`
    + `<p>${ruText(x.name)}</p>`
    + (near ? `<p class="opt"><b>Ближайшие роли верного семейства:</b><br>${near}</p>` : ''));
});

const ladderQs = base.ladders.filter((x) => x.decision === 'design').map((x) => q(idOf(`ladder:${x.stem}`),
  `${code(x.stem)} — состояния ${x.states.map((s2) => code(s2)).join(' = ')} дают одну роль ${roleList(x.role)}`,
  `<p>${ruText(x.stem)}</p>`));

const contrastQs = base.contrast.filter((x) => x.decision === 'design').map((x) => q(idOf(`contrast:${x.selector}`),
  `Контраст: ${code(x.selector)}`,
  `<p class="meta">${code(x.fgRole.replace(/^color-/, ''))} на ${code(x.bgRole.replace(/^color-/, ''))} — `
  + `светлый <b>${x.contrast.light}</b>, тёмный <b class="warn">${x.contrast.dark}</b></p>`
  + `<p>${ruText(x.selector)}</p>`));

const slotQs = base.slotLies.filter((x) => x.decision === 'design').map((x) => q(idOf(`slot:${x.name}`),
  `${code(x.name)} — слот обещает ${code(x.slotSays)}, красит ${x.paints.map(code).join(', ')}`,
  `<p>${ruText(x.name)}</p>`));

const statePairGroups = Object.entries(base.statePairs.groups)
  .filter(([, g]) => g.decision === 'design')
  .map(([key, g]) => {
  const rows = base.statePairs.rows.filter((r) => r.group === key);
  return q(idOf(`statePairGroup:${key}`),
    `Контраст через смену состояния: <b>${esc(key)}</b> — ${rows.length} ${rows.length === 1 ? 'пара' : 'пар'}`,
    '<table><tr><th>Селектор</th><th>Передний план</th><th>На заливке</th><th>Светлый</th><th>Тёмный</th></tr>'
    + rows.map((r) => {
      const m = (v) => (v < 3 ? `<b class="warn">${v}</b>` : v < 4.5 ? `<b>${v}</b>` : String(v));
      return `<tr><td>${code(r.selector)}</td><td>${code(r.fgRole.replace(/^color-/, ''))}</td>`
        + `<td>${code(r.bgRole.replace(/^color-/, ''))}</td><td>${m(r.contrast.light)}</td><td>${m(r.contrast.dark)}</td></tr>`;
    }).join('')
    + '</table>'
    + `<p>${ruText(key)}</p>`);
});

const ringTable = `<table><tr><th>Где</th><th>Как сделано</th><th>Что не так</th></tr>`
  + base.ringAndFill.members.map((m) => `<tr><td>${esc(m.what)}</td><td>${esc(m.how)}</td><td>${esc(m.verdict)}</td></tr>`).join('')
  + '</table>';
const sweepQs = base.sweep.items.filter((x) => x.decision === 'design')
  .map((x) => q(idOf(`sweep:${x.key}`), esc(x.title), `<p>${ruText(x.key)}</p>`));

const conceptRows = base.concepts.filter((x) => x.decision === 'design').map((c) => q(idOf(`concept:${c.concept}`),
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
const answeredQs = base.concepts.filter((x) => x.decision === 'answered').map((c) => q(num('У'),
  `<b>${esc(c.concept)}</b> — отвечено, правка не нужна`,
  `<p class="meta">${roleList(c.roles)}</p><p>${ruText(c.concept)}</p>`));

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
  q(num('Н'), 'Статические роли (<code>static-dark</code> / <code>static-light</code>) — читаются только наполовину',
    '<p>Роли, не меняющиеся между режимами: они для того, что <b>не участвует</b> в переключении темы — '
    + 'например для хрома поверх фотографии.</p>'
    + '<p>09.09 диск навигационной кнопки галереи переведён на <code>bg-static-dark</code> — и это '
    + 'закрыло Д1 и Д2. Показательно, чем оборачивалась половинчатость: <code>content-static-dark</code> '
    + 'тема читала, а парную ему поверхность — нет, так что белая стрелка оказывалась на диске, который '
    + 'в тёмном режиме уезжал в светлый. <b>1.62</b> при пороге 3:1.</p>'
    + `<p>Осталось непрочитанным ${data.unusedRoles.capability.filter((u) => /static/.test(u.role)).length} `
    + 'ролей семейства — ступени наведения и нажатия статических поверхностей, вся статическая линейка '
    + 'границ и светлая половина. Вопрос тот же: есть ли у нас ещё места поверх произвольной картинки.</p>'),
];

/*
 * Таблица «решения не требуется» и весь баланс страницы считаются по данным. До 09.09 это был
 * литеральный массив, и он разошёлся: graphic-ok печатался как 2 при одной строке, а вердикт
 * graphic-ok-rest-only не попадал ни в одну секцию вообще. Гейт теперь требует класс для каждого
 * вердикта, и сумма по секциям обязана сойтись с числом разобранных строк.
 */
const reviewed = [
  ...base.open, ...base.slotLies, ...base.ladders, ...base.contrast,
  ...base.concepts, ...base.statePairs.rows, ...base.sweep.items,
];
const classes = base.decisionClasses.classes;
const countByDecision = new Map();
for (const row of reviewed) countByDecision.set(row.decision, (countByDecision.get(row.decision) ?? 0) + 1);
for (const decision of countByDecision.keys()) {
  if (!classes[decision]) {
    throw new Error(`вердикт "${decision}" не отнесён ни к одной секции - добавьте в decisionClasses `
      + 'в tests/roles.baseline.json');
  }
}
const bySection = (letter) => [...countByDecision]
  .filter(([decision]) => classes[decision].section === letter)
  .sort((a, b2) => b2[1] - a[1]);
const noAction = bySection('Е').map(([decision, count]) => [decision, count, classes[decision].ru]);
const staleCount = data.unusedRoles.stale.length;


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
const closedSection = Object.entries(base.questionIds?.closed ?? {}).length ? `
<h3>Закрыто — номера не переиспользуются</h3>
<p class="meta">Если у вас на руках ссылка на один из этих номеров, вопрос уже решён; номер за ним
и остался, новым вопросам он не достаётся.</p>
<table><tr><th></th><th>Что было и чем закончилось</th></tr>
${Object.entries(base.questionIds.closed).map(([id, what]) => `<tr><td><b>${esc(id)}</b></td><td>${esc(what)}</td></tr>`).join('')}
</table>` : '';

const plural = (n, one, few, many) => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return many;
  const mod10 = n % 10;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
};

/*
 * Образцы и вопросы обязаны совпадать список в список. Образец, переживший свой вопрос, рисует
 * то, чего уже нет; вопрос без образца - то, ради чего эту страницу и открывают.
 */
const expectSpecimens = () => {
  const open = new Set(Object.values(base.questionIds.map));
  const orphan = [...Object.keys(SPECIMEN)].filter((id) => !open.has(id));
  if (orphan.length) throw new Error(`образцы без открытого вопроса: ${orphan.join(', ')}`);
  const bare = [...open].filter((id) => !SPECIMEN[id]);
  if (bare.length) throw new Error(`вопросы без образца: ${bare.join(', ')} - добавьте в SPECIMEN`);
  const missed = [...open].filter((id) => !drawn.has(id));
  if (missed.length) throw new Error(`образец заведён, но не отрисован: ${missed.join(', ')}`);
};

const questionsPage = page('Fluent-next: открытые вопросы по ролям', `
<h1>Fluent-next: открытые вопросы по ролям</h1>
<p class="lede">Всё, что аудит нашёл и не стал решать сам. Ответы можно давать номерами: «Д3 — второй вариант».<br>
Проверено ${data.summary.declarations} цветовых объявлений в 64 папках; применено
${base.applied.rows.length} ${plural(base.applied.rows.length, 'правка', 'правки', 'правок')} —
каждая с доказанным эффектом на значение, список ниже. Всё на этой странице двигает пиксель,
меняет публичное имя или требует расширения пакета.</p>
<h2>Уже применено — ${base.applied.rows.length}</h2>
<p>${base.applied.comment.map(esc).join(' ')}</p>
<table><tr><th>Что</th><th>Как изменилось</th><th>Что стало со значением</th></tr>
${base.applied.rows.map((r) => `<tr><td>${code(r.what)}</td><td>${code(r.change)}</td><td>${esc(r.effect)}</td></tr>`).join('')}
</table>

<h2>Анатомия кольца и метки — как разведено</h2>
<p>${base.ringAndFill.comment.map(esc).join(' ')}</p>
${ringTable}

<h2>А. Дизайн — ${roleQs.length + ladderQs.length + contrastQs.length + statePairGroups.length + slotQs.length + conceptRows.length + sweepQs.length} вопросов</h2>
<h3>Роль выбрана спорно</h3>${roleQs.join('')}
<h3>Состояние неотличимо от соседнего</h3>${ladderQs.join('')}
${contrastQs.length ? `<h3>Контраст ниже порога</h3>${contrastQs.join('')}` : ''}
<h3>Контраст, который теряется при смене состояния</h3>
<p>Проверка добавлена ${esc(base.statePairs.measuredOn)} и она видит то, чего не видела предыдущая.
Та измеряет только пару, записанную в одном правиле CSS. Лестница состояний так не пишется никогда:
правило наведения или фокуса перекрашивает заливку и оставляет глиф тому правилу, что задало его
в покое. Значит именно те состояния, где значение <b>двигается</b>, и были слепым пятном.
Пары сводятся по элементу со снятыми классами состояний, поэтому отмеченный чекбокс никогда
не сравнивается с неотмеченным. Порог: 4.5 если передний план — подпись, 3 если глиф или граница
(WCAG 1.4.11, правила в axe под это нет и скриншот этого не видит).</p>
<p class="meta">Первое, что она нашла, — <b>ошибку в этом же документе</b>: строка
<code>.dx-checkbox-checked .dx-checkbox-icon</code> выше была помечена «глиф, порог 3:1 взят»
по числу 3.36. Это число относится только к покою; в фокусе тот же элемент даёт 1.62.</p>
${statePairGroups.join('')}${whyContrast}
<h3>Имя обещает одно, красит другое</h3>${slotQs.join('')}
<h3>Одно понятие покрашено по-разному в разных компонентах</h3>${conceptRows.join('')}
<h3>Найдено ручным проходом по реализациям соседей</h3>
<p>${base.sweep.comment.map(esc).join(' ')}</p>
${sweepQs.join('')}
<h3>Что этот проход подтвердил дословно</h3>
<p class="meta">Сверка шла в обе стороны. Здесь роли, которые чужая реализация назначает так же, —
решать нечего, записано чтобы аудит их не переоткрывал.</p>
<table><tr><th>У нас</th><th>У них</th><th>Итог</th></tr>
${base.sweep.confirmed.rows.map((r) => `<tr><td>${code(r.ours)}</td><td>${esc(r.theirs)}</td><td>${esc(r.verdict)}</td></tr>`).join('')}
</table>
${closedSection}

<h2>Б. Команда пакета токенов — ${pkgQs.length} заявки</h2>
<p>Роли, которая нужна, в пакете нет — обменять не на что.</p>${pkgQs.join('')}
<h3>Замер под П2: одна роль, три поверхности</h3>
<p>${base.dangerSurfaces.comment.map(esc).join(' ')}</p>
<p class="meta">${code(base.dangerSurfaces.role)}, замер ${esc(base.dangerSurfaces.measuredOn)}</p>
<table><tr><th>Поверхность</th><th>Сейчас</th><th></th><th>Если пакет сдвинет на ступень</th><th></th></tr>
${base.dangerSurfaces.surfaces.map((row, i) => {
    const next = base.dangerSurfaces.ifPackageMovedOneStep[i];
    const m = (v) => (v < 4.5 ? `<b class="warn">${v}</b>` : `<b>${v}</b>`);
    return `<tr><td>${esc(row.surface)}</td><td>${m(row.contrast)}</td><td>${esc(row.verdict)}</td>`
      + `<td>${m(next.contrast)}</td><td>${esc(next.verdict)}</td></tr>`;
  }).join('')}
</table>
<p class="meta"><b>Текстом</b> роль читают ${base.dangerSurfaces.textReaders.length} переменных:
${base.dangerSurfaces.textReaders.map(code).join(', ')}.<br>
<b>Глифом</b> — ${base.dangerSurfaces.glyphReaders.length}, там порог 3:1 и он взят:
${base.dangerSurfaces.glyphReaders.map(code).join(', ')}.</p>

<h2>В. Одно значение, разные записи — ${spellQs.length + answeredQs.length}</h2>
<p>Компоненты кладут один и тот же цвет и пишут его ролями из разных семейств. Вопрос был: какая
запись каноническая. ${answeredQs.length ? `Отвечено ${answeredQs.length}, открыто ${spellQs.length}.` : ''}</p>
${spellQs.join('')}${answeredQs.join('')}

<h2>Г. Переименование компонентного тира — сделано, ${Object.keys(base.renamed).length} имён</h2>
<p>Категория закрыта 09.09. Роль везде была верна — врало слово в имени, и каждое такое имя обещало
разработчику не то место, где переменная применяется.</p>
<p><b>Окно было открыто:</b> компонентный тир fluent-next ещё не отгружен, поэтому переименования
бесплатны — ни ченджлога, ни цикла устаревания. После релиза каждое имя становится контрактом
с приложениями, и та же правка стоила бы депрекации.</p>
<p class="meta">Не путать с легаси-38: <code>--dx-toolbar-height</code>,
<code>--dx-font-size-heading-*</code> и ещё пятнадцать имён отгружены с 25.2 и решением 27.08.2026
заморожены — их это окно не касалось.</p>
<p><b>Значения не сдвинулись.</b> Проверено сравнением <b>мультимножества разрешённых значений</b>,
а не имён: 2263 значения до и после, в обоих режимах, расхождений ноль. Сверка по именам показала бы
только то, что имена изменились.</p>
<table><tr><th>Было</th><th>Стало</th></tr>
${Object.entries(base.renamed).sort().map(([from, to]) => `<tr><td>${code(from)}</td><td>${code(to)}</td></tr>`).join('')}
</table>
<p class="meta">Четырнадцать из них — filterBuilder: его чипы уходят в базовый
<code>button-color()</code>, который ставит фон, а названы они были <code>-content</code>.
Два последних нашлись не в этой категории, а под вердиктом <code>rule-5</code>, когда категорию
доводили до конца: <code>pivot-grid-accent-content</code> красит <code>outline-color</code>
рамки сфокусированной ячейки, а <code>scheduler-appointment-start-content</code> тринадцатью
правилами рисует полосу у начала встречи через <code>inset box-shadow</code>.</p>
<p class="meta"><b>Побочно закрылся Д11:</b> после переименования pivotGrid в группе
«accent content rest» осталось двое, и оба на <code>content-primary</code> — расхождения больше нет.</p>

<h2>Д. Возможности пакета, которыми тема не пользуется — ${data.unusedRoles.capability.length} ролей</h2>
<p>Счёт от пакета внутрь, а не от наших объявлений наружу: целое семейство может отсутствовать, и при
этом ни одно объявление не выглядит неверным. Из ${data.summary.rolesOffered} ролей, которые
назначают четыре набора, тема читает ${data.summary.rolesRead}.</p>
${unusedQs.join('')}
<details><summary>Полный список ${data.unusedRoles.capability.length} ролей</summary>
<table><tr><th>Роль</th><th>Назначают</th></tr>
${data.unusedRoles.capability.map((u) => `<tr><td>${code(u.role.replace(/^color-/, ''))}</td><td>${u.sets.join(', ')}</td></tr>`).join('')}
</table></details>

<h2>Е. Решения не требуется — ${noAction.reduce((t, r) => t + r[1], 0)} из ${reviewed.length} разобранных строк</h2>
<p>Это <b>замыкающий баланс аудита</b>, а не справка: каждая разобранная строка обязана попасть ровно
в одну секцию этой страницы, и таблица ниже — та часть, которая закрыта без действия. Числа считаются
по данным, класс каждого вердикта объявлен в базлайне, и гейт роняет проверку, если появится вердикт
без секции или секция без строк. До 09.09 таблица была литеральным массивом в генераторе и уже
разошлась с данными.</p>
<p class="meta">Расклад по секциям:
${['А', 'Б', 'В', 'Г', 'Е'].map((letter) => `<b>${letter}</b> ${bySection(letter).reduce((t, r) => t + r[1], 0)}`).join(' · ')}
— в сумме ${reviewed.length}. Отдельно ${data.unusedRoles.capability.length} возможностей пакета (секция Д)
и ${staleCount} протухших имён у соседей: это счёт от пакета внутрь, а не наши объявления.</p>
<p class="meta">Что стоит за каждым классом — поимённо в <code>tests/roles.baseline.json</code>
и в <code>ROLES.md</code>: страница держит счёт, разбор держат они.</p>
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

expectSpecimens();

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
