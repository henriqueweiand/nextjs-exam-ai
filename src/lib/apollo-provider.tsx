'use client';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useAuth } from '@clerk/nextjs';
import { createUploadLink } from 'apollo-upload-client';
import { ReactNode, useEffect, useMemo, useState } from 'react';

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      setToken(token);
    };
    fetchToken();
  }, [getToken]);

  const client = useMemo(() => {
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: createUploadLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql',
        headers: {
          'apollo-require-preflight': 'true',
          ...(token && { 'authorization': `Bearer ${token}` }),
        },
        fetchOptions: {
          credentials: 'include',
        },
      }),
    });
  }, [token]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
