import { createRoot } from "react-dom/client";
import { Component } from "./Component";
import enhance from "./enhance";

const dehance = enhance(
  "h1",
  (shadowRoot) => {
    const root = createRoot(shadowRoot);
    root.render(<Component />);
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
