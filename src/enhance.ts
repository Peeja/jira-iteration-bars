/**
 * Elements which have a shadowRoot, but which we have dehanced (after
 * presumably enhancing them in the first place, and thus creating their
 * shadowRoot). Despite already having a shadowRoot, these elements are allowed
 * to be enhanced in the future.
 *
 * It's not possible to actually remove a shadowRoot once attached, so instead
 * we "dehance" the element by giving it a noop shadow DOM, and then track it
 * here. Then, even though we can see they already have a shadowRoot, they're
 * permitted to be enhanced once again in the future.
 */
const dehancedElements = new WeakSet<Element>();

type Cleanup = () => void;

const enhanceElement = (
  element: Element,
  customizeShadow: (shadowRoot: ShadowRoot) => void | Cleanup,
  enhancedElementsCleanups: Map<Element, Cleanup | null>,
) => {
  if (element.shadowRoot && !dehancedElements.has(element)) {
    console.error("Element already has a shadowRoot:", element);
    return;
  } else {
    dehancedElements.delete(element);
    const shadowRoot =
      element.shadowRoot ?? element.attachShadow({ mode: "open" });
    while (shadowRoot.firstChild) {
      shadowRoot.removeChild(shadowRoot.firstChild);
    }
    const cleanup = customizeShadow(shadowRoot);
    enhancedElementsCleanups.set(element, cleanup ?? null);
  }
};

const enhance = (
  selector: string,
  customizeShadow: (shadowRoot: ShadowRoot) => void,
  // Be selective in what we require, because it's hard to make the various
  // concepts of "Window" agree on everything.
  win: Pick<typeof window, "document" | "MutationObserver" | "Element">,
) => {
  /**
   * Elements which this enhance() has enhanced, and which it will need to
   * dehance later, mapped to their cleanup functions.
   */
  const enhancedElementsCleanups = new Map<Element, Cleanup | null>();

  win.document.querySelectorAll(selector).forEach((heading) => {
    enhanceElement(heading, customizeShadow, enhancedElementsCleanups);
  });

  const observer = new win.MutationObserver(function (mutations) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof win.Element) {
          if (node.matches(selector)) {
            enhanceElement(node, customizeShadow, enhancedElementsCleanups);
          }

          node.querySelectorAll(selector).forEach((child) => {
            enhanceElement(child, customizeShadow, enhancedElementsCleanups);
          });
        }
      });
    });
  });

  observer.observe(win.document.body, { childList: true, subtree: true });

  return () => {
    enhancedElementsCleanups.forEach((cleanup, element) => {
      cleanup?.();
      if (element.shadowRoot) {
        element.shadowRoot.innerHTML = "<slot/>";
      }
      dehancedElements.add(element);
    });

    // TODO: Dispose of observer
  };
};

export default enhance;
