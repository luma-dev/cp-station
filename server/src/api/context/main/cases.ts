import type { AllCaseData, CaseData, CaseDataEntries, CaseDataEntry, NestCaseData } from '@cp-station/core';
import { allCaseDataSchema } from '@cp-station/core';
import cuid from 'cuid';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import type { CasesContext, FolderContext } from '..';
import { createdScopedMutex } from '../../../mutex';

const listCasesMutexCache = createdScopedMutex();
export const listCasesMutex = (folderId: string) => {
  return listCasesMutexCache(folderId);
};

const parseCaseDir = async (d: string): Promise<AllCaseData | null> => {
  let dataJsonContent: string;
  try {
    dataJsonContent = await fs.promises.readFile(path.resolve(d, 'data.json'), { encoding: 'utf8' });
  } catch {
    return null;
  }
  return allCaseDataSchema.parse(JSON.parse(dataJsonContent));
};

export const createDefaultCasesContext = (workdir: string, folder: FolderContext): CasesContext => {
  const listCasesUnsafe = async (casesDir: string): Promise<CaseDataEntries> => {
    let entries0: fs.Dirent[];
    try {
      entries0 = await fs.promises.readdir(casesDir, { withFileTypes: true, encoding: 'utf8' });
    } catch {
      return [];
    }
    const cases: CaseDataEntries = (
      await Promise.all(
        entries0.map(async (e0) => {
          if (!e0.isDirectory()) return [];
          const d0 = path.resolve(casesDir, e0.name);
          const caseData0 = await parseCaseDir(d0);
          if (caseData0 == null) return [];

          if (caseData0.caseType !== 'nest') {
            return [
              {
                type: 'single' as const,
                caseEntry: {
                  caseName: e0.name,
                  caseData: caseData0,
                },
              },
            ];
          }
          const entries1 = await fs.promises.readdir(d0, { withFileTypes: true, encoding: 'utf8' });
          return [
            {
              type: 'nest' as const,
              nestName: e0.name,
              nestData: caseData0,
              caseEntries: (
                await Promise.all(
                  entries1.map(async (e1): Promise<CaseDataEntry[]> => {
                    const d1 = path.resolve(d0, e1.name);
                    const caseData1 = await parseCaseDir(d1);
                    if (caseData1 == null) return [];
                    if (caseData1.caseType === 'nest') {
                      throw new Error('depth 2 nest is not supported');
                    }

                    return [
                      {
                        caseName: e1.name,
                        caseData: caseData1,
                      },
                    ];
                  }),
                )
              ).flat(),
            },
          ];
        }),
      )
    ).flat();
    return cases;
  };

  const listCases: CasesContext['listCases'] = async (folderSpecifier) => {
    const f = await folder.getFolderUnwrap(folderSpecifier);
    const casesDir = path.resolve(workdir, f.folderName, '.cp', 'cases');

    return await listCasesMutex(f.folderData.folderId).runExclusive(async () => {
      return await listCasesUnsafe(casesDir);
    });
  };

  const resolveCaseNest = (entries: CaseDataEntries, caseNestId: string | null) => {
    const nest = entries.find((e) => e.type === 'nest' && e.nestData.nestId === caseNestId);
    if (nest == null) {
      return {
        isRoot: true,
        entries,
        caseNames: entries.flatMap((e) => {
          if (e.type === 'single') return [e.caseEntry.caseName];
          return [];
        }),
      } as const;
    }
    assert(nest.type === 'nest');
    return {
      isRoot: false,
      nestData: nest,
      caseNames: nest.caseEntries.map((ce) => ce.caseName),
    } as const;
  };

  const caseNameGenerator = function* caseNameGenerator(): Generator<string> {
    for (let i = 0; i < 999; i += 1) {
      yield `00${i}`.slice(-3);
    }
    for (const c of caseNameGenerator()) {
      yield `999-${c}`;
    }
  };

  const nestNameGenerator = function* nestNameGenerator(): Generator<string> {
    for (const c of caseNameGenerator()) {
      yield `nest-${c}`;
    }
  };

  const createCase: CasesContext['createCase'] = async ({ folderSpecifier, parentNestId, caseType }) => {
    const f = await folder.getFolderUnwrap(folderSpecifier);
    const casesDir = path.resolve(workdir, f.folderName, '.cp', 'cases');
    const caseId = cuid();

    return await listCasesMutex(f.folderData.folderId).runExclusive(async () => {
      const entries = await listCasesUnsafe(casesDir);
      const nest = resolveCaseNest(entries, parentNestId);
      const names = new Set(nest.caseNames);
      const caseName = (() => {
        for (const caseName of caseNameGenerator()) if (!names.has(caseName)) return caseName;
        throw new Error('unreachable');
      })();
      const nestDir = nest.isRoot
        ? path.resolve(casesDir, caseName)
        : path.resolve(casesDir, nest.nestData.nestName, caseName);

      await fs.promises.mkdir(nestDir, { recursive: true });
      const caseData: CaseData = {
        caseId,
        caseType,
      };
      await fs.promises.writeFile(path.resolve(nestDir, 'data.json'), JSON.stringify(caseData));

      return {
        caseId,
        caseName,
      };
    });
  };

  const createNest: CasesContext['createNest'] = async (folderSpecifier) => {
    const f = await folder.getFolderUnwrap(folderSpecifier);
    const casesDir = path.resolve(workdir, f.folderName, '.cp', 'cases');
    const nestId = cuid();

    return await listCasesMutex(f.folderData.folderId).runExclusive(async () => {
      const entries = await listCasesUnsafe(casesDir);
      const names = new Set(
        entries.flatMap((e) => {
          switch (e.type) {
            case 'nest':
              return e.nestName;
            default:
              return [];
          }
        }),
      );
      const nestName = (() => {
        for (const nestName of nestNameGenerator()) if (!names.has(nestName)) return nestName;
        throw new Error('unreachable');
      })();

      await fs.promises.mkdir(path.resolve(casesDir, nestName), { recursive: true });
      const nestData: NestCaseData = {
        nestId,
        caseType: 'nest',
      };
      await fs.promises.writeFile(path.resolve(casesDir, nestName, 'data.json'), JSON.stringify(nestData));

      return {
        nestId,
        nestName,
      };
    });
  };

  const setCaseInput = async ({ caseSpecifider }) => {};

  return {
    listCases,
    createCase,
    createNest,
    setCaseInput,
  };
};
