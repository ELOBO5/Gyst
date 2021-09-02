/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(__dirname, "../newhabit.html"),
  "utf8"
);

describe("newhabit.html", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  describe("head", () => {
    test("Title exists", () => {
      const title = document.querySelector("head > title");
      expect(title).toBeTruthy();
      expect(title.textContent).toBe("GYST");
    });

    test("there is a favicon", () => {
      const head = document.querySelector("head");
      expect(head.innerHTML).toContain('link rel="icon"');
    });

    test("there is a css stylesheet", () => {
      const head = document.querySelector("head");
      expect(head.innerHTML).toContain('link rel="stylesheet"');
    });
  });

  describe("nav", () => {
    test("there is a nav bar", () => {
      const nav = document.querySelector("nav");
      expect(nav).toBeTruthy();
    });
    test("nav contains anchor links", () => {
      const nav = document.querySelector("nav");
      expect(nav.innerHTML).toContain("a href=");
    });
  });

  test("main body contains a new habit form", () => {
    const newHabitForm = document.querySelector("#submitNewHabit");
    expect(newHabitForm).toBeTruthy();
  });
});

describe("form", () => {
  describe("inputs", () => {
    test("it has a required input field for the habit with a character limit of 40", () => {
      const habitInput = document.querySelector("#habit-entry");
      expect(habitInput).toBeTruthy();
      expect(habitInput.getAttribute("maxlength")).toBe("40");
      expect(habitInput).toHaveProperty("required");
      expect(habitInput.getAttribute("type")).toBe("text");
    });

    test("it has a select field for frequency", () => {
      const form = document.querySelector("#submitNewHabit");
      expect(form.innerHTML).toContain("select");
    });

    test("it has a non-required checkbox priority field", () => {
      const priorityInput = document.querySelector("#habit-priority");
      expect(priorityInput).toBeTruthy();
      expect(priorityInput.getAttribute("type")).toBe("checkbox");
      expect(priorityInput.getAttribute("required")).toBeFalsy();
    });

    test("it has a submit button", () => {
      const submit = document.querySelector("#habit-submit");
      expect(submit).toBeTruthy();
      expect(submit.getAttribute("type")).toBe("submit");
    });
  });
});

describe("footer", () => {
  test("footer exists", () => {
    const footer = document.querySelector("footer");
    expect(footer).toBeTruthy();
  });
});
