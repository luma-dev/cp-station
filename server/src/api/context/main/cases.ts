import type { AllCaseData, CaseDataEntries, CaseDataEntry } from '@cp-station/core';
import { allCaseDataSchema } from '@cp-station/core';
import fs from 'node:fs';
import path from 'node:path';
import type { CasesContext, FolderContext } from '..';

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
  const listCases: CasesContext['listCases'] = async (folderSpecifier) => {
    const f = await folder.getFolderUnwrap(folderSpecifier);
    const casesDir = path.resolve(workdir, f.folderName, '.cp', 'cases');
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

  return {
    listCases,
  };
};
