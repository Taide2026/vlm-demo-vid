import { readdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const supportedExtensions = new Set([".mp4", ".webm", ".ogv", ".mov", ".m4v"]);

async function findVideos(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findVideos(path);
    return entry.isFile() && supportedExtensions.has(extname(entry.name).toLowerCase())
      ? [path.replaceAll("\\", "/")]
      : [];
  }));
  return paths.flat();
}

const videos = (await findVideos("videos")).sort((a, b) => a.localeCompare(b));

await writeFile("videos.json", `${JSON.stringify(videos, null, 2)}\n`);
