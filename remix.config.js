/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    serverBuildTarget: "cloudflare-pages",
    server: "./functions/_worker.js",
    publicPath: "/build/",
    assetsBuildDirectory: "public/build",
  };