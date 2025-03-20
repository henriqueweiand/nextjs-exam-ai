'use client';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { ReactNode } from 'react';

// uri: 'http://localhost:3000/graphql',
export function ApolloWrapper({ children }: { children: ReactNode }) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createUploadLink({
      uri: 'https://nestjs-exam-ai.onrender.com/graphql',
      headers: {
        'apollo-require-preflight': 'true',
      }
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
