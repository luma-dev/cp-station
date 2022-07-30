import { z } from 'zod';
import { defineCommand } from '../../util';

const commonReq = {} as const;

const commonReqAfterCopied = {
  absPathCopiedTo: z.string(),
} as const;

export const handleAfterCopy = defineCommand({
  paramsSchema: z.object({
    ...commonReq,
    ...commonReqAfterCopied,
  }),
  returnSchema: z.void(),
});

export const getDefaultInstance = defineCommand({
  paramsSchema: z.void(),
  returnSchema: z.string(),
});

export const ensureBundled = defineCommand({
  paramsSchema: z.object({
    ...commonReq,
    ...commonReqAfterCopied,
  }),
  returnSchema: z.intersection(
    z.object({
      stdoutEncoded: z.string(),
      stderrEncoded: z.string(),
    }),
    z.union([
      z.object({
        bundledFileAbsPath: z.string(),
      }),
      z.object({
        bundledFileContent: z.string(),
      }),
    ]),
  ),
});

export const getBundledRunner = defineCommand({
  paramsSchema: z.object({
    ...commonReq,
    ...commonReqAfterCopied,
  }),
  returnSchema: z.object({
    workdirAbsPath: z.string(),
    binaryAbsPath: z.string(),
  }),
});
