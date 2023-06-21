import React from "react";

import type { AppProps } from "next/app";

import "react-chessground/dist/styles/chessground.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";

import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
 // MutationCache,
} from "@tanstack/react-query";

// Create a client

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        staleTime: 2000,
        retry: 0,
      },
    },
    //mutationCache: new MutationCache()
  }));
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}
