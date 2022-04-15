import { createRoot } from "react-dom/client";
import enhance from "./enhance";

const Component = () => (
  <>
    <span style={{ color: "red" }}>Hello</span>, world!
  </>
);

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
