import type { CaseDataEntries, FolderData, FolderEntry, FolderSpecifier } from '@cp-station/core';
import { createContext } from '@swingride/core';

export type CasesContext = {
  readonly listCases: (FolderSpecifier: FolderSpecifier) => Promise<CaseDataEntries>;
};

export type FolderContext = {
  readonly listFolders: () => Promise<FolderEntry[]>;
  readonly getFolder: (FolderSpecifier: FolderSpecifier) => Promise<FolderEntry | undefined>;
  readonly getFolderUnwrap: (FolderSpecifier: FolderSpecifier) => Promise<FolderEntry>;
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
