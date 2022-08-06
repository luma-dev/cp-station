import type { Context } from '.';
import { createDefaultCasesContext } from './main/cases';
import { createDefaultFolderContext } from './main/folder';

export const createDefaultContext = (): Context => {
  const workdir = '/home/luma/cp-work'; // TODO

  const folder = createDefaultFolderContext(workdir);
  const cases = createDefaultCasesContext(workdir, folder);

  return {
    workdir,
    folder,
    cases,
  };
};
