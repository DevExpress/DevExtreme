import 'dart:io';
import 'package:sass/sass.dart' as sass;
import 'package:path/path.dart' as path;
import './importer.dart';
import './collector.dart';

void main(List<String> arguments) {
  Directory.current = path.absolute('../src/data/scss/');
  var time = DateTime.now().microsecondsSinceEpoch;

  var indexFileContent = '''
\$color: null !default;
\$size: null !default;

@use "./_colors.scss" with (\$color: \$color);
@use "./_sizes.scss" with (\$size: \$size);
@use "./typography";
@use "./icons";
@use "./widget";
@use "./card";
@use "./fieldset";
@use "./common";

// public widgets
@use "./box";
''';

  var userItems = new List<MetaItem>();
  userItems.add(MetaItem('\$base-bg', '#abcdef'));
  userItems.add(MetaItem('\$base-accent', '#abcdef'));

  var result = sass.compile(
    'bundles/dx.light.scss',
    charset: false,
    importers: [
      ThemeBuilderImporter(indexFileContent, userItems)
    ],
    functions: [
      Collector().collector
    ]
  );
  print('end - ${(DateTime.now().microsecondsSinceEpoch - time) / 1000}ms');
  new File('./out.css').writeAsStringSync(result);
}
