import { createContext } from '@swingride/core';

export type Context = {
  /**
   * Directory to copy template instance into.
   */
  readonly workdir: string;
};
export const { getContext, withContext } = createContext<Context>();
