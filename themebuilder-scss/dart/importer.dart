import 'dart:io';
import 'package:sass/sass.dart';
import 'package:path/path.dart' as path;

class ThemeBuilderImporter extends Importer {
  String indexFileContent;
  String scssWidgetsDir = './widgets/';
  FilesystemImporter fsImporter = FilesystemImporter('.');

  ThemeBuilderImporter(this.indexFileContent);

  bool isIndexImport(Uri url) => url.path.contains('tb_index');
  bool needModification(Uri url) => url.path.contains('tb_');
  String getTheme(Uri url) => url.path.contains('material') ? 'material' : 'generic';

  Uri canonicalize(Uri url) {
    if(!needModification(url)) return fsImporter.canonicalize(url);

    var theme = getTheme(url);
    var absolutePath = path.absolute(
      this.scssWidgetsDir,
      theme,
      isIndexImport(url) ? '_tb_index.scss' : '_tb_$theme.scss');

    var resultUri = path.toUri(path.canonicalize(absolutePath));

    return resultUri;
  }

  ImporterResult load(Uri url) {
    if(!needModification(url)) return fsImporter.load(url);

    var result = isIndexImport(url) ? indexFileContent : ''; // TODO add user variables
    return ImporterResult(result, syntax: Syntax.scss, sourceMapUrl: url);
  }

  bool couldCanonicalize(Uri url, Uri canonicalUrl) {
    return needModification(url);
  }

  String toString() => "(unknown)";
}