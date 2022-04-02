import enhance from "./enhance";

enhance(
  "h1",
  (shadowRoot: ShadowRoot) => {
    shadowRoot.innerHTML = `Hello, world!`;
  },
  window,
);

if (module?.hot) {
  module.hot.accept(() => {
    console.log("Reloading...");
    window.location.reload();
  });
}
