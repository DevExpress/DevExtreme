declare class AzureGateway {
  constructor(url: string, onRequestExecuted: Function);
}

declare class AzureFileSystem {
  constructor(gateway: AzureGateway);
}
