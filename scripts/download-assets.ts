import { RsnsUnpacker, getJimpPNG } from "rsns-unpack-k";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { RESONANCE_SKILLS } from "resonance-data-columba-k/dist/columbabuild";

const ROLES_HEAD_DIR = "public/roles/head";
const ROLES_HEAD_IMPORT_FILE = "utils/role-image-utils.ts";

/**
 * Find roles in `RESONANCE_SKILLS` whose images don't exist in `public/roles/head`
 */
const getMissingHeads = async () => {
  const existHeads = new Set((await readdir(ROLES_HEAD_DIR)).map((name: string) => name.replace(/\.png$/, "")));
  const missingHeads = Object.keys(RESONANCE_SKILLS).filter((name) => !existHeads.has(name));
  return missingHeads;
};

const downloadHeads = async (unpacker: RsnsUnpacker, names: string[]) => {
  const unitFactory = await unpacker.getBinaryConfig("UnitFactory");
  const transUnitFactory: { [key: string]: string } = (await unpacker.getTranslate("ConfigLanguage"))["UnitFactory"]["name"];

  for (const korName of names) {
    console.info(`Downloading ${korName}...`);
    try {
      const name = Object.keys(transUnitFactory).find(key => transUnitFactory[key] === korName);
      if (!name) throw new Error(`Can't find name for ${korName}`);
      // It should be restricted to `mod === "玩家角色"` as there are also enemy roles
      const id = unitFactory.find((unit: { name: string; mod: string; id: number }) => 
        unit.name === name && unit.mod === "玩家角色"
      )?.id;
      if (!id) throw new Error(`Can't find unit ${name}`);

      const image = await unpacker.getCharacterImage(id);
      const png = await getJimpPNG(image);

      await writeFile(`${ROLES_HEAD_DIR}/${korName}.png`, png);

      await updateRoleImageUtilsFile(korName);
    } catch (e) {
      console.error(e);
    }
  }
};

const updateRoleImageUtilsFile = async (role: string) => {
  // read file
  const file = await readFile(ROLES_HEAD_IMPORT_FILE, "utf-8");
  const lines = file.split("\n");

  // find line with "import end"
  const importIndex = lines.findIndex((line: string) => line.includes("import end"));
  if (importIndex === -1) throw new Error("Can't find import end");

  // insert new import line before "import end"
  lines.splice(importIndex, 0, `import ${role.replace(" ", "_").replace("-", "_")} from "/public/roles/head/${role}.png";`);

  // find line with "export role images end"
  const exportIndex = lines.findIndex((line: string) => line.includes("export role images end"));

  // insert new role image line before "export role images end"
  lines.splice(exportIndex, 0, `  ${role.replace(" ", "_").replace("-", "_")},`);

  // write back to file
  await writeFile(ROLES_HEAD_IMPORT_FILE, lines.join("\n"));

  console.info(`Updated ${ROLES_HEAD_IMPORT_FILE}`);
};

const main = async () => {
  const unpacker = new RsnsUnpacker();
  console.log("Latest version:", await unpacker.getLatestVersion());

  const missingHeads = await getMissingHeads();

  // Download roles's heads
  if (missingHeads.length) {
    await downloadHeads(unpacker, missingHeads);
  }
};

main()
  .then(() => console.log("done"))
  .catch(console.error);