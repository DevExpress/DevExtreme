/*
 * Выгрузка по мостам `rgb(from <роль> r g b / a)` — материал к отдельной задаче для дизайн-команды.
 *
 *   node tools/review/bridges.mjs            # → scss/widgets/fluent-next/BRIDGES.html + BRIDGES.md
 *   node tools/review/bridges.mjs --md       # только markdown, в stdout
 *
 * Мост появляется там, где месту нужна роль с альфой, а в foundation такой роли нет: тема берёт
 * существующую роль и задаёт прозрачность на месте. Инвентарь собирается из СОБРАННЫХ бандлов, а не
 * из исходников: важно, сколько мест реально отрисовывается и каким литералом это становится.
 *
 * Для каждого места считается:
 *   - выражение моста (роль + альфа),
 *   - во что оно резолвится в каждом режиме,
 *   - что стояло на этом же селекторе и свойстве в legacy fluent (если стояло).
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const cssDir = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');
const themeDir = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const mdOnly = process.argv.includes('--md');

/* ------------------------------------------------------------------ бандлы */

const load = (name) => {
  const file = join(cssDir, `dx.${name}.css`);
  if (!existsSync(file)) throw new Error(`нет бандла ${file} — соберите build:themes-dev`);
  return postcss.parse(readFileSync(file, 'utf8'));
};

const rootMap = (ast) => {
  const map = new Map();
  ast.walkRules((rule) => {
    if (!/(^|,)\s*:root\s*$/.test(rule.selector)) return;
    rule.walkDecls((decl) => { if (decl.prop.startsWith('--')) map.set(decl.prop, decl.value.trim()); });
  });
  return map;
};

const resolve = (value, map, seen = new Set()) => {
  let out = value;
  for (let pass = 0; pass < 12 && out.includes('var('); pass += 1) {
    out = out.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*))?\)/g, (whole, name, fallback) => {
      if (seen.has(name)) return fallback ?? whole;
      seen.add(name);
      return map.get(name) ?? fallback ?? whole;
    });
  }
  return out.trim();
};

const declarations = (ast, map) => {
  const found = new Map();
  ast.walkRules((rule) => {
    if (/(^|,)\s*:root\s*$/.test(rule.selector)) return;
    const scope = [];
    for (let node = rule.parent; node && node.type !== 'root'; node = node.parent) {
      if (node.type === 'atrule') scope.unshift(`@${node.name} ${node.params}`);
    }
    const prefix = scope.length ? `${scope.join(' ')} { ` : '';
    rule.selectors.forEach((selector) => {
      rule.walkDecls((decl) => {
        found.set(`${prefix}${selector.trim()} | ${decl.prop}`, { raw: decl.value.trim(), resolved: resolve(decl.value, map) });
      });
    });
  });
  return found;
};

/* -------------------------------------------------------------------- цвет */

const hexToRgb = (hex) => {
  const h = hex.slice(1);
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 1, 2].map((i) => parseInt(full.slice(i * 2, i * 2 + 2), 16));
};

const toRgb = (text) => {
  const value = text.trim().toLowerCase();
  if (/^#[0-9a-f]{3,8}$/.test(value)) return hexToRgb(value);
  const fn = /^rgba?\(([^)]*)\)$/.exec(value);
  if (!fn) return null;
  const parts = fn[1].split(/[\s,/]+/).filter(Boolean).slice(0, 3).map((n) => Math.round(parseFloat(n)));
  return parts.length === 3 ? parts : null;
};

/** `rgb(from <цвет> r g b / a)` → `rgba(r, g, b, a)`; остальное значение сохраняется как есть. */
const flatten = (value) => value.replace(
  /rgba?\(\s*from\s+([^\s]+(?:\s*\([^()]*\))?)\s+r\s+g\s+b\s*(?:\/\s*([\d.%]+)\s*)?\)/gi,
  (whole, colour, alphaText) => {
    const rgb = toRgb(colour);
    if (!rgb) return whole;
    const alpha = alphaText === undefined ? 1
      : (alphaText.endsWith('%') ? parseFloat(alphaText) / 100 : parseFloat(alphaText));
    return `rgba(${rgb.join(', ')}, ${Number(alpha.toFixed(3))})`;
  },
);

/* ---------------------------------------------------------------- сборка */

const GROUND = { light: '#ffffff', dark: '#242424' };

const WIDGETS = [
  [/dxdi-|\.dx-diagram/, 'Diagram'], [/\.dx-datagrid|\.dx-treelist/, 'Гриды'],
  [/\.dx-scheduler/, 'Scheduler'], [/\.dx-gantt/, 'Gantt'], [/\.dx-pivotgrid/, 'PivotGrid'],
  [/\.dx-filemanager/, 'FileManager'], [/\.dx-htmleditor/, 'HtmlEditor'], [/\.dx-switch/, 'Switch'],
  [/\.dx-gallery/, 'Gallery'], [/\.dx-dateview/, 'DateView'], [/\.dx-tile/, 'TileView'],
  [/\.dx-sortable|\.dx-draggable/, 'Sortable'], [/\.dx-popup|\.dx-overlay/, 'Popup / Overlay'],
];
const widgetOf = (selector) => WIDGETS.find(([re]) => re.test(selector))?.[1] ?? 'прочее';

/**
 * Роли и альфы, ради которых мост существует, — это и есть заявки в пакет. Одно значение может
 * содержать несколько мостов (градиенты затухания в dateView), поэтому возвращается список.
 */
const requestsOf = (raw) => [...raw.matchAll(
  /rgba?\(\s*from\s+var\(\s*(--dxds-[\w-]+)\s*\)\s+r\s+g\s+b\s*(?:\/\s*([\d.%]+))?/gi,
)].map(([, name, alphaText]) => ({
  role: name.replace('--dxds-', ''),
  alpha: alphaText === undefined ? 1
    : (alphaText.endsWith('%') ? parseFloat(alphaText) / 100 : parseFloat(alphaText)),
}));

const modes = ['light', 'dark'].map((mode) => {
  const themed = load(`fluent-next.blue.${mode}`);
  const legacy = load(`fluent.blue.${mode}`);
  return {
    mode,
    themed: declarations(themed, rootMap(themed)),
    legacy: declarations(legacy, rootMap(legacy)),
  };
});

const places = new Map();
modes.forEach(({ mode, themed, legacy }) => {
  themed.forEach((value, key) => {
    if (!/rgba?\(\s*from/i.test(value.raw)) return;
    const [selector, prop] = key.split(' | ');
    if (!places.has(key)) {
      places.set(key, {
        selector, prop, widget: widgetOf(selector), requests: requestsOf(value.raw), raw: value.raw, byMode: {},
      });
    }
    places.get(key).byMode[mode] = {
      bridge: flatten(value.resolved),
      before: legacy.has(key) ? flatten(legacy.get(key).resolved) : null,
    };
  });
});

/* заявки: одна пара (роль, альфа) — один запрос в пакет */
const requests = new Map();
[...places.values()].forEach((place) => {
  place.requests.forEach((request) => {
    const key = `${request.role} @ ${Math.round(request.alpha * 100)}%`;
    if (!requests.has(key)) requests.set(key, { ...request, key, places: [] });
    if (!requests.get(key).places.includes(place)) requests.get(key).places.push(place);
  });
});

const byWidget = new Map();
[...places.values()].forEach((place) => {
  if (!byWidget.has(place.widget)) byWidget.set(place.widget, []);
  byWidget.get(place.widget).push(place);
});

/* -------------------------------------------------------------- markdown */

const md = () => {
  const out = [];
  out.push('<!-- Сгенерировано: node tools/review/bridges.mjs. Не править руками. -->');
  out.push('# Мосты `rgb(from … / a)` — материал к задаче\n');
  out.push('Карточка дизайн-команды: **[design#1554](https://github.com/DevExpress/design/issues/1554)** — '
    + 'рассмотрение идёт там.\n');
  out.push('Вопрос задачи: **оставить мосты штатным механизмом темы или заказать в пакет токенов роли '
    + 'с альфой?** Решение 3 агенды дизайн-ревью принято («принять мосты»), выпуск темы это не '
    + 'блокирует — карточка уточняет, расширять ли пакет.\n');
  out.push('## Что такое мост\n');
  out.push('Месту нужен цвет роли с прозрачностью, а в foundation роли с такой альфой нет. Тема берёт '
    + 'существующую роль и задаёт альфу на месте средствами CSS:\n');
  out.push('```scss');
  out.push('// было в legacy fluent: альфа считалась Sass-функцией от значения');
  out.push('$datagrid-drag-header-border-color: color.change($base-accent, $alpha: .5);\n');
  out.push('// стало в fluent-next: роль сохраняется, альфа задаётся поверх неё');
  out.push('$grid-drag-header-border: rgb(from #{ds.$color-border-primary} r g b / 0.5);');
  out.push('```\n');
  out.push('Отличие принципиальное: значение остаётся **связанным с ролью** — при ре-скине темы оно '
    + 'поедет вместе с ней. Литерал такой связи не даёт.\n');
  out.push(`## Масштаб\n`);
  out.push(`- объявлений в исходниках темы: **18** (в \`*/_colors.scss\`)`);
  out.push(`- мест в собранном бандле: **${places.size}** (каждое живёт в обоих режимах)`);
  out.push(`- различных заявок «роль + альфа»: **${requests.size}**\n`);
  out.push('## Что именно просить у пакета\n');
  out.push('Одна строка — один запрос: если такие роли появятся, мост в этих местах заменяется ссылкой.\n');
  out.push('| Роль-источник | Альфа | Мест | Где |');
  out.push('|---|---|---|---|');
  [...requests.values()].sort((a, b) => b.places.length - a.places.length).forEach((request) => {
    const widgets = [...new Set(request.places.map((p) => p.widget))].join(', ');
    out.push(`| \`${request.role}\` | ${Math.round(request.alpha * 100)}% | ${request.places.length} | ${widgets} |`);
  });
  out.push('');
  out.push('## Полный инвентарь\n');
  [...byWidget.entries()].sort((a, b) => b[1].length - a[1].length).forEach(([widget, list]) => {
    out.push(`### ${widget} (${list.length})\n`);
    out.push('| Место | Мост | Светлый: fluent → fluent-next | Тёмный: fluent → fluent-next |');
    out.push('|---|---|---|---|');
    list.forEach((place) => {
      const cell = (mode) => {
        const data = place.byMode[mode];
        if (!data) return '—';
        return `${data.before ?? '—'} → ${data.bridge}`;
      };
      const request = place.requests.length
        ? place.requests.map((r) => `\`${r.role}\` @ ${Math.round(r.alpha * 100)}%`).join('<br>')
        : 'составное значение';
      out.push(`| \`${place.selector} | ${place.prop}\` | ${request} | ${cell('light')} | ${cell('dark')} |`
        .replace(/\| `([^`]*)`/, (whole, text) => `| \`${text.replace(/\|/g, '\\|')}\``));
    });
    out.push('');
  });
  return out.join('\n');
};

/* ------------------------------------------------------------------ HTML */

const escape = (text) => String(text)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Превью: значение подставляется в реальное CSS-свойство, чтобы мост было видно, а не только прочитать. */
const preview = (place, mode) => {
  const data = place.byMode[mode];
  if (!data) return '<td class="prev"></td>';
  const ground = GROUND[mode];
  const box = (value) => {
    if (value === null) return '<div class="pv"><span class="pvnone">нет в fluent</span></div>';
    /* цвет кладётся поверх диагональных полос: так видна и сама краска, и её прозрачность */
    let inner = '';
    if (/gradient/.test(value)) inner = `background-image: ${value}, var(--stripes);`;
    else if (place.prop === 'box-shadow') inner = `box-shadow: ${value}; background-image: var(--stripes);`;
    else if (/^border|^stroke/.test(place.prop)) inner = `border: 4px solid ${value}; background-image: var(--stripes);`;
    else inner = `background-image: linear-gradient(${value}, ${value}), var(--stripes);`;
    return `<div class="pv" style="--ground:${ground}"><i style="${inner}"></i><code>${escape(value)}</code></div>`;
  };
  return `<td class="prev"><div class="pvpair">${box(data.before)}<span class="arr">→</span>${box(data.bridge)}</div></td>`;
};

const html = () => `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Мосты rgb(from … / a) — материал к задаче</title>
<style>
:root {
  color-scheme: light dark;
  --ink: #14171c; --ink-soft: #565e6b; --ink-faint: #858d9a;
  --page: #f4f6f8; --card: #fff; --line: #e0e5ec; --line-soft: #eef1f5;
  --accent: #0f6cbd; --accent-soft: #e8f0fa;
  --sans: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  --mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
}
@media (prefers-color-scheme: dark) {
  :root { --ink:#e7eaef; --ink-soft:#a6aeba; --ink-faint:#79818e; --page:#0f1216; --card:#171b21;
    --line:#272d36; --line-soft:#1e232a; --accent:#6aa9e6; --accent-soft:#17242f; }
}
:root[data-theme="dark"] { --ink:#e7eaef; --ink-soft:#a6aeba; --ink-faint:#79818e; --page:#0f1216;
  --card:#171b21; --line:#272d36; --line-soft:#1e232a; --accent:#6aa9e6; --accent-soft:#17242f; }
:root[data-theme="light"] { --ink:#14171c; --ink-soft:#565e6b; --ink-faint:#858d9a; --page:#f4f6f8;
  --card:#fff; --line:#e0e5ec; --line-soft:#eef1f5; --accent:#0f6cbd; --accent-soft:#e8f0fa; }
* { box-sizing: border-box; }
body { margin:0; background:var(--page); color:var(--ink); font:15px/1.55 var(--sans); }
h1,h2,h3 { margin:0; font-weight:600; text-wrap:balance; }
p { margin:0; }
code { font-family:var(--mono); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.wrap { max-width:1180px; margin:0 auto; padding:28px; display:flex; flex-direction:column; gap:20px; }
header.top { background:var(--card); border-bottom:1px solid var(--line); padding:34px 28px 26px; }
.kicker { font:600 11px/1 var(--mono); letter-spacing:.16em; text-transform:uppercase; color:var(--ink-faint); }
header.top h1 { font-size:clamp(25px,3.2vw,35px); letter-spacing:-.02em; margin-top:14px; }
.lede { color:var(--ink-soft); max-width:70ch; margin-top:12px; }
.facts { display:flex; flex-wrap:wrap; gap:10px 28px; margin-top:18px; }
.fact b { font:600 20px/1.1 var(--sans); font-variant-numeric:tabular-nums; display:block; }
.fact span { font-size:12px; color:var(--ink-faint); }
section.card { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:22px;
  display:flex; flex-direction:column; gap:14px; }
section.card h2 { font-size:19px; }
section.card h3 { font-size:14.5px; }
.sub { color:var(--ink-soft); max-width:74ch; }
pre { margin:0; background:var(--page); border:1px solid var(--line-soft); border-radius:8px;
  padding:12px 14px; overflow-x:auto; font:12.5px/1.6 var(--mono); }
pre .cmt { color:var(--ink-faint); }
.tablewrap { overflow-x:auto; border:1px solid var(--line-soft); border-radius:8px; }
table { border-collapse:collapse; width:100%; font-size:13px; }
thead th { text-align:left; font:600 11px/1 var(--sans); letter-spacing:.06em; text-transform:uppercase;
  color:var(--ink-faint); padding:9px 12px; border-bottom:1px solid var(--line); }
td, tbody th { padding:8px 12px; border-bottom:1px solid var(--line-soft); vertical-align:middle; text-align:left; }
tbody tr:last-child td { border-bottom:0; }
.place code { font-size:11.5px; color:var(--ink-soft); word-break:break-word; }
.prop { display:inline-block; margin-left:6px; font:11px var(--mono); color:var(--ink-faint);
  border:1px solid var(--line); border-radius:4px; padding:1px 5px; white-space:nowrap; }
.req { font:12px var(--mono); white-space:nowrap; }
.req b { font-weight:600; }
.n { font-variant-numeric:tabular-nums; text-align:right; }
.pvpair { display:flex; align-items:center; gap:8px; }
.pv { display:flex; flex-direction:column; gap:4px; min-width:126px; }
.pv i { display:block; height:34px; border-radius:5px; background-color:var(--ground);
  background-repeat:no-repeat; box-shadow:inset 0 0 0 1px rgba(128,128,128,.3);
  --stripes:repeating-linear-gradient(45deg, rgba(128,128,128,.25) 0 5px, transparent 0 10px); }
td.prev { min-width:250px; }
.place { min-width:250px; }
.pv code { font-size:10.5px; color:var(--ink-faint); word-break:break-all; }
.pvnone { font-size:11px; color:var(--ink-faint); font-style:italic; }
.arr { color:var(--ink-faint); }
.modehead { font:600 12px/1 var(--sans); letter-spacing:.06em; text-transform:uppercase; color:var(--ink-faint); }
.legend { display:flex; flex-wrap:wrap; gap:8px 20px; font-size:12.5px; color:var(--ink-soft); }
footer { color:var(--ink-faint); font-size:12.5px; padding:0 28px 44px; max-width:1180px; margin:0 auto; }
@media print { body { background:#fff; } section.card { break-inside:avoid; } }
</style>
</head>
<body>
<header class="top">
  <div style="max-width:1180px;margin:0 auto">
    <p class="kicker">DevExtreme · fluent-next · материал к задаче · решение 3 дизайн-ревью</p>
    <h1>Мосты <code>rgb(from … / a)</code></h1>
    <p class="lede">Вопрос задачи: оставить мосты штатным механизмом темы — или заказать в пакет токенов
      роли с альфой. Ниже полный инвентарь: каждое место, где мост реально отрисовывается, с тем, что
      стояло там в legacy fluent, и во что мост превращается в каждом режиме.</p>
    <p class="lede"><b>Карточка: <a href="https://github.com/DevExpress/design/issues/1554">design#1554</a></b>
      — рассмотрение идёт там. Выпуск темы вопрос не блокирует: механизм работает и сохраняет связь
      значения с ролью.</p>
    <div class="facts">
      <div class="fact"><b>18</b><span>объявлений в исходниках</span></div>
      <div class="fact"><b>${places.size}</b><span>мест в бандле</span></div>
      <div class="fact"><b>${requests.size}</b><span>заявок «роль + альфа»</span></div>
      <div class="fact"><b>2</b><span>режима на каждое место</span></div>
    </div>
    <div class="facts" style="margin-top:6px">
      <p class="sub" style="font-size:12.5px">В превью цвет положен поверх диагональных полос и подложки
        своего режима — так одновременно видно и краску, и то, насколько она прозрачна.</p>
    </div>
  </div>
</header>

<div class="wrap">
  <section class="card">
    <h2>Что такое мост и зачем он</h2>
    <p class="sub">Месту нужен цвет роли с прозрачностью, а роли с такой альфой в foundation нет.
      Тема берёт существующую роль и задаёт альфу поверх неё средствами CSS — значение остаётся
      связанным с ролью и поедет вместе с ней при ре-скине. Литерал такой связи не даёт.</p>
    <pre><span class="cmt">// было в legacy fluent — альфа считалась Sass-функцией от значения</span>
$datagrid-drag-header-border-color: color.change($base-accent, $alpha: .5);

<span class="cmt">// стало в fluent-next — роль сохранена, альфа задана на месте</span>
$grid-drag-header-border: rgb(from #{ds.$color-border-primary} r g b / 0.5);</pre>
    <p class="sub">Поддержка: relative color работает в Chrome 119+, Safari 16.4+, Firefox 128+ —
      внутри <code>browserslist</code> пакета (<code>last 2 versions</code>). Если роли с альфой появятся
      в пакете, каждое место ниже заменяется прямой ссылкой на роль.</p>
  </section>

  <section class="card">
    <h2>Что просить у пакета</h2>
    <p class="sub">Одна строка — один запрос. Мосты сведены по паре «роль-источник + альфа»: именно
      столько ролей нужно, чтобы механизм исчез полностью.</p>
    <div class="tablewrap"><table>
      <thead><tr><th>Роль-источник</th><th>Альфа</th><th class="n">Мест</th><th>Где</th></tr></thead>
      <tbody>${[...requests.values()].sort((a, b) => b.places.length - a.places.length).map((request) => `
        <tr>
          <td class="req"><b>${escape(request.role)}</b></td>
          <td class="req">${Math.round(request.alpha * 100)}%</td>
          <td class="n">${request.places.length}</td>
          <td>${escape([...new Set(request.places.map((p) => p.widget))].join(', '))}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </section>

  ${[...byWidget.entries()].sort((a, b) => b[1].length - a[1].length).map(([widget, list]) => `
  <section class="card">
    <h2>${escape(widget)} <span class="modehead">${list.length}</span></h2>
    <div class="tablewrap"><table>
      <thead><tr><th>Место</th><th>Заявка</th><th>Светлый: fluent → fluent-next</th><th>Тёмный: fluent → fluent-next</th></tr></thead>
      <tbody>${list.map((place) => `
        <tr>
          <td class="place"><code>${escape(place.selector)}</code><span class="prop">${escape(place.prop)}</span></td>
          <td class="req">${place.requests.length
            ? place.requests.map((r) => `<b>${escape(r.role)}</b> @ ${Math.round(r.alpha * 100)}%`).join('<br>')
            : 'составное'}</td>
          ${preview(place, 'light')}
          ${preview(place, 'dark')}
        </tr>`).join('')}
      </tbody>
    </table></div>
  </section>`).join('')}

  <section class="card">
    <h2>Как решать</h2>
    <p class="sub"><b>Оставить мосты.</b> Ноль правок, механизм уже работает и сохраняет связь с ролью.
      Цена: в теме живёт приём, которого нет в дизайн-системе, и каждое новое такое место требует
      ручного выбора альфы.</p>
    <p class="sub"><b>Заказать роли.</b> ${requests.size} новых ролей закрывают все ${places.size} мест;
      после их появления правка механическая — замена выражения на ссылку, по строке на объявление.
      Цена: расширение публичной поверхности пакета и ожидание релиза.</p>
    <p class="sub"><b>Смешанный вариант.</b> Заказать роли только там, где мост встречается больше
      одного раза (это верхние строки таблицы «Что просить у пакета»), остальное оставить мостом как
      единичные случаи.</p>
  </section>
</div>

<footer>
  Собрано из бандлов <code>dx.fluent-next.blue.{light,dark}.css</code> и <code>dx.fluent.blue.{light,dark}.css</code>:
  <code>node tools/review/bridges.mjs</code>. Значения показаны после разворачивания <code>var()</code> по
  <code>:root</code>-карте своего бандла; превью рисуются реальным CSS-значением поверх подложки режима
  (${GROUND.light} / ${GROUND.dark}).
</footer>
</body>
</html>
`;

if (mdOnly) {
  process.stdout.write(`${md()}\n`);
} else {
  writeFileSync(join(themeDir, 'BRIDGES.md'), `${md()}\n`);
  writeFileSync(join(themeDir, 'BRIDGES.html'), html());
  process.stdout.write(`мест: ${places.size}, заявок: ${requests.size}\n`);
  [...requests.values()].sort((a, b) => b.places.length - a.places.length)
    .forEach((r) => process.stdout.write(`  ${String(r.places.length).padStart(2)}  ${r.key}\n`));
}
