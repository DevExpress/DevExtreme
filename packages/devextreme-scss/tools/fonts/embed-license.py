# Install dependencies into the active Python environment (outside a venv for
# a global installation), from the repository root:
# python3 -m pip install -r packages/devextreme-scss/tools/fonts/requirements.txt
# Equivalent: python3 -m pip install 'fonttools[woff]'
# The Node.js launcher uses its own venv; it does not reuse this global install.
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
