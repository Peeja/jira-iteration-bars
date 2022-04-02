const shadow = (element: Element) => {
  if (element.shadowRoot) {
    console.error("Element already has a shadowRoot:", element);
  } else {
    const shadowRoot = element.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `Hello, world!`;
  }
};

const sparkboardize = (
  // Be selective in what we require, because it's hard to make the various
  // concepts of "Window" agree on everything.
  win: Pick<typeof window, "document" | "MutationObserver" | "Element">,
) => {
  const selector = "h1";

  win.document.querySelectorAll(selector).forEach((heading) => {
    shadow(heading);
  });

  const observer = new win.MutationObserver(function (mutations) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof win.Element) {
          if (node.matches(selector)) {
            shadow(node);
          }

          node.querySelectorAll(selector).forEach((child) => {
            shadow(child);
          });
        }
      });
    });
  });

  observer.observe(win.document.body, { childList: true, subtree: true });
};

export default sparkboardize;
