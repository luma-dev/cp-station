import type child_process from 'node:child_process';
import { z } from 'zod';

export type CopyFromInstanceParams = {
  absPathCopyTo: string;
  instance: string;
};

export const validateMessageStatusSchema = z.union([z.boolean(), z.literal('skipped')]);
export type ValidateMessageStatus = z.infer<typeof validateMessageStatusSchema>;

export const validateMessageSchema = z.object({
  status: validateMessageStatusSchema,
  message: z.string(),
});
export type ValidateMessage = z.infer<typeof validateMessageSchema>;

export const validateResultSchema = z.object({
  valid: z.boolean(),
  messages: z.array(validateMessageSchema),
});
export type ValidateResult = z.infer<typeof validateResultSchema>;

export type CommonAfterCopied = {
  absPathCopiedTo: string;
};
export type TemplateCaller = {
  validate: () => Promise<ValidateResult>;
  listInstances: () => Promise<string[]>;
  getDefaultInstance: () => Promise<string>;
  copyFromInstance: (params: CopyFromInstanceParams) => Promise<void>;
  ensureBundled: (params: CommonAfterCopied) => Promise<void>;
  runBundled: (params: CommonAfterCopied) => Promise<child_process.ChildProcessWithoutNullStreams>;
};

export const summarizeValidation = (messages: Array<ValidateMessage>) => {
  return {
    valid: messages.reduce((a, b) => a && b.status === true, true),
    messages,
  };
};
