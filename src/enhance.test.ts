import { JSDOM } from "jsdom";
import mockConsole from "jest-mock-console";

import enhance from "./enhance";

const waitForEvents = () =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 0);
  });

describe("enhance()", () => {
  it("enhances existing elements", () => {
    const { window: win } = new JSDOM(`<h1>Hello</h1><h2>world</h2>`);

    enhance(
      "h1",
      (shadowRoot: ShadowRoot) => {
        shadowRoot.innerHTML = `Hello, world!`;
      },
      win,
    );

    expect(win.document.querySelector("h1")).toBeShadowed(
      (shadowRoot: ShadowRoot) => {
        expect(shadowRoot.innerHTML).toBe("Hello, world!");
      },
    );
    expect(win.document.querySelector("h2")).not.toBeShadowed();
  });

  it("enhances elements added later", async () => {
    const { window: win } = new JSDOM();

    enhance(
      "h1",
      (shadowRoot: ShadowRoot) => {
        shadowRoot.innerHTML = `Hello, world!`;
      },
      win,
    );
    win.document.body.innerHTML = `<h1>Hello</h1><h2>world</h2>`;
    await waitForEvents();

    expect(win.document.querySelector("h1")).toBeShadowed(
      (shadowRoot: ShadowRoot) => {
        expect(shadowRoot.innerHTML).toBe("Hello, world!");
      },
    );

    expect(win.document.querySelector("h2")).not.toBeShadowed();
  });

  it("enhances children of elements added later", async () => {
    const { window: win } = new JSDOM(`<!DOCTYPE html>`);

    enhance(
      "h1",
      (shadowRoot: ShadowRoot) => {
        shadowRoot.innerHTML = `Hello, world!`;
      },
      win,
    );
    win.document.body.innerHTML = `<div><h1>Hello</h1><h2>world</h2></div>`;
    await waitForEvents();

    expect(win.document.querySelector("h1")).toBeShadowed(
      (shadowRoot: ShadowRoot) => {
        expect(shadowRoot.innerHTML).toBe("Hello, world!");
      },
    );

    expect(win.document.querySelector("h2")).not.toBeShadowed();
  });

  it("ignores already-shadowed elements", () => {
    const { window: win } = new JSDOM(`<h1>Hello</h1>`);
    const h1 = win.document.querySelector("h1");
    if (!h1) throw "h1 was expected but not found";
    const shadowRoot = h1.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = "Hi there.";
    const restoreConsole = mockConsole("error");

    enhance(
      "h1",
      (shadowRoot: ShadowRoot) => {
        shadowRoot.innerHTML = `Hello, world!`;
      },
      win,
    );

    expect(h1).toBeShadowed((shadowRoot: ShadowRoot) => {
      expect(shadowRoot.innerHTML).toBe("Hi there.");
    });
    expect(console.error).toHaveBeenCalledWith(
      "Element already has a shadowRoot:",
      h1,
    );

    restoreConsole();
  });

  it("returns a function which dehances the elements", () => {
    const { window: win } = new JSDOM(`<h1>Hello</h1><h2>world</h2>`);
    const dehance = enhance(
      "h1",
      (shadowRoot: ShadowRoot) => {
        shadowRoot.innerHTML = `Hello, world!`;
      },
      win,
    );
    expect(win.document.querySelector("h1")).toBeShadowed(
      (shadowRoot: ShadowRoot) => {
        expect(shadowRoot.innerHTML).toBe("Hello, world!");
      },
    );

    dehance();

    // Notably, the element is still shadowed, as there's no way to remove a
    // shadowRoot once added, but the shadow is a noop slot.
    expect(win.document.querySelector("h1")).toBeShadowed(
      (shadowRoot: ShadowRoot) => {
        expect(shadowRoot.innerHTML).toBe("<slot></slot>");
      },
    );
  });

  it("re-enhances a dehanced element", () => {
    const { window: win } = new JSDOM(`<h1>Hello</h1><h2>world</h2>`);
    const dehance = enhance(
      "h1",
      (shadowRoot: ShadowRoot) => {
        shadowRoot.innerHTML = `Hello, world!`;
      },
      win,
    );
    expect(win.document.querySelector("h1")).toBeShadowed(
      (shadowRoot: ShadowRoot) => {
        expect(shadowRoot.innerHTML).toBe("Hello, world!");
      },
    );
    dehance();
    const restoreConsole = mockConsole("error");

    enhance(
      "h1",
      (shadowRoot: ShadowRoot) => {
        shadowRoot.innerHTML = `Hi, there!`;
      },
      win,
    );

    expect(win.document.querySelector("h1")).toBeShadowed(
      (shadowRoot: ShadowRoot) => {
        expect(shadowRoot.innerHTML).toBe("Hi, there!");
      },
    );
    expect(console.error).not.toHaveBeenCalled();

    restoreConsole();
  });

  it("ignores re-enhanced elements as well", () => {
    const { window: win } = new JSDOM(`<h1>Hello</h1><h2>world</h2>`);
    const dehance = enhance(
      "h1",
      (shadowRoot: ShadowRoot) => {
        shadowRoot.innerHTML = `Hello, world!`;
      },
      win,
    );
    expect(win.document.querySelector("h1")).toBeShadowed(
      (shadowRoot: ShadowRoot) => {
        expect(shadowRoot.innerHTML).toBe("Hello, world!");
      },
    );
    dehance();
    enhance(
      "h1",
      (shadowRoot: ShadowRoot) => {
        shadowRoot.innerHTML = `Hi, there!`;
      },
      win,
    );
    const restoreConsole = mockConsole("error");

    enhance(
      "h1",
      (shadowRoot: ShadowRoot) => {
        shadowRoot.innerHTML = `Ahoy, friend!`;
      },
      win,
    );

    expect(win.document.querySelector("h1")).toBeShadowed(
      (shadowRoot: ShadowRoot) => {
        expect(shadowRoot.innerHTML).toBe("Hi, there!");
      },
    );
    expect(console.error).toHaveBeenCalledWith(
      "Element already has a shadowRoot:",
      win.document.querySelector("h1"),
    );

    restoreConsole();
  });
});
