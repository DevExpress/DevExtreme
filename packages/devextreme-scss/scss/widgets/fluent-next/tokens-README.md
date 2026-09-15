# Пайплайн дизайн-токенов

`build-tokens.mjs` превращает `@devexpress/design-tokens-internal` (экспорт Tokens Studio / Figma)
в `scss/_design-system/` через Style Dictionary. Структура сгенерированного каталога повторяет тиры
пакета: базовые шкалы и палитры → семантические роли (`semantic/`) → компоненты (`components/`) —
таблица тиров лежит в `scss/widgets/fluent-next/TOKENS_MIGRATION.md`. Все файлы генерируются с
`outputReferences: true`, поэтому цепочка тиров доживает до CSS в виде вложенных ссылок
`var(--dxds-…)` — все три уровня остаются независимо переопределяемыми в рантайме.

Запуск: таргет `build:tokens` (зависимость `build:themes` / `build:themes-dev`).
`scss/_design-system/` — генерируемый каталог, в git его нет.

## Что генерируется, а что нет

- **11 акцентных палитр** (`fluent/accents/{blue,cool-blue,desert,mint,moss,orchid,purple,rose,rust,steel,storm}.scss`)
  — механизм подмены акцента. В бандл подключается ровно одна: `widgets/fluent-next/_design-system.scss`
  берёт её по `colors.$color`. Тема шипается только с `blue` (`build/theme-options.cjs`).
- **Компонентный тир — только цвета** (`fluent/components/theme.scss`). Компонентные **size**-токены
  (`components/core/size/fluent_*`) **сознательно исключены**: fluent-next кладёт размеры на базовые
  шкалы (spacing / font-size / border-radius / border-width), поэтому `*-layout-*` custom properties
  не читал бы ни один виджет. Список имён для SCSS-моста `variables/_ds.scss` собирается из общего +
  light-режима + компонентных **цветовых** токенов.
- **Семантический тир** — `fluent/semantic/{typography,box-shadow,colors/{light,dark}}.scss`.
  Семантических ролей для spacing / border-radius / border-width / opacity в пакете **нет** — это
  зафиксированная дыра foundation, эскалация в `DIVERGENCES.md`.

## Обходы багов экспорта Tokens Studio

Сырой экспорт местами не является валидным DTCG. Blazor, vNext и WPF потребляют тот же пакет и
каждый держит свои копии (части) этих правок — правильное решение в перспективе — общий пакет с
трансформами; пока полный список наших обходов такой:

| Проблема | Где лечится | Что делает |
|---|---|---|
| Полупрозрачный цвет как `"{ref}XX"` (ссылка + 2 hex-символа альфы, например `{neutral.10}66`; 28 токенов на режим) | `transforms.mjs` → `dx/fix-transparent-color` | Переписывает в `rgb(from {ref} r g b / N%)` **с сохранением ссылки**, так что в CSS попадает `rgb(from var(--dxds-neutral-10) r g b / 40%)` и производная с альфой перекрашивается при переопределении базовой custom property. Мутирует `token.original.$value` — это несущая деталь для `outputReferences` (в исходном виде получился бы невалидный `var(--…)XX`). |
| Тени как массивы Tokens Studio (`{x, y, blur, spread, color, type}`) с ключевыми словами `dropShadow`/`innerShadow` | препроцессор `tokens-studio` (из `safe-ts-transforms-fork`) + встроенный `shadow/css/shorthand` + `transforms.mjs` → `dx/fix-drop-shadow` | Форк нормализует TS→DTCG, встроенный трансформ собирает CSS-shorthand, наш транзитивный трансформ срезает оставшееся слово `dropShadow ` и превращает `innerShadow ` в `inset `. `expand.exclude: ['shadow', 'text']` не даёт разложить композиты. |
| Висячие ссылки с суффиксом размера (`{…​.small}` в файле `*_small`, где есть только токен без суффикса) | `build-tokens.mjs` → препроцессор `dx/fix-dangling-size-references` | Переписывает на токен без суффикса (логирует `[design-tokens] Rewriting dangling reference …`). |
| Композитные алиасы теней, типизированные как `text`, со значением-ссылкой (`popup.box-shadow.composite = "{box-shadow.lg}"`) | `build-tokens.mjs` → препроцессор `dx/fix-composite-shadow-references` | Меняет тип на `shadow`, чтобы алиас остался одной ссылкой `var()`, а не разложился по свойствам. |
| Шумный варнинг `could not resolve reference {font-weight…}` ([sd-transforms#218](https://github.com/tokens-studio/sd-transforms/issues/218)) | `build-tokens.mjs` (в начале файла) | `console.warn` обёрнут, чтобы глушить ровно это сообщение. Убрать, когда issue починят апстримом. |

## Безобидные варнинги сборки

- `filtered out token references were found` — семантические цветовые токены ссылаются на ступени
  базовой палитры, которые намеренно эмитятся в **другой** файл (`fluent/accents/{palette}.scss` —
  тот самый механизм подмены акцента). Ссылка всё равно попадает в CSS как `var(--dxds-…)` и
  резолвится в рантайме; `validateReferences()` валит сборку, если у эмитнутой ссылки нет
  определения во всём сгенерированном наборе.
- `[design-tokens] Rewriting dangling reference {x} -> {y}` — см. таблицу выше.

## Как проверять правки пайплайна

Снять снапшот `scss/_design-system/`, пересобрать и сравнить — рефакторинги обязаны быть
байт-идентичными:

```
cp -r scss/_design-system /tmp/ds-before
pnpm nx build:themes-dev devextreme-scss --devBundles=fluent-next.blue.light --skip-nx-cache
diff -r /tmp/ds-before scss/_design-system
```

Для изменений поведения — дополнительно сравнить в собранных бандлах
(`packages/devextreme/artifacts/css/dx.fluent-next.*.css`) набор определений `--dxds-*` и
отрезолвленные значения свойств.
