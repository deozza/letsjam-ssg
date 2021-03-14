const functions = require("firebase-functions");
const {Nuxt} = require("nuxt-start");

const config = {
  dev: false,
  debug: false,
  buildDir: ".nuxt",
};

const nuxt = new Nuxt(config);

let isReady = false;

// eslint-disable-next-line require-jsdoc
async function handleRequest(req: any, res: any) {
  if (!isReady) {
    try {
      isReady = await nuxt.ready();
    } catch (error) {
      process.exit(1);
    }
  }
  await nuxt.render(req, res);
}
exports.index = functions
    .region("us-central1")
    .https.onRequest(handleRequest);
