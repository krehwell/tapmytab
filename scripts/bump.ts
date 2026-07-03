// Bumps the version in deno.json + both extension manifests, in lockstep.
// Usage: deno task bump [major|minor|patch]   (default: patch)
const FILES = ['deno.json', 'manifest.json', 'manifest.firefox.json']
const kind = Deno.args[0] ?? 'patch'

const [major, minor, patch] = JSON.parse(await Deno.readTextFile('deno.json')).version
    .split('.').map(Number)
const next =
    { major: `${major + 1}.0.0`, minor: `${major}.${minor + 1}.0`, patch: `${major}.${minor}.${patch + 1}` }[kind]
if (!next) throw new Error(`unknown bump kind: ${kind} (use major|minor|patch)`)

for (const file of FILES) {
    const text = await Deno.readTextFile(file)
    // every file states the same current version on its "version" line; swap the first occurrence
    await Deno.writeTextFile(file, text.replace(/"version":\s*"[^"]+"/, `"version": "${next}"`))
}
console.log(`${major}.${minor}.${patch} → ${next}`)
