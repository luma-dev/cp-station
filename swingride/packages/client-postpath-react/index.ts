import type { PostpathClient } from '@swingride/client-postpath';
import { createContext, createElement, useContext } from 'react';

const postpathContext = createContext<PostpathClient | null>(null);

export type PostpathClientProviderProps = {
  children: React.ReactNode;
  client: PostpathClient;
};
export const PostpathClientProvider: React.FC<PostpathClientProviderProps> = ({ children, client }) => {
  return createElement(
    postpathContext.Provider,
    {
      value: client,
    },
    children,
  );
};

export const usePostpathClient = (): PostpathClient => {
  const client = useContext(postpathContext);
  if (!client) {
    throw new Error('Postpath client not provided. Use <PostpathClientProvider> to provide client.');
  }
  return client;
};
