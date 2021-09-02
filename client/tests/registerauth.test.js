/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(__dirname, "../registration.html"),
  "utf8"
);

global.fetch = require("jest-fetch-mock");
let app;

describe("app", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    app = require("../static/js/registerauth");
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  describe("requests", () => {
    describe("requestRegistration", () => {
      test("it makes a post request to /auth/register with the user data", () => {
        const fakeSubmitEvent = {
          preventDefault: jest.fn(),
          target: {
            username: { value: "test" },
            email: { value: "test@gmail.com" },
            password: { value: "password" }
          }
        };

        app.requestRegistration(fakeSubmitEvent);
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "POST");
        expect(fetch.mock.calls[0][1]).toHaveProperty(
          "body",
          JSON.stringify({
            username: "test",
            email: "test@gmail.com",
            password: "password"
          })
        );
      });
    });
  });
});
