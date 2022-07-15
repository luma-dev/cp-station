import * as url from 'node:url';

export type ParseUrlAsPostpathParams = {
  url?: string | undefined;
  pathPrefix?: string | undefined;
};
export const parseUrlAsPostpath = ({ url: urlInput, pathPrefix = '' }: ParseUrlAsPostpathParams): string[] | null => {
  if (urlInput == null) return null;
  const pathname = url.parse(urlInput).pathname ?? '/';
  if (!pathname.startsWith(`${pathPrefix}/`)) {
    return null;
  }
  const targetPath = pathname.slice(pathPrefix.length + 1);
  const segments = targetPath === '' ? [] : targetPath.split('/');
  return segments;
};
