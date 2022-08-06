import { z } from 'zod';

export const inputCaseDataSchema = z.object({
  caseType: z.literal('input'),
  caseId: z.string(),
  hash: z.object({
    programMain: z.string(),
    inMain: z.string(),
  }),
});
export type InputCaseData = z.infer<typeof inputCaseDataSchema>;

export const interactCaseDataSchema = z.object({
  caseType: z.literal('interact'),
  caseId: z.string(),
  responderFolderId: z.string(),
  hash: z.object({
    programMain: z.string(),
    programResnponder: z.string(),
    inResponder: z.string(),
  }),
});
export type InteractCaseData = z.infer<typeof interactCaseDataSchema>;

export const nestCaseDataSchema = z.object({
  caseType: z.literal('nest'),
  nestId: z.string(),
});
export type NestCaseData = z.infer<typeof nestCaseDataSchema>;

export const allCaseDataSchema = z.union([inputCaseDataSchema, interactCaseDataSchema, nestCaseDataSchema]);
export type AllCaseData = z.infer<typeof allCaseDataSchema>;

export const caseDataSchema = z.union([inputCaseDataSchema, interactCaseDataSchema]);
export type CaseData = z.infer<typeof caseDataSchema>;

export const caseDataEntrySchema = z.object({
  caseName: z.string(),
  caseData: caseDataSchema,
});
export type CaseDataEntry = z.infer<typeof caseDataEntrySchema>;

export const caseDataEntriesSchema = z.array(
  z.union([
    z.object({
      type: z.literal('single'),
      caseEntry: caseDataEntrySchema,
    }),
    z.object({
      type: z.literal('nest'),
      nestName: z.string(),
      nestData: nestCaseDataSchema,
      caseEntries: z.array(caseDataEntrySchema),
    }),
  ]),
);
export type CaseDataEntries = z.infer<typeof caseDataEntriesSchema>;
