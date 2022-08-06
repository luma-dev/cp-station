import { z } from 'zod';
import { templateProviderSchema } from './template_provider';

export const folderSpecifierSchema = z.union([
  z.object({
    folderId: z.string(),
  }),
  z.object({
    folderName: z.string(),
  }),
]);
export type FolderSpecifier = z.infer<typeof folderSpecifierSchema>;

export const folderDataSchema = z.object({
  templateProvider: templateProviderSchema,
  folderId: z.string(),
});
export type FolderData = z.infer<typeof folderDataSchema>;

export const folderEntrySchema = z.object({
  folderName: z.string(),
  folderData: folderDataSchema,
});
export type FolderEntry = z.infer<typeof folderEntrySchema>;

export const bundleResultSchema = z.intersection(
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
);
export type BundleResult = z.infer<typeof bundleResultSchema>;
