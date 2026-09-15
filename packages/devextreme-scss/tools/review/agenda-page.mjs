/*
 * Раздаточная страница к созвону дизайн-ревью fluent-next.
 *
 *   node tools/review/agenda-page.mjs                  # → scss/widgets/fluent-next/REVIEW_AGENDA.html
 *   node tools/review/agenda-page.mjs --out=/tmp/a.html
 *
 * Редакторский слой (вопрос, варианты, цена решения) живёт здесь; цвета — нет. Все пары
 * «было → стало» читаются из REVIEW_EVIDENCE.md, который генерирует evidence.mjs из собранных
 * бандлов, поэтому страница не может разойтись с замером: чтобы обновить цифры, перегенерируйте
 * сначала доказательства, потом страницу.
 *
 * Свотчи с альфой композитятся на подложку своего бандла (light — neutral-10, dark — neutral-250),
 * иначе полупрозрачный тинт на белой карточке выглядит светлее, чем он на экране.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const themeDir = join(here, '..', '..', 'scss', 'widgets', 'fluent-next');
const evidenceFile = join(themeDir, 'REVIEW_EVIDENCE.md');
const outFile = /--out=(\S+)/.exec(process.argv.join(' '))?.[1] ?? join(themeDir, 'REVIEW_AGENDA.html');

/* ------------------------------------------------------------------ подложки */

const GROUND = { light: '#ffffff', dark: '#242424' };

/* ------------------------------------------------------------------ цвет */

const parseColour = (text) => {
  const match = /^#([0-9a-f]{6})(?:\s*@(\d+)%)?$/i.exec(text.trim());
  if (!match) return null;
  const n = (i) => parseInt(match[1].slice(i * 2, i * 2 + 2), 16);
  return { r: n(0), g: n(1), b: n(2), a: match[2] === undefined ? 1 : Number(match[2]) / 100 };
};

const over = (colour, groundHex) => {
  const g = parseColour(groundHex);
  const blend = (c, base) => Math.round(c * colour.a + base * (1 - colour.a));
  return { r: blend(colour.r, g.r), g: blend(colour.g, g.g), b: blend(colour.b, g.b), a: 1 };
};

const css = ({ r, g, b }) => `rgb(${r} ${g} ${b})`;

/** CIE76 по композиченным цветам: «насколько это видно», а не «насколько разные числа». */
const deltaE = (one, two) => {
  const lab = ({ r, g, b }) => {
    const lin = (v) => {
      const c = v / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    const [R, G, B] = [lin(r), lin(g), lin(b)];
    const x = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
    const y = R * 0.2126 + G * 0.7152 + B * 0.0722;
    const z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
  };
  const [l1, a1, b1] = lab(one);
  const [l2, a2, b2] = lab(two);
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
};

/* --------------------------------------------------- разбор доказательств */

const parseEvidence = (markdown) => {
  const decisions = new Map();
  let current = null;
  let mode = null;

  markdown.split('\n').forEach((line) => {
    const head = /^### Решение (\d+)\. (.+)$/.exec(line);
    if (head) {
      current = { id: Number(head[1]), title: head[2], entries: [], unmeasured: [], rows: { light: [], dark: [] } };
      decisions.set(current.id, current);
      mode = null;
      return;
    }
    if (!current) return;

    const entries = /^Записи журнала: (.+)\.$/.exec(line);
    if (entries) { current.entries = entries[1].split('; '); return; }

    const unmeasured = /^- \*без цветового доказательства:\* (.+)$/.exec(line);
    if (unmeasured) { current.unmeasured.push(unmeasured[1]); return; }

    const modeHead = /^\*\*(light|dark)\*\*$/.exec(line);
    if (modeHead) { mode = modeHead[1]; return; }

    const row = /^\| `(.+?)` \| (.+?) \| (.+?) \|$/.exec(line);
    if (row && mode) {
      const [selector, prop] = row[1].replace(/\\\|/g, '|').split(' | ');
      current.rows[mode].push({ selector, prop, before: row[2].trim(), after: row[3].trim() });
    }
  });

  return decisions;
};

/** Виджет по селектору — чтобы 62 строки читались группами, а не сплошным списком. */
const WIDGETS = [
  [/dxdi-|\.dx-diagram/, 'Diagram'],
  [/\.dx-datagrid|\.dx-row-alt|\.dx-master-detail/, 'DataGrid'],
  [/\.dx-scheduler/, 'Scheduler'],
  [/\.dx-gantt/, 'Gantt'],
  [/\.dx-button/, 'Button'],
  [/\.dx-toast/, 'Toast'],
  [/\.dx-calendar/, 'Calendar'],
  [/\.dx-loadindicator/, 'LoadIndicator'],
  [/\.dx-filterbuilder/, 'FilterBuilder'],
  [/\.dx-chat/, 'Chat'],
  [/\.dx-splitter|\.dx-resize-handle/, 'Splitter'],
  [/\.dx-pivotgrid/, 'PivotGrid'],
  [/\.dx-informer/, 'Informer'],
  [/\.dx-progressbar/, 'ProgressBar'],
  [/\.dx-slider/, 'Slider'],
  [/\.dx-gallery/, 'Gallery'],
  [/\.dx-tile/, 'TileView'],
  [/\.dx-dateview/, 'DateView'],
  [/\.dx-switch/, 'Switch'],
  [/\.dx-htmleditor/, 'HtmlEditor'],
  [/\.dx-filemanager/, 'FileManager'],
];

const widgetOf = (selector) => WIDGETS.find(([pattern]) => pattern.test(selector))?.[1] ?? 'прочее';

/* ------------------------------------------------------ редакторский слой */

const AGENDA = [
  {
    id: 1,
    decided: { model: 'Модель DS' },
    reviewNote: 'Все изменения заапрувлены.',
    status: 'open',
    short: 'Тёмный режим',
    question: 'Тёмный режим: цветная поверхность со статическим белым текстом — или legacy-инверсия?',
    stake: 'Самое заметное отличие всей волны: в legacy тёмная тема заливала цветные элементы пастельным '
      + 'фоном и клала на него тёмный текст, fluent-next следует модели DS — насыщенная поверхность '
      + 'и статический content поверх неё, одинаковый в обоих режимах.',
    groups: [{
      id: 'model',
      label: 'Модель',
      options: [
        { label: 'Модель DS', detail: 'насыщенная поверхность + статический белый content, как сейчас и как в Blazor Fluent', current: true },
        { label: 'Legacy-инверсия', detail: 'пастельный фон + тёмный текст, как в fluent до миграции' },
      ],
    }],
    affects: ['Button contained (default / danger / success)', 'Toast', 'выбранная дата в Calendar',
      'стрелка навигации в Gallery', 'ручка Splitter в фокусе', 'DataGrid: ошибка строки, drop-highlight, подсветка поиска'],
    cost: 'пара ролей на объявление; правится в объявлениях темы, правил не касается',
  },
  {
    id: 2,
    decided: { family: 'deep' },
    status: 'open',
    short: 'Семейство тинтов',
    question: 'Из какого семейства берём тинты hover / active / selected?',
    stake: 'Самый массовый пункт агенды. В legacy тинты считались HSL-подстройкой от акцента и в светлом '
      + 'режиме были почти белыми (4–8%); в foundation готовых семейств три, и выбор одного меняет '
      + 'плотность подсветки везде разом.',
    groups: [{
      id: 'family',
      label: 'Семейство',
      options: [
        { label: 'deep', detail: 'ступени палитры 20/40/30 — как сейчас', current: true },
        { label: 'subdued', detail: 'светлее deep, ближе к legacy-плотности' },
        { label: 'alpha', detail: 'существует только для primary и neutral — цветные тинты придётся добирать иначе' },
        { label: 'подход Blazor', detail: 'нейтральный ховер-фон, цвет уходит в content' },
      ],
    }],
    affects: ['Button outlined / text — ховер-тинты', 'чипы FilterBuilder и бабблы Chat', 'ручка Splitter',
      'чипы и общий итог PivotGrid', 'Informer / ProgressBar / Slider', 'DataGrid: строка в фокусе',
      'DataGrid: нейтральная глубина — filter row, master-detail, чередование строк'],
    caution: 'В тёмном режиме цветной content на deep-active (danger-текст на danger-deep-active) '
      + 'контрастирует слабее, чем legacy-белый на тёмном фоне — стоит посмотреть именно эту пару.',
    cost: 'замена одной строки на запись журнала',
  },
  {
    id: 3,
    decided: { bridges: 'Принять мосты' },
    reviewNote: 'Вынесено в карточку дизайн-команды design#1554 (github.com/DevExpress/design/issues/1554) — рассмотрение идёт там, для выпуска темы не стоппер.',
    status: 'open',
    short: 'Мосты с альфой',
    question: 'Мосты rgb(from … / a) — штатный механизм или заказ ролей с альфой в пакет?',
    stake: 'Там, где legacy брал цвет с произвольной альфой, в foundation роли нет. Сейчас такие места '
      + 'написаны как relative color поверх существующей роли: смысл сохраняется, зависимость от роли '
      + 'тоже, но это наш локальный приём, а не механизм дизайн-системы.',
    groups: [{
      id: 'bridges',
      label: 'Решение',
      options: [
        { label: 'Принять мосты', detail: 'остаются штатным приёмом темы; в пакет ничего не заказываем', current: true },
        { label: 'Заказать роли с альфой', detail: 'места переезжают на новые роли, пункт становится эскалацией в команду токенов' },
      ],
    }],
    affects: ['границы и градиенты: TileView, Gallery, DateView', 'кольцо ручки Switch', 'накладки HtmlEditor',
      'оверлей выделения в FileManager (.8 / .7)', 'граница drag-header в гридах', 'часть базового слоя'],
    cost: 'принять — ноль правок; заказать — по строке на место после появления ролей',
  },
  {
    id: 4,
    decided: { search: 'Роль highlight', currenttime: 'surface-danger', diagrammarks: 'border-neutral-accessible' },
    reviewNote: 'Решение по подсветке поиска пересмотрено после созвона: принята пара highlight — и поверхность, и content.',
    status: 'open',
    short: 'Смена тона (3 места)',
    question: 'Три места, где сменился не оттенок, а цвет — принимаем или возвращаем?',
    stake: 'В остальных записях расхождение — это ступень шкалы. Здесь другое: цвет как таковой другой, '
      + 'и каждое место решается независимо от двух других.',
    groups: [
      {
        id: 'search',
        label: 'Подсветка поиска в гридах',
        options: [
          { label: 'Роль highlight', detail: 'штатная пара foundation: жёлтый маркер #ffee80 с текстом #161616 в светлом, #665400 с белым в тёмном; контраст 15.3:1 и 7.4:1', current: true },
          { label: 'Акцентный синий', detail: 'прежний вариант: surface-primary + белый content, контраст 5.4:1 — legacy-вид fluent' },
        ],
      },
      {
        id: 'currenttime',
        label: 'Индикатор текущего времени в Scheduler',
        options: [
          { label: 'surface-danger', detail: 'роль вместо литерала; тон плотнее legacy-#eb5757', current: true },
          { label: 'Вернуть мягкий красный', detail: 'потребует литерала или новой роли под маркер времени' },
        ],
      },
      {
        id: 'diagrammarks',
        label: 'Метки выделения на канве Diagram',
        options: [
          { label: 'border-neutral-accessible', detail: 'в светлом сдвиг #666 → #767676, в тёмном метки впервые становятся видимыми', current: true },
          { label: 'Вернуть #666', detail: 'literal без адаптации к тёмному режиму, как в legacy' },
        ],
      },
    ],
    affects: [],
    cost: 'каждое — одна строка',
  },
  {
    id: 5,
    decided: { sparkle: 'Оставить аппроксимацию', selected: 'Оставить hovered', sizes: 'Подтвердить как модель', datauri: 'Оставить legacy-литералы' },
    status: 'open',
    short: 'Дыры foundation',
    question: 'Подтвердить дыры foundation и сформулировать запросы в команду токенов',
    stake: 'Здесь мы не выбираем между вариантами дизайна: нужно подтверждение, что роли действительно '
      + 'нет, и формулировка запроса. Пока роли нет, в теме живёт обходной маппинг. Дорожка спиннера '
      + 'с этого пункта снята 12.08: обход воспроизводит legacy с точностью до ступени (ΔE 1.9 в светлом, '
      + '6.3 в тёмном), решать дизайну нечего — дефект пакета переехал в вопросы команде токенов.',
    groups: [
      {
        id: 'sparkle',
        label: 'Мерцание sparkle: роли нет',
        options: [
          { label: 'Заказать роль', detail: 'градиент мерцания собирается из трёх primary-поверхностей и читается иначе, чем legacy' },
          { label: 'Оставить аппроксимацию', detail: 'декоративный градиент, точность не критична', current: true },
        ],
      },
      {
        id: 'selected',
        label: 'Нет content-роли для состояния selected',
        options: [
          { label: 'Заказать роль', detail: 'в шкалах content есть только rest / hovered / active', current: true },
          { label: 'Оставить hovered', detail: 'выбранное состояние продолжает брать content-*-default-hovered' },
        ],
      },
      {
        id: 'sizes',
        label: 'Нет семантического уровня для размеров',
        options: [
          { label: 'Заказать роли размеров', detail: '63% var()-ссылок (≈2800 на бандл) идут прямо на базовые шкалы' },
          { label: 'Подтвердить как модель', detail: 'прямое обращение к базовым шкалам — предполагаемое поведение для размеров; продолжение разбора — в карточке design#1555', current: true },
        ],
      },
      {
        id: 'datauri',
        label: 'Иконки в data-uri не читают токены',
        options: [
          { label: 'Конкретные значения из DS', detail: 'пакет отдаёт не-var() значения цветов иконок для шага сборки data-uri' },
          { label: 'Перевести на mask-image', detail: 'правка разметки компонентов, выходит за рамки NFR-1' },
          { label: 'Оставить legacy-литералы', detail: 'цвета иконок остаются вне цепочки токенов, как сейчас', current: true },
        ],
      },
    ],
    affects: [],
    cost: 'решение = формулировка запроса; правки в теме появятся после ролей',
  },
  {
    id: 6,
    decided: { badge: 'Оставить как есть' },
    status: 'closed',
    short: 'Двухролевые (закрыто)',
    question: 'Двухролевые переменные — разделены 06.08',
    stake: 'Снято с созвона: обе переменные разделены. Scheduler — фон бейджа даты выведен в '
      + '$scheduler-current-time-cell-date-bg и инициализирован от доминирующей роли, так что связка '
      + 'сохраняется по умолчанию, а дрейф возможен только осознанным переопределением; трёхролевая '
      + 'переменная чекбокса в TreeView разложена на границу, глиф и фон. Байт-нейтрально, правил не касалось.',
    groups: [{
      id: 'badge',
      label: 'Остаточный вопрос',
      options: [
        { label: 'Оставить как есть', detail: 'бейдж повторяет цвет текста ячейки', current: true },
        { label: 'Задать бейджу свой цвет', detail: 'переопределение одной переменной — модели решения не требует' },
      ],
    }],
    affects: [],
    cost: 'одна строка',
  },
  {
    id: 7,
    decided: { neutralbutton: 'Оставить альфу', diagram: 'Принять роли', gantt: 'surface-primary-compound' },
    status: 'open',
    short: 'Точечные',
    question: 'Точечные расхождения — по одному',
    stake: 'Записи, которые не сводятся к общей модели: каждая живёт сама по себе.',
    groups: [
      {
        id: 'neutralbutton',
        label: 'Нейтральная кнопка на альфе',
        options: [
          { label: 'Оставить альфу', detail: 'нейтральная кнопка DS построена на альфе 0%; отличие видно только на цветных подложках и подложках с картинкой', current: true },
          { label: 'Вернуть сплошной фон', detail: 'кнопка перестаёт следовать модели DS' },
        ],
      },
      {
        id: 'diagram',
        label: 'Diagram: канва, тени, format-active',
        options: [
          { label: 'Принять роли', detail: 'канва на surface-neutral-subdued, тень на shadow-key (альфа .14/.28 против legacy .175)', current: true },
          { label: 'Разобрать по местам', detail: 'вернуться к отдельным значениям там, где сдвиг заметен' },
        ],
      },
      {
        id: 'gantt',
        label: 'Gantt: семейство полос и роль акцента',
        options: [
          { label: 'surface-primary-compound', detail: 'решение первого ревью «в тёмном полосы светлее»; после 262.6.0 тон сменился #3c92e9 → #4b90d9', current: true },
          { label: 'surface-primary-default', detail: 'тёмные полосы возвращаются к #0f6cbd — решение первого ревью откатывается' },
        ],
      },
    ],
    affects: ['родительские задачи в пресете saas стали зелёными — ветка свёрнута',
      'остаток базового слоя: шейдер диалога, code-block и плейсхолдер HtmlEditor, тулбар popup-title в Diagram, тени перетаскивания'],
    cost: 'по одной строке на место',
  },
];

const PACKAGE_QUESTIONS = [
  {
    title: '601 компонент-токен без единого потребителя',
    body: 'Пакет шипит их в :root каждого бандла — около 40 КБ. После отказа от компонентного тира '
      + 'тема не читает ни один. Убирать ли эмиссию components/theme.scss из бандла? Контраргумент: '
      + 'токены публичны для пользовательской кастомизации через --dxds-*.',
  },
  {
    title: 'Опечатка в имени токена',
    body: 'switch-color-checked-bg-disable — без «d» на конце. Имя публичное, поэтому исправление '
      + 'ломающее: нужен план.',
  },
  {
    title: 'Тон полос Gantt сменил пакет',
    body: 'После переякоривания палитр в 262.6.0 тёмные полосы уехали #3c92e9 → #4b90d9. Направление '
      + 'решения первого ревью («в тёмном светлее») сохранено, но точный тон выбрали не мы — подтвердить.',
  },
  {
    title: 'Эскалация по спиннеру не закрыта',
    body: 'Сверено 12.08 по собранному бандлу: spinner-color-primary-loader-rest ведёт на '
      + 'content-primary-default-rest, track — на content-primary-compound-rest, и обе роли резолвятся в '
      + 'одну ступень в обоих режимах (#0f6cbd светлый, #4b90d9 тёмный). Переименование в 262.6.0 дефект '
      + 'не починило. На вид темы это не влияет: дорожка живёт на обходе (surface-primary-subdued), а '
      + 'компонентный тир тема не потребляет — то есть это гигиена пакета, а не блокер поставки.',
  },
];

const SCALE_REQUESTS = [
  {
    title: '55 значений вне шкал',
    body: 'Оставлены px-литералами с маркером dx-offscale: 27, 35, 38, 42, 43, 46, 49, 50, 51, 57, 58, '
      + '62, 65, 68, 69, 78, 90, 93, 102, 105, 115, 130, 140, 150, 156, 180, 182, 190, 200, 220, 250, '
      + '252, 260, 264, 272, 280, 288, 299, 450. Больше всего в ColorView (8), Diagram (7), CardView (6), '
      + 'Scheduler (5). Отдельно 1.5px — граница дропзоны CardView, единственный субпиксельный случай. '
      + 'Вопрос: какие заслуживают ступеней шкалы, а какие остаются фиксированными габаритами.',
  },
  {
    title: 'Пропорциональные величины (em) — шкалы нет',
    body: '37 мест помечено маркером dx-relative: шрифтовые пропорции (0.85em у подписи слайдера, тултипа '
      + 'и сообщения об ошибке FileManager), размеры контейнеров (2em у стрелки раскрытия меню, 3em у строки '
      + 'списка), отступы 0.4em и 1em; плюс соглашение 999em для полностью скруглённых pill в пяти файлах. '
      + 'Маршрутизировать их не на что: пакет поставляет только абсолютные px/rem, а перевод em в абсолютный '
      + 'токен меняет поведение — em считается от font-size самого элемента, токен от корня. Сейчас это '
      + 'литералы в базовых переменных, байт-идентично во всех темах, в бандлах паритет с legacy (146 против '
      + '147 у fluent). Вопрос: нужна ли DS роль для пропорциональных величин — или em остаются вне системы '
      + 'токенов по замыслу. Второе тоже ответ, его достаточно зафиксировать.',
  },
  {
    title: 'Типографика вне ролей',
    body: 'font-size 110 / 180 / 220 / 260 / 360, line-height 120 / 180, font-weight 500 живут на базовых '
      + 'ступенях с маркером dx-no-semantic-role — кандидаты на новые роли. Размеры глифов иконок '
      + 'сознательно остаются на базовых ступенях.',
  },
];

const BASE_OWNERS = [
  {
    title: 'base и тема красят одно свойство дважды (6 мест)',
    body: 'Наша половина закрыта полностью 12.08 — расфидлены все 6 из 6, последним contextMenu; диф '
      + 'бандлов fluent-next: одна мёртвая декларация на бандл, значение эквивалентно. Действий с нашей '
      + 'стороны нет. Владельцам base: правила мертвы НЕ во всех темах — удалять целиком нельзя. Безопасно '
      + 'убираются четыре (popup min-height, .dx-page padding, .dx-navigate-button width, fileuploader '
      + 'padding). Два оставшихся живые: .dx-checkbox-text padding-inline-start не перекрывают ни generic, '
      + 'ни material, а .dx-context-menu .dx-menu-items-container padding не перекрывает generic — там base '
      + 'единственный источник значения. Публичных ключей ThemeBuilder среди шести переменных нет.',
    weight: 'наша половина закрыта',
  },
  {
    title: 'Мёртвый параметр treeview-checkbox() держится ключом ThemeBuilder',
    body: 'Сверено с кодом 12.08: $checkbox-border-color-focused встречается в base/treeView/_index.scss '
      + 'ровно один раз — в сигнатуре на строке 138; в теле миксина его нет, значение темы не доходит до '
      + 'CSS. Публичный ключ «70. Focused state border color» лежит плоским списком в '
      + 'dx-theme-builder-metadata.ts:806 и держит объявления в трёх legacy-темах. Наша половина закрыта: '
      + 'имя темы грамматическое, написание base живёт только в именованном аргументе вызова. Развязок '
      + 'две, обе за владельцами: либо миксин начинает параметр использовать, либо ключ уходит из метаданных.',
    weight: 'узел в base цел',
  },
];

/* ------------------------------------------------------------------ вывод */

const escape = (text) => String(text)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const plural = (count, one, few, many) => {
  const tail = count % 100;
  if (tail >= 11 && tail <= 14) return many;
  if (count % 10 === 1) return one;
  if (count % 10 >= 2 && count % 10 <= 4) return few;
  return many;
};

const swatch = (value, mode) => {
  const colour = parseColour(value);
  if (!colour) return `<span class="raw">${escape(value)}</span>`;
  const flat = over(colour, GROUND[mode]);
  const alpha = colour.a === 1 ? '' : `<i class="alpha">@${Math.round(colour.a * 100)}%</i>`;
  return `<span class="chip"><span class="sw" style="background:${css(flat)}"></span>`
    + `<span class="hex">${escape(value.split(' ')[0])}${alpha}</span></span>`;
};

const deltaOf = (row, mode) => {
  const before = parseColour(row.before);
  const after = parseColour(row.after);
  if (!before || !after) return null;
  return deltaE(over(before, GROUND[mode]), over(after, GROUND[mode]));
};

const rank = (delta) => (delta === null ? 'text' : delta < 5 ? 'low' : delta < 20 ? 'mid' : 'high');

const RANK_TITLE = {
  low: 'сдвиг оттенка — на глаз почти не читается',
  mid: 'заметно на глаз',
  high: 'воспринимается как другой цвет',
  text: 'не одиночный цвет — сравнение по тексту значения',
};

const evidenceTable = (rows, mode) => {
  const groups = new Map();
  rows.forEach((row) => {
    const widget = widgetOf(row.selector);
    if (!groups.has(widget)) groups.set(widget, []);
    groups.get(widget).push(row);
  });

  const body = [...groups.entries()].map(([widget, list]) => {
    const cells = list.map((row) => {
      const delta = deltaOf(row, mode);
      const level = rank(delta);
      return `<tr class="row" data-delta="${delta === null ? -1 : delta.toFixed(2)}" data-place="${escape((row.selector + ' ' + row.prop).toLowerCase())}">
        <td class="place"><code>${escape(row.selector)}</code><span class="prop">${escape(row.prop)}</span></td>
        <td class="val">${swatch(row.before, mode)}</td>
        <td class="val">${swatch(row.after, mode)}</td>
        <td class="delta"><span class="dot ${level}" title="${RANK_TITLE[level]}"></span>${delta === null ? '—' : delta.toFixed(1)}</td>
      </tr>`;
    }).join('\n');
    return `<tr class="grouphead"><th colspan="4">${escape(widget)} <span class="count">${list.length}</span></th></tr>\n${cells}`;
  }).join('\n');

  return `<div class="tablewrap"><table class="evidence">
    <thead><tr><th>Место</th><th>fluent</th><th>fluent-next</th><th class="delta">Δ</th></tr></thead>
    <tbody>${body}</tbody>
  </table></div>`;
};

const optionChips = (decision, group) => group.options.map((option, index) => {
  const picked = decision.decided?.[group.id] === option.label;
  const badge = picked
    ? '<i class="now is-verdict">принято</i>'
    : (option.current ? '<i class="now">сейчас</i>' : '');
  return `
  <button type="button" class="option${option.current ? ' is-current' : ''}${picked ? ' is-decided' : ''}"
    data-choice="${decision.id}.${group.id}" data-value="${escape(option.label)}" data-index="${index}">
    <span class="option-label">${escape(option.label)}${badge}</span>
    <span class="option-detail">${escape(option.detail)}</span>
  </button>`;
}).join('');

const decisionSection = (decision, evidence) => {
  const counts = ['light', 'dark']
    .map((mode) => ({ mode, n: evidence?.rows[mode].length ?? 0 }))
    .filter(({ n }) => n > 0);
  const total = counts.reduce((sum, { n }) => sum + n, 0);
  const closed = decision.status === 'closed';
  const tentative = /предварительно/i.test(decision.reviewNote ?? '');
  const verdictChip = closed
    ? '<span class="status closed">закрыто 06.08</span>'
    : `<span class="status ${tentative ? 'tentative' : 'decided'}">${tentative ? 'принято предварительно' : 'принято 12.08'}</span>`;

  const modes = counts.map(({ mode, n }) => `
    <section class="modeblock" data-mode="${mode}">
      <h4 class="modehead"><span class="modename">${mode === 'light' ? 'светлый бандл' : 'тёмный бандл'}</span>
        <span class="modecount">${n}</span></h4>
      ${evidenceTable(evidence.rows[mode], mode)}
    </section>`).join('');

  return `
<section class="decision${closed ? ' is-closed' : ''}" id="d${decision.id}">
  <header class="dhead">
    <div class="eyebrow">
      <span class="dnum">Решение ${decision.id}</span>
      ${verdictChip}
      ${total ? `<span class="dcount">${counts.map(({ mode, n }) => `${mode === 'light' ? 'светлый' : 'тёмный'} ${n}`).join(' · ')}</span>` : ''}
    </div>
    <h2>${escape(decision.question)}</h2>
    <p class="stake">${escape(decision.stake)}</p>
    ${decision.reviewNote ? `<p class="reviewnote"><span>заметка ревью</span> ${escape(decision.reviewNote)}</p>` : ''}
  </header>

  ${decision.groups.map((group) => `
    <div class="choice">
      <h3 class="choicehead">${escape(group.label)}</h3>
      <div class="options">${optionChips(decision, group)}</div>
    </div>`).join('')}

  ${decision.caution ? `<p class="caution">${escape(decision.caution)}</p>` : ''}

  ${decision.affects.length ? `<div class="affects"><h3>Что затрагивает</h3><ul>${decision.affects
    .map((item) => `<li>${escape(item)}</li>`).join('')}</ul></div>` : ''}

  ${evidence?.unmeasured.length ? `<p class="unmeasured">Без цветового доказательства: ${evidence.unmeasured
    .map(escape).join('; ')}.</p>` : ''}

  <div class="meta"><span class="metalabel">Цена решения</span> ${escape(decision.cost)}</div>

  ${total ? `<details class="evidencebox">
    <summary><span class="summary-title">Доказательства</span>
      <span class="summary-count">${total} ${plural(total, 'место', 'места', 'мест')}, где меняется цвет</span></summary>
    <div class="evidencebody">${modes}</div>
  </details>` : ''}

  <label class="note"><span>Заметка с созвона</span>
    <input type="text" data-note="${decision.id}" placeholder="что решили, кто уточняет" /></label>
</section>`;
};

const listBlock = (id, title, lead, items, extra = '') => `
<section class="block" id="${id}">
  <header class="bhead"><h2>${escape(title)}</h2><p>${escape(lead)}</p></header>
  <ul class="cards">${items.map((item) => `
    <li class="card">
      <h3>${escape(item.title)}${item.weight ? `<span class="weight">${escape(item.weight)}</span>` : ''}</h3>
      <p>${escape(item.body)}</p>
    </li>`).join('')}</ul>
  ${extra}
</section>`;

/** Счётчик статусов берётся из журнала, а не из памяти: шаблон записи в нём не матчится. */
const countStatus = (status) => (readFileSync(join(themeDir, 'DIVERGENCES.journal.md'), 'utf8')
  .match(new RegExp(`^## .*\\(status: ${status}\\)\\s*$`, 'gm')) ?? []).length;

const page = (decisions) => {
  const open = AGENDA.filter((d) => d.status === 'open');
  const totalPlaces = [...decisions.values()]
    .reduce((sum, d) => sum + d.rows.light.length + d.rows.dark.length, 0);
  const review = countStatus('review');

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>fluent-next — агенда дизайн-ревью</title>
<style>
:root {
  color-scheme: light dark;
  --ink: #14171c;
  --ink-soft: #565e6b;
  --ink-faint: #858d9a;
  --page: #f4f6f8;
  --card: #ffffff;
  --line: #e0e5ec;
  --line-soft: #eef1f5;
  --accent: #0f6cbd;
  --accent-soft: #e8f0fa;
  --open: #8a5a00;
  --open-bg: #fdf3e0;
  --closed: #2f6f3e;
  --closed-bg: #e9f4ec;
  --ground-light: #ffffff;
  --ground-dark: #242424;
  --sans: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  --mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  --radius: 10px;
}
@media (prefers-color-scheme: dark) {
  :root {
    --ink: #e7eaef; --ink-soft: #a6aeba; --ink-faint: #79818e;
    --page: #0f1216; --card: #171b21; --line: #272d36; --line-soft: #1e232a;
    --accent: #6aa9e6; --accent-soft: #17242f;
    --open: #e0ad5a; --open-bg: #2a2317; --closed: #7fc08e; --closed-bg: #16251a;
  }
}
:root[data-theme="dark"] {
  --ink: #e7eaef; --ink-soft: #a6aeba; --ink-faint: #79818e;
  --page: #0f1216; --card: #171b21; --line: #272d36; --line-soft: #1e232a;
  --accent: #6aa9e6; --accent-soft: #17242f;
  --open: #e0ad5a; --open-bg: #2a2317; --closed: #7fc08e; --closed-bg: #16251a;
}
:root[data-theme="light"] {
  --ink: #14171c; --ink-soft: #565e6b; --ink-faint: #858d9a;
  --page: #f4f6f8; --card: #ffffff; --line: #e0e5ec; --line-soft: #eef1f5;
  --accent: #0f6cbd; --accent-soft: #e8f0fa;
  --open: #8a5a00; --open-bg: #fdf3e0; --closed: #2f6f3e; --closed-bg: #e9f4ec;
}

* { box-sizing: border-box; }
body {
  margin: 0; background: var(--page); color: var(--ink);
  font: 15px/1.55 var(--sans); -webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4 { margin: 0; text-wrap: balance; font-weight: 600; }
p { margin: 0; }
code { font-family: var(--mono); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }

.masthead {
  border-bottom: 1px solid var(--line); background: var(--card);
  padding: 34px 28px 26px;
}
.masthead-inner { max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 18px; }
.kicker {
  font: 600 11px/1 var(--mono); letter-spacing: .16em; text-transform: uppercase; color: var(--ink-faint);
}
.masthead h1 { font-size: clamp(26px, 3.4vw, 38px); letter-spacing: -.02em; }
.lede { color: var(--ink-soft); max-width: 68ch; }
.facts { display: flex; flex-wrap: wrap; gap: 10px 28px; padding-top: 4px; }
.fact { display: flex; flex-direction: column; gap: 2px; }
.fact b { font: 600 20px/1.1 var(--sans); font-variant-numeric: tabular-nums; }
.fact span { font-size: 12px; color: var(--ink-faint); }

.toolbar {
  position: sticky; top: 0; z-index: 20;
  background: color-mix(in srgb, var(--page) 88%, transparent);
  backdrop-filter: blur(8px); border-bottom: 1px solid var(--line);
}
.toolbar-inner {
  max-width: 1240px; margin: 0 auto; padding: 10px 28px;
  display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: center;
}
.seg { display: inline-flex; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: var(--card); }
.seg button {
  font: 500 13px var(--sans); color: var(--ink-soft); background: none; border: 0;
  padding: 6px 12px; cursor: pointer;
}
.seg button[aria-pressed="true"] { background: var(--accent-soft); color: var(--accent); }
.seg button + button { border-left: 1px solid var(--line); }
.tool-label { font-size: 12px; color: var(--ink-faint); }
input[type="search"], .note input {
  font: 14px var(--sans); color: var(--ink); background: var(--card);
  border: 1px solid var(--line); border-radius: 8px; padding: 7px 10px;
}
input[type="search"] { min-width: 220px; }
.ghost {
  font: 500 13px var(--sans); color: var(--ink-soft); background: var(--card);
  border: 1px solid var(--line); border-radius: 8px; padding: 7px 12px; cursor: pointer;
}
.ghost:hover { color: var(--ink); border-color: var(--ink-faint); }

.layout {
  max-width: 1240px; margin: 0 auto; padding: 28px;
  display: grid; grid-template-columns: 210px minmax(0, 1fr); gap: 36px; align-items: start;
}
@media (max-width: 1000px) { .layout { grid-template-columns: minmax(0, 1fr); } .rail { display: none; } }

.rail { position: sticky; top: 66px; display: flex; flex-direction: column; gap: 4px; }
.rail a {
  display: flex; align-items: baseline; gap: 8px; text-decoration: none; color: var(--ink-soft);
  font-size: 13px; padding: 5px 8px; border-radius: 6px; border-left: 2px solid transparent;
}
.rail a:hover { background: var(--line-soft); color: var(--ink); }
.rail a.is-active { border-left-color: var(--accent); color: var(--ink); background: var(--line-soft); }
.rail .n { font: 600 11px var(--mono); color: var(--ink-faint); min-width: 14px; }
.rail .railsplit { margin-top: 14px; font: 600 10px/1 var(--mono); letter-spacing: .14em;
  text-transform: uppercase; color: var(--ink-faint); padding: 0 8px 4px; }

main { display: flex; flex-direction: column; gap: 22px; }

.decision, .block {
  background: var(--card); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 24px; display: flex; flex-direction: column; gap: 16px; scroll-margin-top: 74px;
}
.decision.is-closed { opacity: .78; }
.decision.is-closed:hover, .decision.is-closed:focus-within { opacity: 1; }
.dhead { display: flex; flex-direction: column; gap: 8px; }
.eyebrow { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.dnum { font: 600 11px/1 var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--ink-faint); }
.status {
  font: 600 11px/1 var(--sans); padding: 4px 8px; border-radius: 999px; letter-spacing: .02em;
}
.status.open { background: var(--open-bg); color: var(--open); }
.status.closed, .status.decided { background: var(--closed-bg); color: var(--closed); }
.status.tentative { background: var(--open-bg); color: var(--open); }
.reviewnote { font-size: 13.5px; color: var(--ink-soft); display: flex; flex-wrap: wrap; gap: 8px; align-items: baseline; }
.reviewnote span {
  font: 600 11px/1 var(--sans); letter-spacing: .04em; text-transform: uppercase; color: var(--ink-faint);
  border: 1px solid var(--line); border-radius: 4px; padding: 3px 6px;
}
.option.is-decided { border-color: var(--closed); box-shadow: inset 0 0 0 1px var(--closed); background: var(--closed-bg); }
.option .now.is-verdict { color: var(--closed); border-color: var(--closed); }
.dcount { font: 12px var(--mono); color: var(--ink-faint); font-variant-numeric: tabular-nums; }
.decision h2 { font-size: 20px; letter-spacing: -.01em; max-width: 60ch; }
.stake { color: var(--ink-soft); max-width: 72ch; }

.choice { display: flex; flex-direction: column; gap: 8px; }
.choicehead { font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-faint); }
.options { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 8px; }
.option {
  text-align: left; display: flex; flex-direction: column; gap: 4px; cursor: pointer;
  background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 10px 12px;
  font: inherit; color: var(--ink);
}
.option:hover { border-color: var(--ink-faint); }
.option.is-picked { border-color: var(--accent); background: var(--accent-soft); box-shadow: inset 0 0 0 1px var(--accent); }
.option-label { font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 6px; }
.option .now {
  font: 500 10px/1 var(--sans); font-style: normal; letter-spacing: .04em; text-transform: uppercase;
  color: var(--ink-faint); border: 1px solid var(--line); border-radius: 4px; padding: 3px 5px;
}
.option-detail { font-size: 12.5px; color: var(--ink-soft); }

.caution {
  border-left: 2px solid var(--open); padding-left: 12px; color: var(--ink-soft); font-size: 14px; max-width: 72ch;
}
.affects h3, .meta .metalabel {
  font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-faint); font-weight: 600;
}
.affects ul { margin: 6px 0 0; padding-left: 18px; color: var(--ink-soft); display: flex; flex-direction: column; gap: 2px; }
.unmeasured { font-size: 13px; color: var(--ink-faint); }
.meta { font-size: 13.5px; color: var(--ink-soft); display: flex; gap: 8px; flex-wrap: wrap; align-items: baseline; }

.evidencebox { border-top: 1px solid var(--line-soft); padding-top: 12px; }
.evidencebox summary {
  cursor: pointer; display: flex; gap: 10px; align-items: baseline; list-style: none;
}
.evidencebox summary::-webkit-details-marker { display: none; }
.summary-title { font-weight: 600; font-size: 14px; }
.summary-title::before { content: '▸ '; color: var(--ink-faint); }
.evidencebox[open] .summary-title::before { content: '▾ '; }
.summary-count { font-size: 13px; color: var(--ink-faint); }
.evidencebody { display: flex; flex-direction: column; gap: 18px; padding-top: 14px; }
.modehead { display: flex; align-items: baseline; gap: 8px; padding-bottom: 6px; }
.modename { font-size: 13px; font-weight: 600; }
.modecount { font: 12px var(--mono); color: var(--ink-faint); }

.tablewrap { overflow-x: auto; border: 1px solid var(--line-soft); border-radius: 8px; }
table.evidence { border-collapse: collapse; width: 100%; font-size: 13px; }
table.evidence th { text-align: left; font-weight: 600; }
table.evidence thead th {
  font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-faint);
  padding: 8px 12px; border-bottom: 1px solid var(--line);
}
.grouphead th {
  background: var(--line-soft); padding: 6px 12px; font-size: 12px; color: var(--ink-soft);
}
.grouphead .count { font: 11px var(--mono); color: var(--ink-faint); }
table.evidence td { padding: 7px 12px; border-bottom: 1px solid var(--line-soft); vertical-align: middle; }
tr.row:last-child td { border-bottom: 0; }
.place code { font-size: 11.5px; color: var(--ink-soft); word-break: break-word; }
.place .prop {
  display: inline-block; margin-left: 6px; font: 11px var(--mono); color: var(--ink-faint);
  border: 1px solid var(--line); border-radius: 4px; padding: 1px 5px; white-space: nowrap;
}
td.val { width: 150px; }
.chip { display: inline-flex; align-items: center; gap: 8px; }
.sw {
  width: 34px; height: 22px; border-radius: 4px; flex: none;
  box-shadow: inset 0 0 0 1px rgba(128, 128, 128, .35);
}
.hex { font: 12px var(--mono); font-variant-numeric: tabular-nums; }
.alpha { font-style: normal; color: var(--ink-faint); margin-left: 4px; }
.raw { font: 11.5px var(--mono); color: var(--ink-soft); }
td.delta { width: 88px; text-align: right; white-space: nowrap; font: 12px var(--mono); font-variant-numeric: tabular-nums; color: var(--ink-soft); }
.dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 7px; vertical-align: middle; }
.dot.low { background: #9aa3b0; }
.dot.mid { background: #d99b3a; }
.dot.high { background: #c14b3f; }
.dot.text { background: transparent; box-shadow: inset 0 0 0 1px var(--ink-faint); }

.note { display: flex; flex-direction: column; gap: 5px; }
.note span { font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-faint); font-weight: 600; }

.bhead { display: flex; flex-direction: column; gap: 6px; }
.block h2 { font-size: 19px; }
.bhead p { color: var(--ink-soft); max-width: 72ch; }
.cards { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.card { border: 1px solid var(--line); border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 6px; }
.card h3 { font-size: 14.5px; display: flex; flex-wrap: wrap; gap: 8px; align-items: baseline; }
.card .weight { font: 500 11px var(--sans); color: var(--ink-faint); }
.card p { font-size: 13px; color: var(--ink-soft); }

.legend { display: flex; flex-wrap: wrap; gap: 8px 20px; font-size: 12.5px; color: var(--ink-soft); }
.legend .sw { width: 20px; height: 14px; }
.legend span { display: inline-flex; align-items: center; gap: 7px; }

footer.foot {
  max-width: 1240px; margin: 0 auto; padding: 8px 28px 48px; color: var(--ink-faint); font-size: 12.5px;
  display: flex; flex-direction: column; gap: 6px;
}
footer.foot code { font-size: 12px; }

dialog {
  border: 1px solid var(--line); border-radius: var(--radius); background: var(--card); color: var(--ink);
  padding: 20px; max-width: min(760px, 92vw); width: 100%;
}
dialog::backdrop { background: rgba(0, 0, 0, .45); }
dialog h2 { font-size: 17px; margin-bottom: 10px; }
dialog textarea {
  width: 100%; min-height: 320px; font: 12.5px/1.5 var(--mono); color: var(--ink);
  background: var(--page); border: 1px solid var(--line); border-radius: 8px; padding: 12px; resize: vertical;
}
dialog .dialogfoot { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }

@media (prefers-reduced-motion: no-preference) {
  .option, .ghost, .rail a { transition: background-color .12s ease, border-color .12s ease, color .12s ease; }
}
@media print {
  .toolbar, .rail, .note, .ghost { display: none; }
  body { background: #fff; }
  .layout { display: block; padding: 0; }
  .decision, .block { break-inside: avoid; border-color: #ccc; }
}
</style>
</head>
<body>

<header class="masthead">
  <div class="masthead-inner">
    <p class="kicker">DevExtreme · тема fluent-next · пакет токенов 262.6.0 · ревью-раунд 2, 12.08.2026</p>
    <h1>Итог дизайн-ревью</h1>
    <p class="lede">Агенда закрыта: все шесть решений приняты в пользу текущего состояния темы,
      поэтому раунд не породил ни одной правки в SCSS — закрылись только статусы записей журнала.
      Цвета в таблицах — не пересказ журнала, а замер по собранным бандлам fluent и fluent-next,
      он остаётся доказательной базой принятых решений.</p>
    <div class="facts">
      <div class="fact"><b>${open.length}</b><span>${plural(open.length, 'решение принято', 'решения приняты', 'решений принято')}</span></div>
      <div class="fact"><b>${review}</b><span>${plural(review, 'запись', 'записи', 'записей')} в статусе review</span></div>
      <div class="fact"><b>${totalPlaces}</b><span>${plural(totalPlaces, 'место', 'места', 'мест')} со сменой цвета</span></div>
      <div class="fact"><b>0</b><span>правок в SCSS по итогам</span></div>
      <div class="fact"><b>${BASE_OWNERS.length}</b><span>${plural(BASE_OWNERS.length, 'эскалация', 'эскалации', 'эскалаций')} владельцам base</span></div>
    </div>
  </div>
</header>

<div class="toolbar">
  <div class="toolbar-inner">
    <span class="tool-label">Показывать</span>
    <div class="seg" role="group" aria-label="Какой бандл показывать">
      <button type="button" data-mode-filter="all" aria-pressed="true">оба режима</button>
      <button type="button" data-mode-filter="light" aria-pressed="false">светлый</button>
      <button type="button" data-mode-filter="dark" aria-pressed="false">тёмный</button>
    </div>
    <div class="seg" role="group" aria-label="Порядок строк">
      <button type="button" data-sort="source" aria-pressed="true">по виджетам</button>
      <button type="button" data-sort="delta" aria-pressed="false">сначала крупные Δ</button>
    </div>
    <input type="search" id="filter" placeholder="фильтр по селектору или свойству" aria-label="Фильтр по селектору" />
    <button type="button" class="ghost" id="expand">Развернуть все доказательства</button>
    <button type="button" class="ghost" id="export">Собрать итог созвона</button>
  </div>
</div>

<div class="layout">
  <nav class="rail" aria-label="Агенда">
    <div class="railsplit">Решения</div>
    ${AGENDA.map((d) => `<a href="#d${d.id}"><span class="n">${d.id}</span>${escape(d.short)}</a>`).join('\n    ')}
    <div class="railsplit">Другие адресаты</div>
    <a href="#package"><span class="n">B</span>команда токенов</a>
    <a href="#scales"><span class="n">C</span>шкалы и типографика</a>
    <a href="#base"><span class="n">D</span>владельцы base</a>
  </nav>

  <main>
    <section class="block" id="legend">
      <div class="bhead">
        <h2>Как читать таблицы</h2>
        <p>Слева — литерал из бандла legacy fluent, справа — то же место в fluent-next после разворачивания
          var() по :root-карте своего бандла. Свотчи полупрозрачных значений композитятся на подложку
          своего режима, иначе тинт выглядел бы светлее, чем он на экране. Δ — расстояние CIE76 между
          композиченными цветами: чем больше, тем заметнее разница глазу.</p>
      </div>
      <div class="legend">
        <span><span class="sw" style="background:${GROUND.light}"></span>подложка светлого бандла ${GROUND.light}</span>
        <span><span class="sw" style="background:${GROUND.dark}"></span>подложка тёмного бандла ${GROUND.dark}</span>
        <span><span class="dot low"></span>Δ &lt; 5 — сдвиг оттенка</span>
        <span><span class="dot mid"></span>Δ 5–20 — заметно</span>
        <span><span class="dot high"></span>Δ &gt; 20 — другой цвет</span>
      </div>
    </section>

    ${AGENDA.map((decision) => decisionSection(decision, decisions.get(decision.id))).join('\n')}

    ${listBlock('package', 'Вопросы в команду пакета токенов — сняты',
      'Решением 5 запросы по дырам foundation не подаются, тон gantt подтверждён решением 7, а судьба '
      + 'компонентного тира решена контрактом тиров 06.08 (эмиссия уходит из бандла отдельным PR). '
      + 'Оставлены как история: это дефекты пакета, а не гейты темы.',
      PACKAGE_QUESTIONS)}

    ${listBlock('scales', 'Запросы по шкалам',
      'Значения, которым в пакете не нашлось ступени. Вопрос один: что достойно новой ступени, а что остаётся фиксированным.',
      SCALE_REQUESTS)}

    ${listBlock('base', 'Эскалации владельцам base — не на этот созвон',
      'Дизайна не касаются, приведены, чтобы их не тащили в обсуждение цвета. Обе перепроверены по коду '
      + '12.08 и обе актуальны: узлы в base целы.',
      BASE_OWNERS,
      '<p class="unmeasured">Третья эскалация — парные параметры «-2» — растворилась 06.08: суффиксы завела наша же '
      + 'волна B2, все 22 параметра переименованы в base с сохранением байт-идентичности 15 бандлов.</p>')}
  </main>
</div>

<footer class="foot">
  <div>Источники: DIVERGENCES.journal.md (журнал и агенда), REVIEW_EVIDENCE.md (замер по бандлам), README.md (состояние темы).</div>
  <div>Страница собирается из доказательств, а не из пересказа: <code>node tools/review/evidence.mjs --md &gt; scss/widgets/fluent-next/REVIEW_EVIDENCE.md</code>, затем <code>node tools/review/agenda-page.mjs</code>.</div>
  <div>Выбор вариантов и заметки хранятся только в этом браузере (localStorage) — «Собрать итог созвона» выдаёт их markdown-списком для журнала.</div>
</footer>

<dialog id="exportdialog">
  <h2>Итог созвона</h2>
  <textarea id="exporttext" readonly></textarea>
  <div class="dialogfoot">
    <button type="button" class="ghost" id="copy">Скопировать</button>
    <button type="button" class="ghost" id="close">Закрыть</button>
  </div>
</dialog>

<script>
const STORE = 'fluent-next-review-agenda-v1';
const state = JSON.parse(localStorage.getItem(STORE) || '{}');
const save = () => localStorage.setItem(STORE, JSON.stringify(state));

document.querySelectorAll('.option').forEach((button) => {
  const key = button.dataset.choice;
  if (state[key] === button.dataset.value) button.classList.add('is-picked');
  button.addEventListener('click', () => {
    const picked = state[key] === button.dataset.value;
    document.querySelectorAll('[data-choice="' + key + '"]').forEach((sibling) => sibling.classList.remove('is-picked'));
    if (picked) delete state[key];
    else { state[key] = button.dataset.value; button.classList.add('is-picked'); }
    save();
  });
});

document.querySelectorAll('[data-note]').forEach((input) => {
  const key = 'note.' + input.dataset.note;
  input.value = state[key] || '';
  input.addEventListener('input', () => { state[key] = input.value; save(); });
});

const segment = (attribute, apply) => {
  document.querySelectorAll('[' + attribute + ']').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[' + attribute + ']').forEach((sibling) => sibling.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');
      apply(button.getAttribute(attribute));
    });
  });
};

segment('data-mode-filter', (mode) => {
  document.querySelectorAll('.modeblock').forEach((block) => {
    block.hidden = mode !== 'all' && block.dataset.mode !== mode;
  });
});

segment('data-sort', (order) => {
  document.querySelectorAll('table.evidence tbody').forEach((body) => {
    if (order === 'source') {
      [...body.querySelectorAll('.grouphead')].forEach((head) => {
        const group = [head];
        let next = head.nextElementSibling;
        while (next && !next.classList.contains('grouphead')) { group.push(next); next = next.nextElementSibling; }
        group.forEach((row) => body.appendChild(row));
      });
      return;
    }
    const rows = [...body.querySelectorAll('tr.row')]
      .sort((one, two) => Number(two.dataset.delta) - Number(one.dataset.delta));
    body.querySelectorAll('.grouphead').forEach((head) => { head.hidden = true; });
    rows.forEach((row) => body.appendChild(row));
  });
  if (order === 'source') document.querySelectorAll('.grouphead').forEach((head) => { head.hidden = false; });
});

document.getElementById('filter').addEventListener('input', (event) => {
  const needle = event.target.value.trim().toLowerCase();
  document.querySelectorAll('tr.row').forEach((row) => {
    row.hidden = needle !== '' && !row.dataset.place.includes(needle);
  });
  if (needle !== '') document.querySelectorAll('.evidencebox').forEach((box) => { box.open = true; });
});

document.getElementById('expand').addEventListener('click', (event) => {
  const boxes = [...document.querySelectorAll('.evidencebox')];
  const opening = boxes.some((box) => !box.open);
  boxes.forEach((box) => { box.open = opening; });
  event.target.textContent = opening ? 'Свернуть все доказательства' : 'Развернуть все доказательства';
});

const dialog = document.getElementById('exportdialog');
document.getElementById('export').addEventListener('click', () => {
  const lines = ['# Итог дизайн-ревью fluent-next', ''];
  document.querySelectorAll('.decision').forEach((section) => {
    const id = section.id.slice(1);
    const picks = [...section.querySelectorAll('.choice')].map((choice) => {
      const label = choice.querySelector('.choicehead').textContent;
      const picked = choice.querySelector('.option.is-picked');
      return picked ? '  - ' + label + ': **' + picked.querySelector('.option-label').firstChild.textContent.trim() + '**' : null;
    }).filter(Boolean);
    const note = section.querySelector('[data-note]').value.trim();
    if (!picks.length && !note) return;
    lines.push('## Решение ' + id + '. ' + section.querySelector('h2').textContent);
    picks.forEach((pick) => lines.push(pick));
    if (note) lines.push('  - заметка: ' + note);
    lines.push('');
  });
  if (lines.length === 2) lines.push('_ничего не отмечено_');
  document.getElementById('exporttext').value = lines.join('\\n');
  dialog.showModal();
});
document.getElementById('close').addEventListener('click', () => dialog.close());
document.getElementById('copy').addEventListener('click', async () => {
  const field = document.getElementById('exporttext');
  field.select();
  try { await navigator.clipboard.writeText(field.value); } catch { document.execCommand('copy'); }
});

const rail = [...document.querySelectorAll('.rail a')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    rail.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-70px 0px -70% 0px' });
document.querySelectorAll('.decision, .block').forEach((section) => observer.observe(section));
</script>
</body>
</html>
`;
};

const decisions = parseEvidence(readFileSync(evidenceFile, 'utf8'));
writeFileSync(outFile, page(decisions));

const measured = [...decisions.values()]
  .map((d) => `${d.id}: light ${d.rows.light.length}, dark ${d.rows.dark.length}`)
  .join('\n  ');
process.stdout.write(`страница: ${outFile}\n  ${measured}\n`);
