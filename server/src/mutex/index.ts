import { Mutex } from 'async-mutex';

export const createdScopedMutex = () => {
  const cache = new Map<string, Mutex>();
  return (name: string) => {
    const cached = cache.get(name);
    if (cached == null) {
      const m = new Mutex();
      cache.set(name, m);
      return m;
    }
    return cached;
  };
};

const listCasesMutexCache = createdScopedMutex();
export const listCasesMutex = (caseId: string) => {
  return listCasesMutexCache(caseId);
};
