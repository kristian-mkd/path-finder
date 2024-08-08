// Constants
const START = "@";
const END = "x";
const HORIZONTAL = "-";
const VERTICAL = "|";
const INTERSECTION = "+";
const EMPTY_POSITION = " ";
const INTERSECTION_NEIGHBOR_POINTS = 4;

export class MazeSolver {
  constructor(maze) {
    this.maze = maze;
    this.start = null;
    this.end = null;
    this.rows = maze.length;
    this.cols = maze.reduce(
      (maxLength, row) => Math.max(maxLength, row.length),
      0
    );
    this.path = [];

    this.directions = [
      { x: 0, y: 1 }, // right
      { x: -1, y: 0 }, // up
      { x: 1, y: 0 }, // down
      { x: 0, y: -1 }, // left
    ];

    this.findStartAndEnd();
  }

  findStartAndEnd() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.maze[i][j] == null) {
          continue;
        }
        if (this.maze[i][j] === START) {
          if (this.start) {
            throw new Error("Multiple start characters found");
          }
          this.start = { x: i, y: j, val: START };
        } else if (this.maze[i][j] === END) {
          if (this.end) {
            throw new Error("Multiple end characters found");
          }
          this.end = { x: i, y: j, val: END };
        }
      }
    }
  }

  /**
   * Checks if a given path point is valid.
   *
   * @param {string} pathPoint - The path point to be checked.
   * @return {boolean} Returns true if the path point is valid, false otherwise.
   */
  isValidPathPoint(point) {
    return (
      point === HORIZONTAL ||
      point === VERTICAL ||
      point === INTERSECTION ||
      point === START ||
      point === END ||
      point?.match(/[A-Z]/i)
    );
  }

  /**
   * Checks if a given point in the maze is valid.
   *
   * @param {number} x - The x-coordinate of the point.
   * @param {number} y - The y-coordinate of the point.
   * @return {boolean} Returns true if the point is valid, false otherwise.
   */
  isValidMapPoint(x, y) {
    return (
      x >= 0 &&
      x < this.rows &&
      y >= 0 &&
      y < this.cols &&
      this.maze[x][y] !== EMPTY_POSITION &&
      this.maze[x][y] != null
    );
  }

  isVisited(current, previous, visitedArr) {
    if (current.x === previous?.x && current.y === previous?.y) {
      return true;
    }

    if (this.isIntersection(current)) {
      return false;
    }

    return visitedArr[current.x][current.y];
  }

  findPath() {
    if (!this.start || !this.end) {
      return null;
    }

    const queue = [];
    let previous = null;
    const visitedArr = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(false)
    );

    queue.push(this.start);
    visitedArr[this.start.x][this.start.y] = true;

    while (queue.length > 0) {
      const current = queue.shift();
      this.path.push(current);

      const hasReachedEnd =
        current.x === this.end.x && current.y === this.end.y;

      if (hasReachedEnd) {
        return this.path;
      }

      let neighbors = this.getNeighbors(current);
      neighbors = neighbors.filter(
        (n) => !this.isVisited(n, previous, visitedArr)
      );

      if (neighbors.length > 1) {
        neighbors = neighbors.filter((neighbor) =>
          this.isStraightPath(previous, current, neighbor)
        );
      }

      if (neighbors.length !== 1) {
        throw new Error("Invalid map");
      }

      const next = neighbors[0];
      this.checkFakeTurn(current, previous, next);

      queue.push(next);
      visitedArr[next.x][next.y] = true;
      previous = current;
    }

    // No path found
    return null;
  }

  checkFakeTurn(current, previous, next) {
    if (current.val === INTERSECTION) {
      if (previous.val === HORIZONTAL && next.val === HORIZONTAL) {
        throw new Error("Fake turn");
      }
      if (previous.val === VERTICAL && next.val === VERTICAL) {
        throw new Error("Fake turn");
      }
    }
  }

  /**
   * Determines if there is a straight path between three nodes.
   *
   * @param {Object} previous - The previous node.
   * @param {Object} current - The current node.
   * @param {Object} next - The next node.
   * @return {boolean} Returns true if there is a straight path between the nodes, otherwise false.
   */
  isStraightPath(previous, current, next) {
    if (!previous) {
      return false;
    }

    const isHorizontalStraightPath = (previous, current, neighbor) =>
      previous.y === current.y &&
      previous.y === neighbor.y &&
      ((previous.x + 1 === current.x && previous.x + 2 === neighbor.x) ||
        (previous.x - 1 === current.x && previous.x - 2 === neighbor.x));

    const isVerticalStraightPath = (previous, current, neighbor) =>
      previous.x === current.x &&
      previous.x === neighbor.x &&
      ((previous.y + 1 === current.y && previous.y + 2 === neighbor.y) ||
        (previous.y - 1 === current.y && previous.y - 2 === neighbor.y));

    return (
      isHorizontalStraightPath(previous, current, next) ||
      isVerticalStraightPath(previous, current, next)
    );
  }

  /**
   * Determines if the current cell is an intersection by checking its validity and the number of valid neighbors.
   *
   * @param {Object} current - The current cell to check for being an intersection.
   * @return {boolean} Returns true if the current cell is an intersection, otherwise false.
   */
  isIntersection(current) {
    if (!this.isValidPathPoint(current.val)) {
      return false;
    }

    const neighbors = this.getNeighbors(current);
    const validNeighborsCount =
      neighbors.length === INTERSECTION_NEIGHBOR_POINTS;

    if (!validNeighborsCount) {
      return false;
    }

    const allNeighborsValid = neighbors.every((n) =>
      this.isValidPathPoint(n.val)
    );
    return allNeighborsValid;
  }

  /**
   * Retrieves a list of neighboring cells in the maze.
   *
   * @param {Object} cell - The cell for which to retrieve neighbors.
   * @return {Array<Object>} A list of neighboring cells.
   */
  getNeighbors(cell) {
    const neighbors = [];
    for (const direction of this.directions) {
      const nextX = cell.x + direction.x;
      const nextY = cell.y + direction.y;

      if (this.isValidMapPoint(nextX, nextY)) {
        neighbors.push({ x: nextX, y: nextY, val: this.maze[nextX][nextY] });
      }
    }
    return neighbors;
  }

  formatPath(path) {
    const pathAsChars = path.map((p) => p.val).join("");

    // keep the letters only
    const filteredPath = path.filter((i) => !"x@-+|".includes(i.val));

    // do not count letters at crossroads multiple times
    const uniquePath = filteredPath
      .reduce((acc, current) => {
        const key = JSON.stringify([current.x, current.y]);
        if (!acc.has(key)) {
          acc.set(key, current);
        }
        return acc;
      }, new Map())
      .values();

    const letters = Array.from(uniquePath)
      .map((p) => p.val)
      .join("");

    return {
      letters,
      pathAsChars,
    };
  }
}
