import { createRoot, Root } from "react-dom/client";
import enhance from "./enhance";

const Component = () => (
  <>
    <span style={{ color: "red" }}>Hello</span>, world!
  </>
);

let root: Root;

const dehance = enhance(
  "h1",
  (shadowRoot: ShadowRoot): void => {
    root = createRoot(shadowRoot);
    root.render(<Component />);
  },
  window,
);

// Hot Module Replacement Support:

if (module.hot) {
  module.hot.dispose(() => {
    root.unmount();
    dehance();
  });
  module.hot.accept();
}
