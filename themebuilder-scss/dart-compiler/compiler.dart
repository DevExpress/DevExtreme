import 'package:sass/sass.dart' as sass;
import './importer.dart';
import './collector.dart';
import './compiler-result.dart';

class SassOptions {
  String file, data;
  SassOptions(this.file, this.data);
}

class Compiler {
  Collector collector = Collector();

  CompilerResult compile(
      List<MetaItem> items, String indexFileContent, SassOptions options) {
    String css;
    if (options.data.isEmpty) {
      css = sass.compile(options.file,
          charset: true,
          importers: [ThemeBuilderImporter(indexFileContent, items)],
          functions: [collector.collector]);
    } else {
      css = sass.compileString(options.data,
          charset: true,
          importers: [ThemeBuilderImporter(indexFileContent, items)],
          functions: [collector.collector]);
    }

    return CompilerResult(css, collector.changedVariables, '');
  }
}
