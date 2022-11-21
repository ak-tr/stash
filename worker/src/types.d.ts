export interface PasteBody {
  content: {
    ttl: number,
    raw: string,
    once: boolean,
  }
};

export interface PasteParams {
  id: string,
};

export interface ValueInKV {
  raw: string,
  once: boolean,
};