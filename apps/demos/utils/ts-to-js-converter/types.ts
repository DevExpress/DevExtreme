export type Logger = {
  info: (msg: string) => void
  debug: (msg: string) => void
  error: (msg: string) => void
  warning: (msg: string) => void
};

export type PathResolver = (file: string) => string;

export type PathResolvers = {
  source: PathResolver
  out: PathResolver
};

export type ActionConverterEntry = {
  source: string
  out: string
};
