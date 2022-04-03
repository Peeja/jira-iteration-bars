import enhance from "./enhance";

const dehance = enhance(
  "h1",
  (shadowRoot: ShadowRoot): void => {
    shadowRoot.innerHTML = `Hello, world!`;
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
    dehance();
  });
}
