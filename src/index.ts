console.log("hi there!");

if (module?.hot) {
  module.hot.accept(() => {
    console.log("Reloading...");
    window.location.reload();
  });
}
