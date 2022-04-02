const enhancedElements = new WeakSet<Element>();

const enhanceElement = (element: Element) => {
  if (element.shadowRoot && !enhancedElements.has(element)) {
    console.error("Element already has a shadowRoot:", element);
    return;
  } else {
    enhancedElements.add(element);
    const shadowRoot =
      element.shadowRoot ?? element.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `Hello, world!`;
  }
};

const enhance = (
  // Be selective in what we require, because it's hard to make the various
  // concepts of "Window" agree on everything.
  win: Pick<typeof window, "document" | "MutationObserver" | "Element">,
) => {
  const selector = "h1";

  win.document.querySelectorAll(selector).forEach((heading) => {
    enhanceElement(heading);
  });

  const observer = new win.MutationObserver(function (mutations) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof win.Element) {
          if (node.matches(selector)) {
            enhanceElement(node);
          }

          node.querySelectorAll(selector).forEach((child) => {
            enhanceElement(child);
          });
        }
      });
    });
  });

  observer.observe(win.document.body, { childList: true, subtree: true });
};

export default enhance;
