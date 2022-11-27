export interface PasteBody {
  content: {
    ttl: number,
    raw: string,
    syntax: string,
  }
};

export interface PasteParams {
  id: string,
};

export interface KVWithMetadata {
  value: string | null,
  metadata: {
    gracePeriod: number,
  } | null
};

export interface KVParsedValue {
  raw: string,
  once: boolean,
  syntax: string,
}
