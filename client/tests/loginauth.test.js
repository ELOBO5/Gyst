/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

global.fetch = require("jest-fetch-mock");
let app;

describe("app", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    app = require("../static/js/loginauth");
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  describe("requests", () => {
    describe("requestLogin", () => {
      test("it makes a post request to /auth/login with the login data", () => {
        const fakeSubmitEvent = {
          preventDefault: jest.fn(),
          target: {
            email: { value: "test@gmail.com" },
            password: { value: "password" }
          }
        };

        app.requestLogin(fakeSubmitEvent);
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "POST");
        expect(fetch.mock.calls[0][1]).toHaveProperty(
          "body",
          JSON.stringify({ email: "test@gmail.com", password: "password" })
        );
      });
    });
  });
});
