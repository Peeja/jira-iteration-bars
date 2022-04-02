const enhancedElements = new WeakSet<Element>();

const enhanceElement = (
  element: Element,
  customizeShadow: (shadowRoot: ShadowRoot) => void,
) => {
  if (element.shadowRoot && !enhancedElements.has(element)) {
    console.error("Element already has a shadowRoot:", element);
    return;
  } else {
    enhancedElements.add(element);
    const shadowRoot =
      element.shadowRoot ?? element.attachShadow({ mode: "open" });
    customizeShadow(shadowRoot);
  }
};

const enhance = (
  selector: string,
  customizeShadow: (shadowRoot: ShadowRoot) => void,
  // Be selective in what we require, because it's hard to make the various
  // concepts of "Window" agree on everything.
  win: Pick<typeof window, "document" | "MutationObserver" | "Element">,
) => {
  win.document.querySelectorAll(selector).forEach((heading) => {
    enhanceElement(heading, customizeShadow);
  });

  const observer = new win.MutationObserver(function (mutations) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof win.Element) {
          if (node.matches(selector)) {
            enhanceElement(node, customizeShadow);
          }

          node.querySelectorAll(selector).forEach((child) => {
            enhanceElement(child, customizeShadow);
          });
        }
      });
    });
  });

  observer.observe(win.document.body, { childList: true, subtree: true });
};

export default enhance;
