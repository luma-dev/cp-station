import type { z } from 'zod';

export type DefineCommand = {
  paramsSchema: z.ZodType;
  returnSchema: z.ZodType;
};
export const defineCommand = (parmas: DefineCommand) => parmas;
