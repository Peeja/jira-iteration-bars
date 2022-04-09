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

interface NollupModule extends Omit<NodeModule, "hot"> {
  hot: {
    accept(callback?: (info: { disposed: number[] }) => void): void;
    dispose(callback: () => void): void;
  };
}

declare const module: NollupModule | undefined;

if (module?.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    root.unmount();
    dehance();
  });
}
