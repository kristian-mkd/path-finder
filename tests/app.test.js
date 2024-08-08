import { parse2DString } from "../src/util";

describe("parse2DString", () => {
  test("should correctly parse a 2D string with default delimiters", () => {
    const data = `1,2,3\n4,5,6\n7,8,9`;
    const expected = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
    ];
    expect(parse2DString(data)).toEqual(expected);
  });

  test("should correctly parse a 2D string with custom row and column delimiters", () => {
    const data = `1|2|3|4|5\n6|7|8|9|10`;
    const expected = [
      ["1", "2", "3", "4", "5"],
      ["6", "7", "8", "9", "10"],
    ];
    expect(parse2DString(data, "\n", "|")).toEqual(expected);
  });

  test("should return an empty array for an empty input string", () => {
    const data = ``;
    const expected = [[""]];
    expect(parse2DString(data)).toEqual(expected);
  });

  test("should correctly parse a string with trailing delimiters", () => {
    const data = `1,2,3,\n4,5,6,`;
    const expected = [
      ["1", "2", "3", ""],
      ["4", "5", "6", ""],
    ];
    expect(parse2DString(data)).toEqual(expected);
  });
});
