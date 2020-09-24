import 'package:sass/sass.dart' as sass;
import './importer.dart';
import './collector.dart';

class SassOptions {
  String file, data;
  SassOptions(this.file, this.data);
}

class CompilerResult {
  String css;
  Map<String, String> changedVariables;
  CompilerResult(this.css, this.changedVariables);
}

class Compiler {
  Collector collector = Collector();

  CompilerResult compile(List<MetaItem> items, String indexFileContent, SassOptions options) {
    String css;
    if(options.file != null) {
      css = sass.compile(
        options.file, //'bundles/dx.light.scss'
        charset: true,
        importers: [
          ThemeBuilderImporter(indexFileContent, items)
        ],
        functions: [
          collector.collector
        ]
      );
    } else if(options.data != null) {
      css = sass.compileString(options.data, charset: true);
    }

    return CompilerResult(css, collector.changedVariables);
  }
}
