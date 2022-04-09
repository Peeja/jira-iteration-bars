module.exports = {
  port: 8080,
  hmrHost: "localhost:8080",
  hot: true,
  // Live bindings are required to get React to load under Nollup.
  // https://github.com/PepsRyuu/nollup/issues/210#issuecomment-907447210
  liveBindings: true,
};
