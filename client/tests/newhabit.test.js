/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(__dirname, "../newhabit.html"),
  "utf8"
);

global.fetch = require("jest-fetch-mock");
let app;

describe("app", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    app = require("../static/js/newhabit.js");
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  describe("requests", () => {
    describe("postNewHabit", () => {
      test("it makes a post request to /habits with the habit data", () => {
        const userId = localStorage.getItem("id");
        const fakeSubmitEvent = {
          preventDefault: jest.fn(),
          target: {
            habit: { value: "Sleep" },
            frequency: { value: "Daily" },
            has_priority: { value: false },
            user_id: { value: userId }
          }
        };
        app.postNewHabit(fakeSubmitEvent);
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "POST");
        expect(fetch.mock.calls[0][1]).toHaveProperty("body");
        expect(fetch.mock.calls[0][1]).toHaveProperty("headers");
      });
    });
  });
});
