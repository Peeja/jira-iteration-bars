expect.extend({
  toBeShadowed(
    received: unknown,
    shadowExpectations?: (shadowRoot: ShadowRoot) => void,
  ) {
    if (this.isNot && shadowExpectations) {
      throw "shadowExpectations can only be used with a positive expectation; otherwise there's no shadowRoot to expect() about.";
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const isElement = (o: object): o is Element => (o as any).nodeType == 1;

    if (
      typeof received != "object" ||
      received === null ||
      !isElement(received)
    ) {
      throw "toBeShadowed() expects an Element";
    }

    if (received.shadowRoot) {
      shadowExpectations?.(received.shadowRoot);
      return {
        message: () => `expected ${received.tagName} not to be shadowed`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received.tagName} to be shadowed`,
        pass: false,
      };
    }
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace jest {
  // eslint-disable-next-line @typescript-eslint/ban-types
  interface Matchers<R = unknown, T = {}> {
    toBeShadowed: T extends Element
      ? (shadowExpectations?: (shadowRoot: ShadowRoot) => void) => R
      : never;
  }
}
