class CompilerResult {
  String css;
  Map<String, String> changedVariables;
  bool error;

  CompilerResult(this.css, this.changedVariables, this.error);

  Map<String, dynamic> toJson() {
    return {
      'css': css,
      'changedVariables': changedVariables,
      'error': error
    };
  }
}
