// Bumps the version in deno.json + both extension manifests, then commits and tags.
// Usage: deno task bump [major|minor|patch]   (default: patch)
const FILES = ['deno.json', 'manifest.json', 'manifest.firefox.json']
const kind = Deno.args[0] ?? 'patch'

const git = (...args: string[]) => {
    const { success, stdout } = new Deno.Command('git', { args, stderr: 'inherit' }).outputSync()
    if (!success) Deno.exit(1)
    return new TextDecoder().decode(stdout).trim()
}

if (git('rev-parse', '--abbrev-ref', 'HEAD') !== 'master') {
    console.error('bump only from master')
    Deno.exit(1)
}

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
git('commit', '-m', `bump to ${next}`, ...FILES)
git('tag', `v${next}`)
console.log(`${major}.${minor}.${patch} → ${next}  (committed + tagged, now: git push && git push --tags)`)
