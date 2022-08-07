import type { CaseDataEntries, FolderData, FolderEntry, FolderSpecifier } from '@cp-station/core';
import { folderSpecifierSchema } from '@cp-station/core';
import { createContext } from '@swingride/core';
import { z } from 'zod';

export const createCaseParamsSchema = z.object({
  caseType: z.union([z.literal('input'), z.literal('interact')]),
  parentNestId: z.string().nullable(),
  folderSpecifier: folderSpecifierSchema,
});
export type CreateCaseParams = z.infer<typeof createCaseParamsSchema>;

export const createCaseReturnSchema = z.object({
  caseId: z.string(),
  caseName: z.string(),
});
export type CreateCaseReturn = z.infer<typeof createCaseReturnSchema>;

export const createNestReturnSchema = z.object({
  nestId: z.string(),
  nestName: z.string(),
});
export type CreateNestReturn = z.infer<typeof createNestReturnSchema>;

export type CasesContext = {
  readonly listCases: (folderSpecifier: FolderSpecifier) => Promise<CaseDataEntries>;
  readonly createCase: (params: CreateCaseParams) => Promise<CreateCaseReturn>;
  readonly createNest: (folderSpecifier: FolderSpecifier) => Promise<CreateNestReturn>;
};

export type FolderContext = {
  readonly listFolders: () => Promise<FolderEntry[]>;
  readonly getFolder: (folderSpecifier: FolderSpecifier) => Promise<FolderEntry | undefined>;
  readonly getFolderUnwrap: (folderSpecifier: FolderSpecifier) => Promise<FolderEntry>;
  readonly setFolderName: (params: { folderSpecifier: FolderSpecifier; newFolderName: string }) => Promise<void>;
  readonly getBundledCode: (folderSpecifier: FolderSpecifier) => Promise<string>;
  readonly writeData: (params: { folderSpecifier: FolderSpecifier; folderData: FolderData }) => Promise<void>;
};

export type Context = {
  /**
   * Directory to copy template instance into.
   */
  readonly workdir: string;
  readonly folder: FolderContext;
  readonly cases: CasesContext;
};
export const { getContext, withContext } = createContext<Context>();
