import { createRoot } from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import enhance from "./enhance";
import { Sparkboard } from "./Sparkboard";

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
    root.render(
      <>
        <slot />
        <CacheProvider value={cache}>
          <Sparkboard />
        </CacheProvider>
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
  module.hot.accept();
}
