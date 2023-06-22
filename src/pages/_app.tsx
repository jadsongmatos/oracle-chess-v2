import React from "react";

import type { AppProps } from "next/app";

import "react-chessground/dist/styles/chessground.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import {
  QueryClient,
  Hydrate,
  //QueryClientProvider,
  MutationCache,
} from "@tanstack/react-query";

let persister: any = null;
if (typeof window !== "undefined") {
  persister = createSyncStoragePersister({
    storage: window.localStorage,
  });
}
export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
            staleTime: 2000,
            retry: 1,
          },
        },
        mutationCache: new MutationCache(),
      })
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        // resume mutations after initial restore from localStorage was successful
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}
    >
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
      <ReactQueryDevtools initialIsOpen />
    </PersistQueryClientProvider>
  );
}
