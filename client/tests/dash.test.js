/**
 * @jest-environment jsdom
 */

const { expect } = require("@jest/globals");
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "../dash.html"), "utf8");

global.fetch = require("jest-fetch-mock");
let app;

describe("app", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    app = require("../static/js/dash");
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  describe("requests", () => {
    describe("getAllHabits", () => {
      test("it makes a get request to /users/${userId}/habits", () => {
        const userId = localStorage.getItem("id");
        app.getAllHabits();
        expect(fetch).toHaveBeenCalled();
        expect(fetch.mock.calls[0][0]).toMatch(
          `https://get-your-sht-together.herokuapp.com/users/${userId}/habits`
        );
      });
    });
  });

  describe("logout", () => {
    test("it should redirect to /index.html", () => {
      app.logout();
      expect(window.location.href).toContain("index.html");
    });
  });
});
