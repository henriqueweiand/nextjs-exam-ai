'use client';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { ReactNode } from 'react';

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createUploadLink({
      uri: process.env.GRAPHQL_URL || 'http://localhost:3000/graphql',
      headers: {
        'apollo-require-preflight': 'true',
      }
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
