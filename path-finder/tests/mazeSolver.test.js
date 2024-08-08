import { MazeSolver } from "../src/MazeSolver.js";

test("should find the correct path in a basic example", () => {
  // GIVEN
  const maze = [
    "  @---A---+",
    "          |",
    "  x-B-+   C",
    "      |   |",
    "      +---+",
  ];

  // WHEN
  const solver = new MazeSolver(maze);
  const path = solver.findPath();
  const result = solver.formatPath(path);

  expect(result.letters).toBe("ACB");
  expect(result.pathAsChars).toBe("@---A---+|C|+---+|+-B-x");
});

test("should find the correct path while going straight to intersections", () => {
  // GIVEN
  const maze = [
    "  @",
    "  | +-C--+",
    "  A |    |",
    "  +---B--+",
    "    |      x",
    "    |      |",
    "    +---D--+",
  ];

  // WHEN
  const solver = new MazeSolver(maze);
  const path = solver.findPath();
  const result = solver.formatPath(path);

  // THEN
  expect(result.letters).toBe("ABCD");
  expect(result.pathAsChars).toBe("@|A+---B--+|+--C-+|-||+---D--+|x");
});

test("should find the correct path in maze with letters found on turns", () => {
  // GIVEN
  // prettier-ignore
  const maze = [
    "@---A---+",
    "        |",
    "x-B-+   |",
    "    |   |",
    "    +---C",
  ];

  // WHEN
  const solver = new MazeSolver(maze);
  const path = solver.findPath();
  const result = solver.formatPath(path);

  // THEN
  expect(result.letters).toBe("ACB");
  expect(result.pathAsChars).toBe("@---A---+|||C---+|+-B-x");
});

test("should find the correct path in maze (Do not collect a letter from the same location twice)", () => {
  const maze = [
    "     +-O-N-+",
    "     |     |",
    "     |   +-I-+",
    " @-G-O-+ | | |",
    "     | | +-+ E",
    "     +-+     S",
    "             |",
    "             x",
  ];

  const solver = new MazeSolver(maze);
  const path = solver.findPath();
  const result = solver.formatPath(path);

  expect(result.letters).toBe("GOONIES");
  expect(result.pathAsChars).toBe("@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x");
});

test("should find the correct path in maze (Keep direction, even in a compact space)", () => {
  // GIVEN
  // prettier-ignore
  const maze = [
    " +-L-+",
    " |  +A-+",
    "@B+ ++ H",
    " ++    x"
  ];

  // WHEN
  const solver = new MazeSolver(maze);
  const path = solver.findPath();
  const result = solver.formatPath(path);

  // THEN
  expect(result.letters).toBe("BLAH");
  expect(result.pathAsChars).toBe("@B+++B|+-L-+A+++A-+Hx");
});

test("should handle maze and igonore stuff after end of path", () => {
  // GIVEN
  // prettier-ignore
  const maze = [
    "  @-A--+",
    "       |",
    "       +-B--x-C--D"
  ];

  // WHEN
  const solver = new MazeSolver(maze);
  const path = solver.findPath();
  const result = solver.formatPath(path);

  // THEN
  expect(result.letters).toBe("AB");
  expect(result.pathAsChars).toBe("@-A--+|+-B--x");
});

test("should throw error when there is no start character", () => {
  // GIVEN
  const maze = [
    "     -A---+",
    "          |",
    "  x-B-+   C",
    "      |   |",
    "      +---+",
  ];

  // WHEN
  const solver = new MazeSolver(maze);
  const path = solver.findPath();

  // THEN
  expect(path).toBe(null);
});

test("should throw error when there is no end character", () => {
  // GIVEN
  const maze = [
    "   @--A---+",
    "          |",
    "    B-+   C",
    "      |   |",
    "      +---+",
  ];

  // WHEN
  const solver = new MazeSolver(maze);
  const path = solver.findPath();

  // THEN
  expect(path).toBe(null);
});

test("should throw error when there are multiple start characters", () => {
  // GIVEN
  const maze = [
    "   @--A-@-+",
    "          |",
    "  x-B-+   C",
    "      |   |",
    "      +---+",
  ];

  // THEN
  expect(() => {
    new MazeSolver(maze);
  }).toThrow("Multiple start characters found");
});

test("should throw error when there are multiple start characters", () => {
  // GIVEN
  const maze = [
    "   @--A---+",
    "          |",
    "          C",
    "          x",
    "      @-B-+",
  ];

  // THEN
  expect(() => {
    new MazeSolver(maze);
  }).toThrow("Multiple start characters found");
});

test("should throw error when there are multiple end characters", () => {
  // GIVEN
  // prettier-ignore
  const maze = [
    "   @--A--x",
    "",
    "  x-B-+",
    "      |",
    "      @",
  ];

  // THEN
  expect(() => {
    new MazeSolver(maze);
  }).toThrow("Multiple end characters found");
});

test("should throw error when there is fork in path", () => {
  // GIVEN
  const maze = [
    "        x-B",
    "          |",
    "   @--A---+",
    "          |",
    "          C",
    "      |   |",
    "      +---+",
  ];

  // THEN
  expect(() => {
    new MazeSolver(maze).findPath();
  }).toThrow("Invalid map");
});

test("should throw error when there is broken path", () => {
  // GIVEN
  // prettier-ignore
  const maze = [
    "   @--A-+",
    "        |",
    "",
    "        B-x",
  ];

  // THEN
  expect(() => {
    new MazeSolver(maze).findPath();
  }).toThrow("Invalid map");
});

test("should throw error when there are multiple end points", () => {
  // GIVEN
  const maze = ["x-B-@-A-x"];

  // THEN
  expect(() => {
    new MazeSolver(maze);
  }).toThrow("Multiple end characters found");
});

test("should throw error when there are multiple end points", () => {
  // GIVEN
  const maze = ["@-A-+-B-x"];

  // THEN
  expect(() => {
    new MazeSolver(maze).findPath();
  }).toThrow("Fake turn");
});
