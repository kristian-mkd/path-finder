import { MazeSolver } from "./MazeSolver.js";
import { parse2DString, readFile } from "./util/index.js";

for (let index = 1; index < 5; index++) {
  const filePath = "./data/" + index + ".txt";

  const fileResult = await readFile(filePath);

  console.log("#########################################");
  console.log("File: ");
  console.log(fileResult + "\n");

  const maze = parse2DString(fileResult);
  const solver = new MazeSolver(maze.flat());
  const path = solver.findPath();

  if (path) {
    const pathInfo = solver.formatPath(path);
    console.log("🚀 ~ letters:", pathInfo.letters);
    console.log("🚀 ~ path:", pathInfo.pathAsChars + "\n");
    console.log("#########################################");
  } else {
    console.log("No path found.");
  }
}
