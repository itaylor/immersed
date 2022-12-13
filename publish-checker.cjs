#!/usr/bin/env node

// Exits 0 if the version in package.json is already published.
// Exits 1 if it is not published.
// Use in a script like this:
// "pub": "node publish-checker.cjs || npm publish"
let args = process.argv.slice(2);
if (!args.length) {
    args = [`${process.cwd()}/package.json`];
}
const packageJson = require(args[0]);
const { name, version } = packageJson;
console.log(`Found ${name}@${version} in ${args[0]}`);
const { execSync } = require('child_process');
const npmInfo = JSON.parse(execSync(`npm info --json ${name}`));
if (npmInfo.versions.includes((v) => version)) {
    console.log(`Version ${version} already exists for ${name}, exiting 0`);
    process.exit(0);
} 
console.log(`No published version ${version} for ${name}, exiting 1`);
process.exit(1);