import { assertEquals } from "../../deps.js";
import {
  getNumberOfWeek,
  getTimestamp,
  getWeekString,
  getMonthString
} from "../../utils/utils.js";

Deno.test("Test weekstring function", () => {
  assertEquals(getWeekString(40), "2020-W40");
});

Deno.test("Test monthstring function", () => {
  assertEquals(getMonthString(12), "2020-12");
});

Deno.test("Test weekstring function fails without input", () => {
  assertEquals(getWeekString(), "2020-Wundefined");
});

Deno.test("Test monthstring function fails without input", () => {
  assertEquals(getMonthString(), "2020-undefined");
});

Deno.test("Test timestamp function returns a string", () => {
  assertEquals(typeof getTimestamp(), "string");
});
