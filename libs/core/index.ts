import { z } from 'zod';

export const providerTypeSchema = z.literal('local');
export type ProviderType = z.infer<typeof providerTypeSchema>;

export const templateProviderCommonSchema = {
  name: z.string(),
} as const;

export const localTemplateProviderSchema = z.object({
  ...templateProviderCommonSchema,
  type: providerTypeSchema,
  path: z.string(),
});

export const templateProviderSchema = localTemplateProviderSchema;
export type TemplateProvider = z.infer<typeof templateProviderSchema>;

export const templateProviderConfigSchema = z.array(templateProviderSchema);
export type TemplateProviderConfig = z.infer<typeof templateProviderConfigSchema>;
