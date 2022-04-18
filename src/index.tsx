import { createRoot } from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import enhance from "./enhance";
import { Sparkboard } from "./Sparkboard";

const queryClient = new QueryClient();

const dehance = enhance(
  ".ghx-issue",
  (shadowRoot) => {
    const root = createRoot(shadowRoot);
    const cache = createCache({
      key: "css",
      // Waiting on: https://github.com/emotion-js/emotion/pull/2728
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      container: shadowRoot as any,
    });
    const issueKey = shadowRoot.host.getAttribute("data-issue-key");
    root.render(
      <>
        <slot />
        <QueryClientProvider client={queryClient}>
          <CacheProvider value={cache}>
            {issueKey && <Sparkboard issueKey={issueKey} />}
          </CacheProvider>
        </QueryClientProvider>
      </>,
    );
    return () => {
      root.unmount();
    };
  },
  window,
);

if (process.env.NODE_ENV === "development") {
  const dehanceDevTools = enhance(
    "body",
    (shadowRoot) => {
      const root = createRoot(shadowRoot);
      root.render(
        <>
          <slot />
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </>,
      );
      return () => {
        root.unmount();
      };
    },
    window,
  );

  // Hot Module Replacement Support:

  if (module.hot) {
    module.hot.dispose(dehance);
    module.hot.dispose(dehanceDevTools);
    module.hot.accept();
  }
}
