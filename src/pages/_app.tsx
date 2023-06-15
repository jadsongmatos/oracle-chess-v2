import type { AppProps } from 'next/app'

import "react-chessground/dist/styles/chessground.css";
import "bootstrap/dist/css/bootstrap.min.css";
import '@/styles/globals.css'

import { QueryClient, QueryClientProvider } from 'react-query';

// Create a client
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
