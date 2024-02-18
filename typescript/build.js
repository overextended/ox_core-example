import esbuild from "esbuild";
import { writeFileSync } from "fs";

/** @type {import('esbuild').BuildOptions} */
const server = {
  platform: "node",
  target: ["node16"],
  format: "cjs",
};

/** @type {import('esbuild').BuildOptions} */
const client = {
  platform: "browser",
  target: ["es2021"],
  format: "iife",
};

const production = process.argv.includes("--mode=production");
const buildCmd = production ? esbuild.build : esbuild.context;

writeFileSync(
  ".yarn.installed",
  new Date().toLocaleString("en-AU", {
    timeZone: "UTC",
    timeStyle: "long",
    dateStyle: "full",
  })
);

for (const context of ["client", "server"]) {
  buildCmd({
    bundle: true,
    entryPoints: [`${context}/index.ts`],
    outfile: `dist/${context}.js`,
    keepNames: true,
    dropLabels: production ? ["DEV"] : undefined,
    legalComments: "inline",
    plugins: production
      ? undefined
      : [
          {
            name: "rebuild",
            setup(build) {
              const cb = (result) => {
                if (!result || result.errors.length === 0)
                  console.log(`Successfully built ${context}`);
              };
              build.onEnd(cb);
            },
          },
        ],
    ...(context === "client" ? client : server),
  })
    .then((build) => {
      if (production) return console.log(`Successfully built ${context}`);

      build.watch();
    })
    .catch(() => process.exit(1));
}
