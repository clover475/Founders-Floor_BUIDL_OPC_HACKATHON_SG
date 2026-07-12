export type StorageEnvelope<T> = {
  version: 1;
  value: T;
  updatedAt: string;
};

export function readLocalValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as StorageEnvelope<T>;
    return parsed.value ?? fallback;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

export function writeLocalValue<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  const envelope: StorageEnvelope<T> = {
    version: 1,
    value,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(key, JSON.stringify(envelope));
}

export function removeLocalValue(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}
