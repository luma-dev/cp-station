import { z } from 'zod';

export const providerTypeSchema = z.literal('local');
export type ProviderType = z.infer<typeof providerTypeSchema>;

export const localTemplateProviderSchema = z.object({
  type: providerTypeSchema,
  templatePath: z.string(),
});
export type LocalTemplateProvider = z.infer<typeof localTemplateProviderSchema>;

export const templateProviderSchema = localTemplateProviderSchema;
export type TemplateProvider = z.infer<typeof templateProviderSchema>;

export const templateProviderConfigSchema = z.object({
  name: z.string(),
  provider: templateProviderSchema,
});
export type TemplateProviderConfig = z.infer<typeof templateProviderConfigSchema>;

export const templateProviderConfigFileSchema = z.array(templateProviderConfigSchema);
export type TemplateProviderConfigFile = z.infer<typeof templateProviderConfigFileSchema>;
