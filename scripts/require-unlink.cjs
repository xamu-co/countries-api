const process = require("process");
const fs = require("fs");

const main = () => {
	const packageJson = JSON.parse(fs.readFileSync("./package.json").toString());

	if (Object.values(packageJson.resolutions ?? {}).find((entry) => entry.includes("portal:/"))) {
		console.debug("package.json contains portals. Run `yarn unlink` before committing.");
		process.exit(1);
	}

	process.exit(0);
};

main();
