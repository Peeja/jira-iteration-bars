import enhance from "./enhance";

enhance(window);

if (module?.hot) {
  module.hot.accept(() => {
    console.log("Reloading...");
    window.location.reload();
  });
}
