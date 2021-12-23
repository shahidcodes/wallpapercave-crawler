const jsdom = require("jsdom");
const fetch = require("node-fetch");
const { writeFile, mkdir } = require("fs/promises");
const { program } = require("commander");
const packageJson = require("./package.json");

program.version(packageJson.version);
program.option("-u, --url <url>", "URL for a wallpaper cave category");
program.parse(process.argv);

const options = program.opts();

const { JSDOM } = jsdom;

const url = options.url;

async function start() {
  await mkdir("wp", {
    recursive: true,
  });
  const htmlData = await fetch(url).then((r) => r.text());
  const {
    window: { document },
  } = new JSDOM(htmlData);

  const imgs = document.querySelectorAll(".wimg");
  const writePromises = [...imgs].map(async (img) => {
    const imageSource = img.getAttribute("src");
    console.log(imageSource);
    const arrayBuffer = await fetch(
      `https://wallpapercave.com${imageSource}`
    ).then((res) => res.arrayBuffer());
    return writeFile(`.${imageSource}`, Buffer.from(arrayBuffer));
  });
  await Promise.all(writePromises);
}

start();
