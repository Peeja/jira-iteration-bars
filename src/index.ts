import enhance from "./enhance";

const dehance = enhance(
  "h1",
  (shadowRoot: ShadowRoot): void => {
    shadowRoot.innerHTML = `Hello, world!`;
  },
  window,
);

// Hot Module Replacement Support:

if (module.hot) {
  module.hot.dispose(() => {
    dehance();
  });
  module.hot.accept();
}
