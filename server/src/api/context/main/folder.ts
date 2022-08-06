import type { FolderEntry, FolderSpecifier } from '@cp-station/core';
import { folderDataSchema } from '@cp-station/core';
import { templateCaller } from '@cp-station/template-spec';
import fs from 'node:fs';
import path from 'node:path';
import type { FolderContext } from '..';

const cpStationDataJsonPath = (workdir: string, name: string) => {
  return path.resolve(workdir, name, '.cp', 'data.json');
};

export const createDefaultFolderContext = (workdir: string): FolderContext => {
  const listFolders: FolderContext['listFolders'] = async () => {
    const dir = await fs.promises.readdir(workdir, { encoding: 'utf8', withFileTypes: true });
    return (
      await Promise.all(
        dir
          .filter((e) => e.isDirectory)
          .map(async (e) => {
            const folderData = folderDataSchema.parse(
              JSON.parse(
                await fs.promises.readFile(cpStationDataJsonPath(workdir, e.name), {
                  encoding: 'utf8',
                }),
              ),
            );
            return [
              {
                folderName: e.name,
                folderData,
              },
            ];
          })
          .map((e) =>
            e.catch((e) => {
              // eslint-disable-next-line no-console
              console.error(e);
              return [];
            }),
          ),
      )
    ).flat();
  };

  const getFolderById = async (folderId: string): Promise<FolderEntry | undefined> => {
    return (await listFolders()).find((e) => e.folderData.folderId === folderId);
  };

  const getFolder: FolderContext['getFolder'] = async (folderSpecifier) => {
    if ('folderId' in folderSpecifier) {
      return await getFolderById(folderSpecifier.folderId);
    }
    const folderData = folderDataSchema.parse(
      JSON.parse(
        await fs.promises.readFile(cpStationDataJsonPath(workdir, folderSpecifier.folderName), {
          encoding: 'utf8',
        }),
      ),
    );
    return {
      folderName: folderSpecifier.folderName,
      folderData,
    };
  };

  const getFolderUnwrap = async (folderSpecifier: FolderSpecifier): Promise<FolderEntry> => {
    const folder = await getFolder(folderSpecifier);
    if (folder == null) {
      if ('folderId' in folderSpecifier) {
        throw new Error(`folder (id=${folderSpecifier.folderId}) is not found`);
      } else {
        throw new Error(`folder (name=${folderSpecifier.folderName}) is not found`);
      }
    }
    return folder;
  };

  const setFolderName: FolderContext['setFolderName'] = async ({ folderSpecifier, newFolderName }) => {
    const folder = await getFolderUnwrap(folderSpecifier);
    if (!newFolderName.match(/^[^^`\s/\\!*%#$?]+$/)) throw new Error('folder name is not acceptable');
    await fs.promises.rename(path.resolve(workdir, folder.folderName), path.resolve(workdir, newFolderName));
  };

  const getBundledCode: FolderContext['getBundledCode'] = async (folderSpecifier) => {
    const folder = await getFolderUnwrap(folderSpecifier);
    const folderPath = path.resolve(workdir, folder.folderName);
    const data = folderDataSchema.parse(
      JSON.parse(
        await fs.promises.readFile(cpStationDataJsonPath(workdir, folder.folderName), {
          encoding: 'utf8',
        }),
      ),
    );
    const caller = await templateCaller.createLocalTemplateCaller({ provider: data.templateProvider });
    const bundled = await caller.ensureBundled({
      absPathCopiedTo: folderPath,
    });
    const content = await (async () => {
      if ('bundledFileAbsPath' in bundled) {
        return await fs.promises.readFile(bundled.bundledFileAbsPath, { encoding: 'utf8' });
      }
      return bundled.bundledFileContent;
    })();
    return content;
  };

  const writeData: FolderContext['writeData'] = async ({ folderSpecifier, folderData }) => {
    if ('folderId' in folderSpecifier) {
      const folder = await getFolderUnwrap(folderSpecifier);
      await fs.promises.writeFile(cpStationDataJsonPath(workdir, folder.folderName), JSON.stringify(folderData));
    } else {
      await fs.promises.writeFile(
        cpStationDataJsonPath(workdir, folderSpecifier.folderName),
        JSON.stringify(folderData),
      );
    }
  };

  return {
    listFolders,
    getFolder,
    getFolderUnwrap,
    setFolderName,
    getBundledCode,
    writeData,
  };
};
