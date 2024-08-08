import { promises as fs } from "fs";

/**
 * Parses a 2D string into an array of arrays.
 * @param {string} str - The string to parse.
 * @param {string} rowDelimiter - The delimiter for rows.
 * @param {string} colDelimiter - The delimiter for columns.
 * @returns {Array<Array<string>>} The parsed 2D array.
 */
export const parse2DString = (str, rowDelimiter = "\n", colDelimiter = ",") => {
  return str.split(rowDelimiter).map((row) => row.split(colDelimiter));
};

/**
 * Reads the contents of a file asynchronously.
 *
 * @param {string} filePath - The path to the file to be read.
 * @return {Promise<string>} A promise that resolves with the contents of the file as a string.
 * @throws {Error} If there is an error reading the file.
 */
export const readFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.error("Error reading file:", err);
  }
};


