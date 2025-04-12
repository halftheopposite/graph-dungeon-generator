import { generate } from "./generate/index";
import { getDungeonById } from "./utils";

function start(args: string[]): void {
  const dungeonId = args[0];
  if (!dungeonId) {
    throw new Error(`You must provide a dungeon id.`);
  }

  const dungeon = getDungeonById(dungeonId);
  if (!dungeon) {
    throw new Error(`Could not find dungeon "${dungeonId}".`);
  }

  console.log(`Generating dungeon "${dungeonId}"...`);
  generate(dungeon);
  console.log(`Done ✅`);
}

start(process.argv.slice(2));
