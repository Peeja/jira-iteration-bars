import sparkboardize from "./sparkboardize";

sparkboardize(window);

if (module?.hot) {
  module.hot.accept(() => {
    console.log("Reloading...");
    window.location.reload();
  });
}
