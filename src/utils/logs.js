import fs from "fs";
import path from "path";

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logFile = (filename, data) => {

    const dir = path.join(__dirname,`../logs/${filename}.json`);
    const writeData = JSON.stringify(data, null, 4);
    fs.writeFileSync(dir, writeData);
}