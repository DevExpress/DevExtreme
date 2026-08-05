/*
 * Before/after evidence for the design review of dxdsfluent
 * (scss/widgets/dxdsfluent/DIVERGENCES.md, section "Агенда для дизайн-ревью").
 *
 *   node tools/review/evidence.mjs                 # all decisions, summary
 *   node tools/review/evidence.mjs --decision=1    # one decision, every place
 *   node tools/review/evidence.mjs --md            # markdown, to paste into the agenda
 *
 * The journal describes each divergence in prose ("немного отличаются оттенки"). A design review
 * needs the actual pixels, so this compares the two BUILT bundles instead of the sources: for every
 * selector+property that exists in both themes it resolves the dxdsfluent value through the bundle's
 * own `:root` map down to a literal, and reports the pairs that really differ.
 *
 * Two things make the naive diff lie, and both are handled here:
 *
 *   - Formatting is not a difference. `#0F6CBD`, `rgb(15 108 189)` and `rgba(15,108,189,1)` are the
 *     same colour; the minifier and the token pipeline disagree about spelling constantly. Values are
 *     normalised to an rgba tuple before comparison, so only real colour changes survive.
 *   - Absence is not a difference. dxdsfluent emits `var()` where fluent emitted a literal, which
 *     stops the minifier from collapsing longhands into shorthands (GOTCHAS §8). A property present
 *     on one side only is therefore reported separately as `shape`, never as a colour delta.
 *
 * The output is deliberately per-place and not aggregated: a reviewer decides "danger tints are too
 * dense" by looking at the tints, not at a count.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const cssDir = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');

const asMarkdown = process.argv.includes('--md');
const onlyDecision = /--decision=(\d+)/.exec(process.argv.join(' '))?.[1];

/* ------------------------------------------------------------------ colours */

const NAMED = {
  transparent: [0, 0, 0, 0], white: [255, 255, 255, 1], black: [0, 0, 0, 1],
  gray: [128, 128, 128, 1], grey: [128, 128, 128, 1], red: [255, 0, 0, 1],
};

const hexToRgba = (hex) => {
  const h = hex.slice(1);
  const full = h.length === 3 || h.length === 4
    ? [...h].map((c) => c + c).join('')
    : h;
  const n = (i) => parseInt(full.slice(i * 2, i * 2 + 2), 16);
  return [n(0), n(1), n(2), full.length === 8 ? Number((n(3) / 255).toFixed(3)) : 1];
};

const clamp = (value, max) => Math.min(max, Math.max(0, value));

/**
 * A colour as an [r, g, b, a] tuple, or null when the text is not a single colour.
 *
 * Channels are clamped the way a browser clamps them, which matters here: legacy fluent ships
 * out-of-gamut values such as `hsla(0,0%,-46.42%,.2)` (Sass `color.adjust` running past the end of
 * the scale), and comparing them literally would report a difference where the screen shows none.
 */
const toRgba = (raw) => {
  const value = raw.trim().toLowerCase();
  if (NAMED[value]) return NAMED[value];
  if (/^#[0-9a-f]{3,8}$/.test(value)) return hexToRgba(value);

  /* relative colour — the ③ bridge: rgb(from <colour> r g b / a) keeps the channels, sets alpha */
  const relative = /^rgba?\(\s*from\s+(.+?)\s+r\s+g\s+b\s*(?:\/\s*([\d.%]+)\s*)?\)$/.exec(value);
  if (relative) {
    const base = toRgba(relative[1]);
    if (!base) return null;
    const alphaText = relative[2];
    const alpha = alphaText === undefined
      ? base[3]
      : Number((alphaText.endsWith('%') ? parseFloat(alphaText) / 100 : parseFloat(alphaText)).toFixed(3));
    return [base[0], base[1], base[2], clamp(alpha, 1)];
  }

  const fn = /^(rgba?|hsla?)\(([^)]*)\)$/.exec(value);
  if (!fn) return null;
  const parts = fn[2].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  const num = (text) => (text.endsWith('%') ? parseFloat(text) / 100 : parseFloat(text));
  const alpha = parts[3] === undefined ? 1 : clamp(Number(num(parts[3]).toFixed(3)), 1);
  if (fn[1].startsWith('rgb')) {
    const channel = (text) => clamp(
      Math.round(text.endsWith('%') ? (parseFloat(text) * 255) / 100 : parseFloat(text)),
      255,
    );
    return [channel(parts[0]), channel(parts[1]), channel(parts[2]), alpha];
  }
  /* hsl -> rgb, so an hsl() literal and a hex token are comparable */
  const h = ((parseFloat(parts[0]) % 360) + 360) % 360;
  const s = clamp(num(parts[1]), 1);
  const l = clamp(num(parts[2]), 1);
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const sector = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.floor(h / 60)];
  return [...sector.map((v) => Math.round((v + m) * 255)), alpha];
};

const show = (tuple) => {
  if (!tuple) return '—';
  const [r, g, b, a] = tuple;
  const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  return a === 1 ? hex : `${hex} @${Math.round(a * 100)}%`;
};

/* ------------------------------------------------------------------ bundles */

const load = (name) => {
  const file = join(cssDir, `dx.${name}.css`);
  if (!existsSync(file)) throw new Error(`нет бандла ${file} — соберите build:themes-dev`);
  return postcss.parse(readFileSync(file, 'utf8'));
};

/** `--dxds-*` definitions from the bundle's own :root, so var() can be resolved to a literal. */
const rootMap = (ast) => {
  const map = new Map();
  ast.walkRules((rule) => {
    if (!/(^|,)\s*:root\s*$/.test(rule.selector)) return;
    rule.walkDecls((decl) => {
      if (decl.prop.startsWith('--')) map.set(decl.prop, decl.value.trim());
    });
  });
  return map;
};

/** Follows var() chains (honouring fallbacks) until a literal is left. */
const resolve = (value, map, seen = new Set()) => {
  let out = value;
  for (let pass = 0; pass < 12 && out.includes('var('); pass += 1) {
    out = out.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*))?\)/g, (whole, name, fallback) => {
      if (seen.has(name)) return fallback ?? whole;
      seen.add(name);
      const found = map.get(name);
      if (found !== undefined) return found;
      return fallback ?? whole;
    });
  }
  return out.trim();
};

/**
 * selector + property -> last written value (the cascade winner within one bundle).
 * Media queries are kept apart: a size-mode override must not overwrite the default.
 */
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
        const key = `${prefix}${selector.trim()} | ${decl.prop}`;
        found.set(key, resolve(decl.value, map));
      });
    });
  });
  return found;
};

/* ---------------------------------------------------------------- decisions */

/*
 * One entry per row of the agenda table. `places` are matched against the selector, `props` against
 * the property; a place with no `props` accepts every colour-valued property. The patterns come from
 * the "Место" field of the journal entry, translated into the selectors that actually ship.
 */
const DECISIONS = [
  {
    id: 1,
    title: 'Модель «цветная поверхность + статический content» в тёмном режиме',
    entries: ['button contained dark', 'w3 colored surfaces', 'gridBase текст на цветных поверхностях'],
    modes: ['dark'],
    places: [
      { match: /\.dx-button-mode-contained\.dx-button-(default|danger|success)(?![\w-])/, props: ['color', 'background-color'] },
      { match: /\.dx-toast-(warning|error|success)(?![\w-])/, props: ['color', 'background-color'] },
      { match: /\.dx-calendar-cell\.dx-calendar-selected-date(?![\w-])/, props: ['color', 'background-color'] },
      { match: /\.dx-datagrid-search-text|\.dx-row-error|\.dx-datagrid-drop-highlight/, props: ['color', 'background-color'] },
    ],
  },
  {
    id: 2,
    title: 'Семейство для цветных и нейтральных тинтов (hover/active/selected/полосы)',
    entries: ['button ховер-тинты', 'filterBuilder/chat чипы', 'splitterBar', 'pivotGrid чипы и итог',
      'informer/progressBar/slider', 'gridBase строка в фокусе', 'gridBase нейтральная глубина'],
    places: [
      { match: /\.dx-button-mode-(outlined|text)\.dx-button-(default|danger|success)(?![\w-])/, props: ['background-color'] },
      { match: /\.dx-filterbuilder .*\.dx-filterbuilder-item-(field|operation|value)|\.dx-chat-messagebubble/, props: ['background-color'] },
      { match: /\.dx-splitter-item-collapsed|\.dx-splitter-handle|\.dx-resize-handle/, props: ['background-color'] },
      { match: /\.dx-pivotgrid.*(grand-total|field-chooser)|\.dx-area-field(?![\w-])/, props: ['background-color'] },
      { match: /\.dx-slider|\.dx-progressbar|\.dx-informer/, props: ['background-color'] },
      { match: /\.dx-datagrid-rowsview .dx-row-focused|\.dx-row-alt|\.dx-datagrid-filter-row|\.dx-master-detail-cell/, props: ['background-color'] },
    ],
  },
  {
    id: 3,
    title: 'Мосты ③ rgb(from … / a) там, где в foundation нет роли с альфой',
    entries: ['w3 границы/градиенты', 'htmlEditor накладки', 'switch тень кольца', 'fileManager оверлей',
      'gridBase drag-header', 'часть base B1a'],
    unmeasured: ['градиенты затухания dateView (мост внутри linear-gradient, сравнивается как текст)'],
    places: [
      { match: /\.dx-tile|\.dx-gallery-indicator|\.dx-dateview/, props: ['border-color', 'background-color'] },
      { match: /\.dx-htmleditor/, props: ['background-color', 'color'] },
      { match: /\.dx-switch-on-value .dx-switch-handle/, props: ['box-shadow'] },
      { match: /\.dx-filemanager-thumbnails-item(?![\w-])|\.dx-filemanager-thumbnails-item\.dx-item-selected/, props: ['background-color'] },
      { match: /\.dx-datagrid-drag-header/, props: ['border-color', 'box-shadow'] },
    ],
  },
  {
    id: 4,
    title: 'Смена тона относительно legacy (уехал не оттенок, а цвет)',
    entries: ['gridBase подсветка поиска', 'scheduler индикатор текущего времени', 'diagram метки выделения'],
    places: [
      { match: /\.dx-datagrid-search-text/, props: ['color', 'background-color'] },
      { match: /\.dx-scheduler-date-time-indicator|\.dx-scheduler-header-panel-current-time-cell/, props: ['background-color', 'color'] },
      { match: /\.dxdi-canvas/, props: ['stroke', 'fill'] },
    ],
  },
  {
    id: 5,
    title: 'Пробелы foundation → эскалация в команду токенов',
    entries: ['loadIndicator дорожка/sparkle', 'button content для selected', 'sizes сироты'],
    unmeasured: ['sizes сироты (55 px-значений — список в самой записи, не цвет)',
      'FOUNDATION GAP размеры и data-uri (нет визуальной дельты по построению)'],
    places: [
      { match: /\.dx-loadindicator/, props: ['background-color', 'border-color', 'background-image'] },
      { match: /\.dx-button-mode-(outlined|text)\.dx-button-(default|danger|success)\.dx-state-(selected|hover)/, props: ['color'] },
    ],
  },
  {
    id: 6,
    title: 'Двухролевые переменные',
    entries: ['scheduler ячейка текущего времени'],
    places: [
      { match: /current-time-cell/, props: ['color', 'background-color'] },
    ],
  },
  {
    id: 7,
    title: 'Точечные',
    entries: ['button нейтральная кнопка на альфе', 'diagram канва/тени/format-active',
      'gantt inverted/primary', 'gantt accent'],
    places: [
      { match: /\.dx-button-mode-contained\.dx-button-normal(?![\w-])/, props: ['background-color'] },
      { match: /\.dxdi-canvas(?![\w-])|dx-diagram.*format-active/, props: ['background-color', 'box-shadow'] },
      { match: /\.dx-gantt-task(?![\w-])|\.dx-gantt-tm|\.dx-gantt-ti|\.dx-gantt-res/, props: ['background-color', 'border-left-color', 'border-right-color', 'color'] },
    ],
  },
];

const COLOUR_PROPS = /(^|-)(color|fill|stroke)$/;

const COLOUR_TOKEN = /(#[0-9a-f]{3,8}|(?:rgba?|hsla?)\([^()]*(?:\([^()]*\))?[^()]*\)|\b(?:transparent|white|black|gray|grey|red)\b)/i;

/**
 * The legacy side often carries the colour inside a shorthand (`border: 1px solid rgba(...)`), while
 * dxdsfluent has to split it out because the value is a `var()`. Without this the two sides look
 * incomparable and a real colour change would be filed as "present only in dxdsfluent".
 */
const fromShorthand = (map, selectorAndProp) => {
  const [selector, prop] = selectorAndProp.split(' | ');
  const shorthand = /^(.*?)-color$/.exec(prop)?.[1];
  if (!shorthand) return undefined;
  const candidates = [shorthand];
  if (/^border-(left|right|top|bottom|inline|block)/.test(shorthand)) candidates.push('border');
  for (const candidate of candidates) {
    const value = map.get(`${selector} | ${candidate}`);
    const colour = value && COLOUR_TOKEN.exec(value);
    if (colour) return colour[1];
  }
  return undefined;
};

/* --------------------------------------------------------------------- run */

const themes = ['light', 'dark'].map((mode) => {
  const legacyAst = load(`fluent.blue.${mode}`);
  const themedAst = load(`dxdsfluent.blue.${mode}`);
  return {
    mode,
    legacy: declarations(legacyAst, rootMap(legacyAst)),
    themed: declarations(themedAst, rootMap(themedAst)),
  };
});

const compare = (decision, theme) => {
  const rows = [];
  const shape = [];
  decision.places.forEach((place) => {
    [...theme.themed.keys()].forEach((key) => {
      const [selector, prop] = key.split(' | ');
      if (!place.match.test(selector)) return;
      if (place.props ? !place.props.includes(prop) : !COLOUR_PROPS.test(prop)) return;
      const after = theme.themed.get(key);
      const before = theme.legacy.get(key) ?? fromShorthand(theme.legacy, key);
      if (before === undefined) {
        shape.push({ key, after });
        return;
      }
      const a = toRgba(after);
      const b = toRgba(before);
      if (a && b) {
        if (a.join() !== b.join()) rows.push({ key, before: show(b), after: show(a), kind: 'colour' });
        return;
      }
      /* not a plain colour (box-shadow, gradient): compare as normalised text */
      const flat = (text) => text.replace(/\s+/g, ' ').replace(/,\s/g, ',').trim();
      if (flat(before) !== flat(after)) rows.push({ key, before: flat(before), after: flat(after), kind: 'text' });
    });
  });
  return { rows, shape };
};

const report = [];
DECISIONS.filter((d) => !onlyDecision || String(d.id) === onlyDecision).forEach((decision) => {
  const modes = decision.modes ?? ['light', 'dark'];
  const perMode = themes
    .filter((theme) => modes.includes(theme.mode))
    .map((theme) => ({ mode: theme.mode, ...compare(decision, theme) }));
  report.push({ decision, perMode });
});

const out = (text) => process.stdout.write(`${text}\n`);

if (asMarkdown) {
  const totals = report.map(({ decision, perMode }) => ({
    id: decision.id,
    title: decision.title,
    counts: perMode.map(({ mode, rows }) => `${mode} ${rows.length}`).join(', '),
  }));
  out('<!-- Сгенерировано: node tools/review/evidence.mjs --md > REVIEW_EVIDENCE.md. Не править руками. -->');
  out('# Доказательства к агенде дизайн-ревью dxdsfluent\n');
  out('Что именно меняется на экране по каждому решению из таблицы «Агенда для дизайн-ревью» в');
  out('[DIVERGENCES.md](DIVERGENCES.md). Не пересказ журнала, а сравнение **собранных бандлов**');
  out('`dx.fluent.blue.{light,dark}.css` и `dx.dxdsfluent.blue.{light,dark}.css`: для каждого');
  out('селектора и свойства, которые есть в обеих темах, значение dxdsfluent прогоняется по');
  out('`:root`-карте своего бандла до литерала, и сравниваются уже литералы.\n');
  out('Что учтено, чтобы таблицы не врали:\n');
  out('- **написание — не отличие**: `#0F6CBD`, `rgb(15 108 189)` и `rgba(15,108,189,1)` сводятся');
  out('  к одному кортежу, поэтому строка появляется только при настоящей смене цвета;');
  out('- **мосты ③ разворачиваются**: `rgb(from var(--dxds-…) r g b / .15)` считается цветом с альфой;');
  out('- **цвет из shorthand достаётся**: fluent часто пишет `border: 1px solid <цвет>`, а dxdsfluent');
  out('  обязан вынести `border-color` отдельно (значение — `var()`); без этого настоящая смена цвета');
  out('  выглядела бы как «свойство есть только в dxdsfluent»;');
  out('- **каналы клампятся как в браузере** — legacy fluent в тёмном режиме содержит внегамутное');
  out('  `hsla(0,0%,-46.42%,.2)`, и буквальное сравнение показало бы отличие там, где его не видно.\n');
  out('Пересобрать бандлы перед регенерацией:\n');
  out('```bash');
  out('pnpm nx build:themes-dev devextreme-scss --devBundles=fluent.blue.light,fluent.blue.dark,dxdsfluent.blue.light,dxdsfluent.blue.dark');
  out('```\n');
  out('| Решение | Отличий |');
  out('|---|---|');
  totals.forEach((row) => out(`| ${row.id}. ${row.title} | ${row.counts} |`));
  out('');
  report.forEach(({ decision, perMode }) => {
    out(`### Решение ${decision.id}. ${decision.title}\n`);
    out(`Записи журнала: ${decision.entries.join('; ')}.\n`);
    (decision.unmeasured ?? []).forEach((entry) => out(`- *без цветового доказательства:* ${entry}`));
    if (decision.unmeasured) out('');
    perMode.forEach(({ mode, rows }) => {
      if (!rows.length) return;
      out(`**${mode}**\n`);
      out('| Место | fluent | dxdsfluent |');
      out('|---|---|---|');
      rows.forEach((row) => out(`| \`${row.key.replace(/\|/g, '\\|')}\` | ${row.before} | ${row.after} |`));
      out('');
    });
  });
} else {
  report.forEach(({ decision, perMode }) => {
    out(`\n=== Решение ${decision.id}. ${decision.title}`);
    out(`    записи: ${decision.entries.join('; ')}`);
    (decision.unmeasured ?? []).forEach((entry) => out(`    без цветового доказательства: ${entry}`));
    perMode.forEach(({ mode, rows, shape }) => {
      const colours = rows.filter((row) => row.kind === 'colour');
      const texts = rows.filter((row) => row.kind === 'text');
      out(`  [${mode}] отличий цвета: ${colours.length}, отличий текста значения: ${texts.length}, только в dxdsfluent: ${shape.length}`);
      [...colours, ...texts].slice(0, onlyDecision ? 500 : 6).forEach((row) => {
        out(`      ${row.before}  ->  ${row.after}   ${row.key}`);
      });
      if (!onlyDecision && rows.length > 6) out(`      … ещё ${rows.length - 6} (--decision=${decision.id})`);
    });
  });
  const total = report.reduce((sum, { perMode }) => sum
    + perMode.reduce((inner, { rows }) => inner + rows.length, 0), 0);
  out(`\nвсего отличий по агенде: ${total}`);
}
