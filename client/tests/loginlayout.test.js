/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

describe("index.html", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  describe("head", () => {
    test("Title exists", () => {
      const title = document.querySelector("head > title");
      expect(title).toBeTruthy();
      expect(title.textContent).toBe("Login");
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

  describe("body", () => {
    test("header exists and includes site name and a welcome", () => {
      let header = document.querySelector("h1");
      expect("header").toBeTruthy();
      expect(header.textContent).toContain("Welcome to Gyst");
    });

    test("main body contains a login form", () => {
      const loginForm = document.querySelector("#login");
      expect(loginForm).toBeTruthy();
    });
  });

  describe("form", () => {
    const form = document.querySelector("form");
    describe("inputs", () => {
      test("it has a required input field for email with a character limit of 100", () => {
        const emailInput = document.querySelector("#email");
        expect(emailInput).toBeTruthy();
        expect(emailInput.getAttribute("maxlength")).toBe("100");
        expect(emailInput).toHaveProperty("required");
      });
      test("it has a required password input field with a character limit of 100", () => {
        const passwordInput = document.querySelector("#password");
        expect(passwordInput).toBeTruthy();
        expect(passwordInput.getAttribute("type")).toBe("password");
        expect(passwordInput).toHaveProperty("required");
        expect(passwordInput.getAttribute("maxlength")).toBe("100");
      });
      test("it has a submit button", () => {
        const submit = document.querySelector("#submit-btn");
        expect(submit).toBeTruthy();
        expect(submit.getAttribute("type")).toBe("submit");
      });
    });
    describe("registration link", () => {
      test("it has a descriptive anchor link to the registration page", () => {
        const registrationText = document.querySelector(".register-check");
        const registrationLink = document.querySelector("a");
        expect(registrationText).toBeTruthy();
        expect(registrationLink).toBeTruthy();
        expect(registrationText.textContent).toContain(
          "Don't have an account?"
        );
        expect(registrationLink.textContent).toContain(
          "Click here to register"
        );
      });
    });
  });
});
