import type { LocalTemplateProvider } from '@cp-station/core';
import type { LocalCommandName, LocalCommands } from '@cp-station/template-spec-gen';
import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type { TemplateCaller, ValidateMessage } from '../common';
import { summarizeValidation } from '../common';

const isDir = async (p: string): Promise<boolean> => {
  try {
    const s = await fs.promises.stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
};

const isExecutable = async (p: string): Promise<boolean> => {
  try {
    await fs.promises.access(p, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
};

export type CreateLocalTemplateCallerParams = {
  provider: LocalTemplateProvider;
};

type InvokeEntrypointParams<Params> = {
  entrypointPath: string;
} & (Params extends void
  ? {}
  : {
      params: Params;
    });
const invokeEntrypoint =
  <T extends LocalCommandName>(command: T) =>
  async (params: InvokeEntrypointParams<LocalCommands[T]['params']>): Promise<LocalCommands[T]['returnType']> => {
    return new Promise((resolve, reject) => {
      const p = child_process.spawn(params.entrypointPath, {
        cwd: path.dirname(params.entrypointPath),
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      if (p.exitCode == null) {
        p.stdin.write(
          JSON.stringify({
            command,
            params: (params as any).params,
          }),
        );
        p.stdin.end();
        p.stdin.once('error', (err) => {
          if (err) reject(err);
        });
        let buf = '';
        p.stdout.on('data', (data) => {
          buf += data;
        });
        p.once('exit', () => {
          if (buf.trim() === '') (resolve as any)();
          else resolve(JSON.parse(buf));
        });
      } else {
        reject(new Error('not starting'));
      }
    });
  };

export const createLocalTemplateCaller = async ({
  provider: { templatePath },
}: CreateLocalTemplateCallerParams): Promise<TemplateCaller> => {
  const instancesDir = path.resolve(templatePath, 'instances');
  const entrypointPath = path.resolve(templatePath, '.cp-template');

  return {
    async validate() {
      const messages: ValidateMessage[] = await Promise.all([
        (async () => ({
          message: 'Is accessible and directory?',
          status: await isDir(templatePath),
        }))(),
        (async () => ({
          message: 'Instances directory found?',
          status: await isDir(path.resolve(templatePath, 'instances')),
        }))(),
        (async () => ({
          message: 'Is executable .cp-template found?',
          status: await isExecutable(path.resolve(templatePath, '.cp-template')),
        }))(),
        (async () => ({
          message: 'Is local type?',
          status: 'skipped',
        }))(),
      ]);
      if (messages[0].status && messages[1].status && messages[2].status) {
        try {
          const type = await invokeEntrypoint('getControllerType')({
            entrypointPath,
          });
          messages[3].status = type === 'local';
        } catch (e: unknown) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }
      return summarizeValidation(messages);
    },
    async listInstances() {
      const names = await fs.promises.readdir(instancesDir, {
        withFileTypes: true,
      });
      return names.filter((n) => n.isDirectory).map((n) => n.name);
    },
    async getDefaultInstance() {
      return await invokeEntrypoint('getDefaultInstance')({
        entrypointPath,
      });
    },
    async copyFromInstance({ absPathCopyTo, instance }) {
      const from = path.resolve(instancesDir, instance);
      await fs.promises.cp(from, absPathCopyTo, {
        recursive: true,
        errorOnExist: true,
      });
      await invokeEntrypoint('handleAfterCopy')({
        entrypointPath,
        params: {
          absPathCopiedTo: absPathCopyTo,
        },
      });
    },
    async ensureBundled({ absPathCopiedTo }) {
      await invokeEntrypoint('ensureBundled')({
        entrypointPath,
        params: {
          absPathCopiedTo,
        },
      });
    },
    async runBundled({ absPathCopiedTo }) {
      const { workdirAbsPath, binaryAbsPath } = await invokeEntrypoint('getBundledRunner')({
        entrypointPath,
        params: {
          absPathCopiedTo,
        },
      });
      return child_process.spawn(binaryAbsPath, {
        cwd: workdirAbsPath,
        stdio: 'pipe',
      });
    },
  };
};
