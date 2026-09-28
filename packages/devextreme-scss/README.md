# DevExtreme fonts and icons

Working notes for `packages/devextreme-scss`. This document grows with the discussion; localized versions in other languages may be available alongside this English reference version.

## Theme overview

Each theme selects a text font and an icon font separately. The directories distinguish their purpose; file extensions describe their storage format.

| Theme | Text font priority | Text font source | Icon font |
| --- | --- | --- | --- |
| Material | `roboto → "roboto fallback" → system fonts → sans-serif`. Defined by [`$base-font-family`](scss/widgets/material/_colors.scss) | The primary Roboto family is registered through a Google CSS import. Custom `@font-face` declarations register the fallback using installed Roboto or `fonts/Roboto-*` files. [Declarations](scss/widgets/material/typography/_index.scss) | Family `DXIcons`, files `icons/dxiconsmaterial.*`. [Setup](scss/widgets/material/icons/_index.scss) |
| Fluent | `"segoe ui" → -apple-system → BlinkMacSystemFont → … → sans-serif`. [Full list](scss/widgets/fluent/_colors.scss) | Fonts available on the device. The theme does not load separate Segoe UI files | Family `DXIcons`, files `icons/dxiconsfluent.*`. [Setup](scss/widgets/fluent/icons/_index.scss) |
| Generic | `-apple-system → BlinkMacSystemFont → "avenir next" → … → sans-serif`. [Full list](scss/widgets/generic/_colors.scss) | Fonts available on the device | Family `DXIcons`, files `icons/dxicons.*`. [Setup using default arguments](scss/widgets/generic/icons/_index.scss) |

`…` represents omitted intermediate families. These are theme defaults; an application can override them.

## File structure

| Path | Contents | Purpose |
| --- | --- | --- |
| [`fonts/`](fonts/) | `Roboto-300`, `Roboto-400`, `Roboto-500`, `Roboto-700` in TTF, WOFF, and WOFF2 formats | Roboto text fonts for Material's fallback family. Weights: 300 light, 400 regular, 500 medium, 700 bold |
| [`icons/`](icons/) | `dxicons`, `dxiconsmaterial`, `dxiconsfluent` in TTF, WOFF, and WOFF2 formats | Icon fonts for all three themes, including Material |
| [`images/icons/`](images/icons/) | Individual SVG files in `generic`, `material`, and `fluent` directories | Vector icon images. [Tests](tests/icon-font.test.ts) compare SVG counts with glyph counts in the corresponding TTF files and compare SVG name sets across themes |

## How the styles connect

| Stage | What happens | Source |
| --- | --- | --- |
| Theme build | Includes the `typography`, `icons`, `widget`, and other style modules | Templates for [Material](build/bundle-template.material.scss), [Fluent](build/bundle-template.fluent.scss), [Generic](build/bundle-template.generic.scss) |
| Font registration | `@font-face` associates a family name with sources. The declaration alone does not assign the font to elements | [Roboto fallback](scss/widgets/material/typography/_index.scss), [`dx-font-icons` mixin](scss/widgets/base/_icon_fonts.scss) |
| Passing text settings | The theme's `dx-base-typography()` mixin passes `$base-font-family` to the shared mixin | [Material](scss/widgets/material/common/_mixins.scss), [Fluent](scss/widgets/fluent/common/_mixins.scss), [Generic](scss/widgets/generic/common/_mixins.scss) |
| Generating CSS | The shared `dx-base-typography-mixin()` emits `font-family`, `font-size`, `font-weight`, and other properties; it also sets the family for `input` and `textarea` | [Shared mixin](scss/widgets/base/_mixins.scss) |
| Applying to widgets | `.dx-widget` receives the theme's base typography | [Material](scss/widgets/material/widget/_index.scss), [Fluent](scss/widgets/fluent/widget/_index.scss), [Generic](scss/widgets/generic/widget/_index.scss) |
| Applying to typography | `.dx-theme-material-typography`, `.dx-theme-fluent-typography`, or `.dx-theme-generic-typography` receives base typography | [Material](scss/widgets/material/typography/_index.scss), [Fluent](scss/widgets/fluent/typography/_index.scss), [Generic](scss/widgets/generic/typography/_index.scss) |
| Applying to icons | `.dx-icon-*` classes receive `font: 14px/1 DXIcons`; `::before` receives a character code from the `$icons` map | [Mapping and CSS generation](scss/widgets/base/_icon_fonts.scss) |
| Placing assets | The `copy:assets` task copies `fonts/` and `icons/` to `packages/devextreme/artifacts/css/fonts` and `packages/devextreme/artifacts/css/icons` | [Build configuration](project.json) |

## Who sets priority and which source is selected

| Level | What defines the order | How the browser selects | Example / source |
| --- | --- | --- | --- |
| Element CSS rule | Theme and application CSS, governed by the CSS cascade | Determines the final font properties from applicable rules and inheritance | Application styles can override the theme's font family |
| Text family | `$base-font-family`, compiled into CSS `font-family` | Checks families from left to right | Material: `roboto → "roboto fallback" → …`. [Setting](scss/widgets/material/_colors.scss) |
| Font face | The element's `font-weight`, `font-style`, and available faces | Matches an appropriate face within the selected family | Weight `700` in `"roboto fallback"` matches the declaration using `Roboto-700.*`. [Declarations](scss/widgets/material/typography/_index.scss) |
| Roboto fallback source | The `src` order in `@font-face` | Looks for an installed font first, then uses the first usable URL source | For weight 400: `local("Roboto") → local("Roboto-Regular") → .woff2 → .woff → .ttf`. [Sources](scss/widgets/material/typography/_index.scss) |
| DXIcons source | The `src` order in `dx-font-icons()` | Looks for an installed font with the specified name, then uses the selected theme's files | Fluent: installed `DevExtreme Fluent Icons` / `devextreme_fluent_icons` → `dxiconsfluent.woff2 → .woff → .ttf`. [Mixin](scss/widgets/base/_icon_fonts.scss) |
| Individual icon | The `$icons` map and CSS `content` | A character code selects a glyph in `DXIcons` | `"search": "\f027"` is a magnifying glass. [Map](scss/widgets/base/_icon_fonts.scss) |

## Explanations and examples

### Why text and icons share file extensions

A font is a collection of graphical symbols called glyphs. A glyph can be a letter, a digit, or a picture. Text fonts and icon fonts therefore have similar internal structures.

| Extension | Meaning |
| --- | --- |
| `.ttf` | TrueType font format |
| `.woff` | Compressed font format for the web |
| `.woff2` | A newer web font format with more efficient compression |

`dxicons.ttf`, `dxicons.woff`, and `dxicons.woff2` represent the same icon font in alternative formats. The browser does not need to download all three to use it.

### Two fallback levels in Material

Material imports Google CSS for Roboto weights `300,400,500,700`. That CSS registers the `Roboto` family. DevExtreme also registers a separate CSS name, `"roboto fallback"`, backed by ordinary Roboto files.

The `font-family` list sets family priority; the Google import appearing earlier in the file does not establish that priority:

```css
font-family: roboto, "roboto fallback", /* other families */ sans-serif;
```

If `"roboto fallback"` is selected, the browser checks its `src` list. For the regular face:

```css
@font-face {
  font-family: "roboto fallback";
  font-style: normal;
  font-weight: 400;
  src:
    local("Roboto"),
    local("Roboto-Regular"),
    url("fonts/Roboto-400.woff2") format("woff2"),
    url("fonts/Roboto-400.woff") format("woff"),
    url("fonts/Roboto-400.ttf") format("truetype");
}
```

`local(...)` means a font installed on the user's device. `url("fonts/...")` means a file fetched from the website, even if we call it a “local project file.” A relative URL in an external stylesheet resolves against that stylesheet's URL.

### How an icon is drawn

For the search icon, the generated CSS is equivalent to:

```css
.dx-icon-search {
  font: 14px/1 DXIcons;
}

.dx-icon-search::before {
  content: "\f027";
}
```

In the selected `DXIcons` font, `\f027` represents a magnifying glass. A Material button can render its “Search” label with Roboto and its magnifying glass with `dxiconsmaterial`.

### Scope and qualifications

- Family fallback can occur for individual characters: if a font lacks a required glyph, the browser may take it from another font.
- The sources show configuration and preference order. The actual font used depends on the device, successful loading, and final CSS.
- Declaring `@font-face` does not necessarily download the font immediately; loading depends on font usage.
- The tables describe font selection, not temporary text rendering while fonts load.

## Further discussion notes

Add new explanations below; changes to the overall setup should also be reflected in the tables above and in any accompanying localized versions.


## Embedded license information

### Where it is stored

A font contains a `name` table with text records. Each record identifies the string's purpose through a `name ID`, together with platform, encoding, and language identifiers and the string's length and offset. The same text can appear in records for multiple platforms and languages. These are font metadata, separate from SCSS and standalone license files. [OpenType name table specification](https://learn.microsoft.com/en-us/typography/opentype/spec/name).

| `name` field | Contents |
| --- | --- |
| ID 0 — Copyright | Copyright notice |
| ID 5 — Version | Font version, useful for identifying the inspected asset |
| ID 13 — License Description | License information, ranging from a short statement or reference to full terms |
| ID 14 — License Info URL | Address of further licensing information |

In TTF, the table can be read directly. WOFF tables can be compressed individually; WOFF2 stores table data in a shared Brotli stream. WOFF/WOFF2 also allow a separate extended XML metadata block, distinct from the `name` table. [WOFF2 specification](https://www.w3.org/TR/WOFF2/).

### Results extracted from repository assets

**All 21 files** were inspected: 12 Roboto files and 9 icon font files. TTF, WOFF, and WOFF2 were read separately for each row below; fields 0, 5, 13, and 14 matched across formats. Inspection date: 2026-09-25.

| Font and inspected files | ID 0: copyright | ID 5: version | ID 13: license | ID 14: URL |
| --- | --- | --- | --- | --- |
| Roboto-300 — [ttf](fonts/Roboto-300.ttf), [woff](fonts/Roboto-300.woff), [woff2](fonts/Roboto-300.woff2) | `Copyright 2011 Google Inc. All Rights Reserved.` | `Version 2.137; 2017` | `Licensed under the Apache License, Version 2.0` | `http://www.apache.org/licenses/LICENSE-2.0` |
| Roboto-400 — [ttf](fonts/Roboto-400.ttf), [woff](fonts/Roboto-400.woff), [woff2](fonts/Roboto-400.woff2) | `Copyright 2011 Google Inc. All Rights Reserved.` | `Version 2.137; 2017` | `Licensed under the Apache License, Version 2.0` | `http://www.apache.org/licenses/LICENSE-2.0` |
| Roboto-500 — [ttf](fonts/Roboto-500.ttf), [woff](fonts/Roboto-500.woff), [woff2](fonts/Roboto-500.woff2) | `Copyright 2011 Google Inc. All Rights Reserved.` | `Version 2.137; 2017` | `Licensed under the Apache License, Version 2.0` | `http://www.apache.org/licenses/LICENSE-2.0` |
| Roboto-700 — [ttf](fonts/Roboto-700.ttf), [woff](fonts/Roboto-700.woff), [woff2](fonts/Roboto-700.woff2) | `Copyright 2011 Google Inc. All Rights Reserved.` | `Version 2.137; 2017` | `Licensed under the Apache License, Version 2.0` | `http://www.apache.org/licenses/LICENSE-2.0` |
| dxicons — [ttf](icons/dxicons.ttf), [woff](icons/dxicons.woff), [woff2](icons/dxicons.woff2) | Absent | `Version 1.0` | Absent | Absent |
| dxiconsmaterial — [ttf](icons/dxiconsmaterial.ttf), [woff](icons/dxiconsmaterial.woff), [woff2](icons/dxiconsmaterial.woff2) | Absent | `Version 1.0` | Absent | Absent |
| dxiconsfluent — [ttf](icons/dxiconsfluent.ttf), [woff](icons/dxiconsfluent.woff), [woff2](icons/dxiconsfluent.woff2) | Absent | `Version 1.0` | Absent | Absent |

Roboto embeds the short statement `Licensed under the Apache License, Version 2.0`, not the full license text. The embedded URL is `http://www.apache.org/licenses/LICENSE-2.0` ([open](http://www.apache.org/licenses/LICENSE-2.0)). This finding applies to the repository's specific Roboto `2.137; 2017` assets, not every Roboto release or today's Google Fonts response.

In the icon fonts, fields **0, 13, and 14 are absent**, rather than present with empty strings. The `name` table itself exists: all nine files contain IDs 1, 2, 3, 4, 5, 6, and 10. ID 10 contains `Font generated by IcoMoon.` This identifies a generation tool, not a license.

All 14 WOFF/WOFF2 files have a header `metaOffset` of `0`, meaning no separate extended metadata block. The inspected icons therefore contain no license statement in name IDs 13/14 or extended WOFF metadata. Missing metadata does not grant unrestricted use; consult the accompanying license terms. [`package.json`](package.json) says `SEE LICENSE IN LICENSE.md`; that reference alone is not an extracted icon license.

### Extraction method

Each binary file's table directory was read, its `name` table located, and its records decoded. WOFF used zlib decompression; WOFF2 used Brotli. All records were inspected, including Macintosh and Windows entries, rather than just the first string. Repeated values are consolidated in the table above.

To reproduce the inspection with a standard tool, use FontTools (`ttx`, with Brotli support for WOFF2):

```sh
# From the repository root; export only the name table to XML.
ttx -t name -o /tmp/Roboto-400-name.ttx packages/devextreme-scss/fonts/Roboto-400.ttf
ttx -t name -o /tmp/dxiconsfluent-name.ttx packages/devextreme-scss/icons/dxiconsfluent.woff2
```

Look for `<namerecord nameID="13" ...>` and `<namerecord nameID="14" ...>` in the XML. These entries will be absent for the inspected icons. These commands are reproduction instructions; the current extraction used Node.js to parse binary tables without installing FontTools.

### Details for a future programmatic parser

License text has no fixed file position: the table directory locates `name`, whose records locate strings. Searching raw binaries for `Apache` is unreliable because strings may be compressed or UTF-16BE encoded.

#### 1. Obtain uncompressed `name` bytes

| Container | Location |
| --- | --- |
| TTF / ordinary OTF (SFNT) | A 12-byte header contains uint16 `numTables` at offset 4. It is followed by 16-byte directory entries: `tag`, `checkSum`, `offset`, `length` (4 bytes each). Find ASCII tag `name`; `offset` is file-relative. [OpenType file structure](https://learn.microsoft.com/en-us/typography/opentype/spec/otff) |
| WOFF (`wOFF`) | A 44-byte header precedes 20-byte entries: `tag`, `offset`, `compLength`, `origLength`, `origChecksum`. Read `compLength` bytes at `offset`; decompress with zlib when `compLength < origLength`. [WOFF](https://www.w3.org/TR/WOFF/) |
| WOFF2 (`wOF2`) | A 48-byte header precedes a variable-length directory. Decompress the shared Brotli stream and locate `name`, accounting for table lengths and transformations. TTF offsets cannot be used directly. Prefer an established decoder for production. [WOFF2](https://www.w3.org/TR/WOFF2/) |

Numbers in these binary structures are big-endian. Font collections (`ttcf`) require iterating their member fonts; the ordinary single-font TTF layout does not apply directly.

#### 2. Parse `name`

Offsets below are relative to the **uncompressed table**, not the file. [Apple structure reference](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6name.html).

| Offset | Size | Field |
| --- | --- | --- |
| 0 | 2 bytes | Table version: 0 or 1 |
| 2 | 2 bytes | `count`: number of records |
| 4 | 2 bytes | `storageOffset`: string storage start relative to `name` |
| 6 | `count × 12` bytes | `NameRecord` array |

Each record contains six uint16 fields:

| Record offset | Field | Meaning |
| --- | --- | --- |
| 0 | `platformID` | Platform |
| 2 | `encodingID` | Platform-specific encoding |
| 4 | `languageID` | Language |
| 6 | `nameID` | Purpose: 13 license, 14 URL |
| 8 | `length` | String length **in bytes** |
| 10 | `stringOffset` | Offset relative to string storage |

```text
recordStart = 6 + index * 12
textStart   = storageOffset + stringOffset
textBytes   = nameTable[textStart : textStart + length]
```

Strings need not be null-terminated: read exactly `length` bytes. Use `storageOffset`, not `6 + count * 12`, to locate storage. Version 1 includes language-tag data after the records; `languageID >= 0x8000` indexes it using `languageID - 0x8000`. [OpenType name](https://learn.microsoft.com/en-us/typography/opentype/spec/name).

#### 3. Decode while preserving provenance

| Platform and encoding | Decoding |
| --- | --- |
| Unicode (`platformID = 0`) | UTF-16BE |
| Windows (`platformID = 3`, `encodingID = 1` or `10`) | UTF-16BE |
| Macintosh (`platformID = 1`, `encodingID = 0`), English records in these assets | MacRoman; ASCII matches, but Latin-1 is not a general substitute |
| Other combinations | Use the applicable encoding or report an explicit unsupported status |

Preserve all ID 0/13/14 records with their platform, encoding, language, and raw bytes. Deduplicate identical text for display; do not silently replace differing values with the first record. FontTools exposes `font["name"].names` and `record.toUnicode()`; handle decoding failures separately. [FontTools API](https://fonttools.readthedocs.io/en/latest/ttLib/tables/_n_a_m_e.html).

#### Concrete example from current assets

In `fonts/Roboto-400.ttf`, `name` starts at **140424**, has length **1062**, version **0**, `count = 26`, and `storageOffset = 318`.

| Record | platform / encoding / language | Length | stringOffset | Absolute string start |
| --- | --- | --- | --- | --- |
| License, ID 13 | 1 / 0 / 0 | 46 | 160 | `140424 + 318 + 160 = 140902` |
| URL, ID 14 | 1 / 0 / 0 | 42 | 206 | 140948 |
| License, ID 13 | 3 / 1 / 1033 (`0x0409`, en-US) | 92 | 568 | 141310 |
| URL, ID 14 | 3 / 1 / 1033 | 84 | 660 | 141402 |

The license text is identical, but the Windows record occupies 92 bytes instead of 46 because of UTF-16BE. These offsets were measured in this specific file and can change after rebuilding.

In `icons/dxiconsfluent.ttf`, `name` starts at **82160**, has length **462**, version **0**, **14** records, and `storageOffset = 174`. None has ID 13/14. A parser should report an absent field, not a corrupt table.

#### Suggested result contract

Distinguish `absent` (no record), `empty` (empty string), `present` (decoded text), `decode_error`, and `invalid_font`. Preserve the filename and SHA-256 to identify the inspected artifact. Validate table and string bounds, decompressed sizes, and resource limits. Treat license URLs as extracted data; fetching them is unnecessary for metadata extraction.

Check extended WOFF/WOFF2 XML metadata separately: its `metaOffset` is container-relative, with `0` indicating no block. The block can contain a `license` element and does not replace parsing `name`. None of the current assets has this block.


## Proposal: embed license metadata in icon fonts

This is a proposed schema and tooling approach. The `icons/` binaries remain unchanged. They lack embedded license information; this does not mean the icons have no license. Do not copy Roboto's Apache 2.0 declaration into icons or infer ownership from the IcoMoon generator string.

### Proposed data

| Location | Proposed value | Authoritative input |
| --- | --- | --- |
| `name`, ID 0 | Exact copyright notice, including the holder and applicable years | Confirmed icon provenance; do not automatically insert the current year |
| `name`, ID 13 | Short statement of applicable terms and where to find the full text | The license that actually applies to that icon set |
| `name`, ID 14 | Stable absolute URL for those terms | A specific license page, not the company homepage |
| Accompanying `LICENSE` / `NOTICE` | Full terms and required notices | Confirmed documents included in the distributed package |
| Proposed `icons-license.metadata.json` | Separate entry for each of the three sets | Generation input; currently only a proposed filename |

IDs 8 (manufacturer) and 9 (designer) can be added when confirmed, but do not replace IDs 0/13/14. Family and PostScript names, code points, and the existing generator description need no changes. Repeat values if the sets share terms; the schema does not assume they do. For mixed-source sets, the summary should acknowledge the sources and reference an attribution inventory.

An English Windows record `(platformID=3, encodingID=1, languageID=0x0409)` encoded as UTF-16BE is sufficient as an initial target for each field. A Macintosh duplicate is optional and requires MacRoman handling. A separate WOFF XML block is unnecessary for the first stage: `name` carries the information in all three formats.

Proposed configuration — **a template, not established license terms**:

```json
{
  "schemaVersion": 1,
  "fonts": {
    "dxicons": {
      "copyright": "<confirmed copyright notice>",
      "licenseDescription": "<confirmed license statement>",
      "licenseUrl": "<stable URL of the applicable license>"
    },
    "dxiconsmaterial": {
      "copyright": "<confirmed copyright notice>",
      "licenseDescription": "<confirmed license statement>",
      "licenseUrl": "<stable URL of the applicable license>"
    },
    "dxiconsfluent": {
      "copyright": "<confirmed copyright notice>",
      "licenseDescription": "<confirmed license statement>",
      "licenseUrl": "<stable URL of the applicable license>"
    }
  }
}
```

### Node.js example: orchestrating FontTools writes

Node.js reads JSON, validates inputs, and launches Python without a shell. FontTools updates `name`, rebuilds the file structure, and emits TTF, WOFF, and WOFF2. This is **not a pure JavaScript codec**: it requires `python3` and FontTools with WOFF/Brotli support, for example `python3 -m pip install 'fonttools[woff]'` in an isolated environment. [Name writing API](https://fonttools.readthedocs.io/en/latest/ttLib/tables/_n_a_m_e.html), [TTFont](https://fonttools.readthedocs.io/en/latest/ttLib/ttFont.html).

Each set's TTF is the input. Output goes to a fresh temporary directory without overwriting sources. Existing IDs 0/13/14 cause a failure because they require an explicit merge policy. Save the example as `embed-icon-license.mjs` and pass a completed JSON configuration and the `icons/` path.

```js
import { readFileSync, mkdtempSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

// node embed-icon-license.mjs metadata.json packages/devextreme-scss/icons
const [, , configPath, iconsPath] = process.argv;
if (!configPath || !iconsPath) throw new Error('Provide metadata.json and icons directory');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const stems = ['dxicons', 'dxiconsmaterial', 'dxiconsfluent'];
for (const stem of stems) {
  for (const key of ['copyright', 'licenseDescription', 'licenseUrl']) {
    const value = config.fonts?.[stem]?.[key];
    if (typeof value !== 'string' || !value.trim() || /<[^>]+>/.test(value)) {
      throw new Error(`${stem}.${key}: replace placeholders with confirmed text`);
    }
  }
  const url = new URL(config.fonts[stem].licenseUrl);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Expected HTTP(S) license URL');
}
const output = mkdtempSync(join(tmpdir(), 'dx-icon-license-'));
const python = String.raw`
import json, pathlib, sys
from fontTools.ttLib import TTFont
config = json.load(sys.stdin)
source, output = map(pathlib.Path, sys.argv[1:])
for stem in ('dxicons', 'dxiconsmaterial', 'dxiconsfluent'):
    metadata = config['fonts'][stem]
    fields = {0: metadata['copyright'], 13: metadata['licenseDescription'],
              14: metadata['licenseUrl']}
    with TTFont(source / (stem + '.ttf'), recalcTimestamp=False) as font:
        if 'DSIG' in font:
            raise RuntimeError('Signed font: handle invalidated signatures explicitly')
        names = font['name']
        if any(r.nameID in fields for r in names.names):
            raise RuntimeError(stem + ': existing metadata requires explicit merge policy')
        for name_id, value in fields.items():
            names.setName(value, name_id, 3, 1, 0x0409)
        for flavor in (None, 'woff', 'woff2'):
            font.flavor = flavor
            target = output / (stem + '.' + (flavor or 'ttf'))
            font.save(target)
            with TTFont(target) as check:
                for name_id, value in fields.items():
                    record = check['name'].getName(name_id, 3, 1, 0x0409)
                    if record is None or record.toUnicode() != value:
                        raise RuntimeError('Metadata round-trip failed: ' + str(target))
`;
const result = spawnSync('python3', ['-c', python, resolve(iconsPath), output], {
  input: JSON.stringify(config), encoding: 'utf8', maxBuffer: 4 * 1024 * 1024,
});
if (result.error || result.status !== 0) {
  throw new Error(`Generation failed; partial output: ${output}\n${result.error || result.stderr}`);
}
console.log(`Generated and checked 9 files in ${output}`);
```

### Checks before build integration

| Check | Expected result |
| --- | --- |
| Reopen all 9 outputs | IDs 0/13/14 match the configuration; the example performs this check |
| Compare with each previous file | Preserve cmap, glyph order/count, outlines, metrics, and family names; glyph count alone is insufficient |
| Render Generic, Material, and Fluent | Icon appearance and positioning remain unchanged |
| Packaging | License terms and notices accompany distributed fonts |
| Regeneration | Metadata insertion runs after the generator and before publishing so it survives future builds |

Regenerating every format from TTF is a proposed build approach, not proof that the current TTF/WOFF/WOFF2 are identical. Their license fields were compared earlier; complete glyph equivalence was not checked. To update only metadata in existing assets, process each container separately with the same checks.

Example validation in this session: Node.js syntax checked; no font generation was run and no dependencies were installed. Placeholders deliberately prevent running it as a finished license migration. This is a starting point for a future tool, not an integrated build step.

### Alternatives without Python

The current FontTools example remains the initial option. For a Node.js environment, consider:

| Option | Dependencies and approach | Limitations |
| --- | --- | --- |
| [`fonteditor-core`](https://github.com/kekee000/fonteditor-core) | JavaScript library for reading and writing TTF/WOFF/WOFF2; WOFF2 uses WASM and requires `woff2.init()` | Verify IDs 0/13/14 and preservation of other tables. Hinting/kerning preservation options need attention; serialization does not guarantee metadata-only changes |
| [`opentype.js`](https://github.com/opentypejs/opentype.js) + converters | Version `1.3.4` is already in [`package.json`](package.json); investigate writing `names` fields and converting to web formats | Not a complete drop-in workflow: verify the installed version's capabilities and table preservation; WOFF/WOFF2 require a separate encoding path |
| Custom Node.js `name` editor | Use `Buffer` for TTF and separate codecs for web containers; other table bytes can be preserved | Must rebuild the directory, alignment, checksums, and `head.checkSumAdjustment` correctly; WOFF2 requires more than Brotli decompression |
| Embed during generation | If the actual generator supports license fields, supply them from the shared JSON when producing fonts | First identify the generation workflow and supported fields; the IcoMoon string alone does not establish these capabilities |

For the next prototype without Python, I would first evaluate `fonteditor-core` on copies of the three TTF files, producing all nine outputs. It is a candidate, not a validated FontTools replacement. Every option still requires the metadata, glyph, and rendering checks above. No new dependencies have been added.


## Package command

The launcher is now implemented: [`tools/fonts/embed-license.mjs`](tools/fonts/embed-license.mjs) invokes [`embed-license.py`](tools/fonts/embed-license.py). The earlier snippet remains a standalone example.

1. Fill [`tools/fonts/license.metadata.json`](tools/fonts/license.metadata.json) with confirmed values for all three sets.
2. From the repository root, run:

```sh
pnpm --filter devextreme-scss run fonts:embed-license
```

Or run `pnpm run fonts:embed-license` inside `packages/devextreme-scss`. An alternative JSON path can be supplied as the last argument; relative paths resolve from the process working directory. Help: `pnpm run fonts:embed-license --help`.

On the first run with valid configuration, the tool creates `.cache/font-license/venv` using the available `python3` and installs [`requirements.txt`](tools/fonts/requirements.txt). Python's `venv` module, pip, and network access for installation are required. No manual activation is needed; subsequent runs reuse the environment. Dependency versions are not pinned yet; pin them after validation for reproducible CI builds.

Each run creates a new `.cache/font-license/output-*` directory with nine files. `.cache` is already ignored by Git. Source `icons/*` files are not overwritten. Failures may leave partial output in the printed directory. Placeholder configuration is rejected before environment creation or dependency installation.

Node.js/Python syntax, help, and rejection of placeholder configuration have been checked. Full generation with actual license values has not been performed.


### Current configuration values

At the user's request, `tools/fonts/license.metadata.json` now uses the same values for all three sets: `licenseDescription` is `SEE LICENSE IN LICENSE.md` from [`package.json`](package.json), and `licenseUrl` is `https://js.devexpress.com/Licensing/` from the root [`LICENSE.md`](../../LICENSE.md). `Copyright (c) Developer Express Inc.` was composed from the package author, without unverified years; it is not an extracted font field. The previous configuration is preserved in [`license.metadata.backup.json`](tools/fonts/license.metadata.backup.json). Values can be replaced manually. Font generation was not run for this update.


### Installing Python dependencies globally with pip

Outside an activated virtual environment, from the repository root:

```sh
python3 -m pip install -r packages/devextreme-scss/tools/fonts/requirements.txt
# Equivalent command:
python3 -m pip install 'fonttools[woff]'
```

Run either command, not both. Here “globally” means the selected `python3` environment, outside the project's venv. If a virtual environment is active, run `deactivate` first. If an OS-managed or Homebrew Python reports `externally-managed-environment`, use the launcher's venv; no override is needed.

The existing `fonts:embed-license` command still uses its own venv and does not reuse the global installation. To use globally installed FontTools, invoke the Python script directly from the repository root with a fresh output directory:

```sh
output_dir=$(mktemp -d /tmp/dx-icon-license.XXXXXX)
python3 packages/devextreme-scss/tools/fonts/embed-license.py \
  packages/devextreme-scss/icons "$output_dir" \
  < packages/devextreme-scss/tools/fonts/license.metadata.json
```

This shell example targets macOS/Linux. Direct invocation skips Node.js configuration preflight: fill and validate the JSON first. The Python script still checks the written fields after saving. These are manual instructions; no global installation was performed while updating this document.
