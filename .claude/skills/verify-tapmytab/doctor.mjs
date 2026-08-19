import { chromium } from '@playwright/test'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { distDir, repoRoot } from './ext.mjs'

const results = []
const check = (ok, label, detail) => results.push({ ok, label, detail })

const newestMtime = async (dir) => {
    let newest = 0
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name)
        newest = Math.max(newest, entry.isDirectory() ? await newestMtime(p) : statSync(p).mtimeMs)
    }
    return newest
}

const exe = chromium.executablePath()
check(existsSync(exe), 'chromium binary', exe)

const distManifest = join(distDir, 'manifest.json')
if (!existsSync(distManifest)) {
    check(false, 'dist/ built', 'missing dist/manifest.json, run: deno task build')
} else {
    const built = JSON.parse(readFileSync(distManifest, 'utf8'))
    const declared = JSON.parse(readFileSync(join(repoRoot, 'deno.json'), 'utf8')).version
    check(
        built.version === declared,
        'dist version matches deno.json',
        `dist=${built.version} deno.json=${declared}`,
    )

    const srcNewest = Math.max(
        await newestMtime(join(repoRoot, 'src')),
        statSync(join(repoRoot, 'manifest.json')).mtimeMs,
    )
    const distMtime = statSync(distManifest).mtimeMs
    check(
        distMtime >= srcNewest,
        'dist newer than src',
        distMtime >= srcNewest ? 'fresh' : 'STALE, run: deno task build',
    )
}

const dev = await fetch('http://localhost:5173/', { signal: AbortSignal.timeout(2000) })
    .then((r) => `up (${r.status})`)
    .catch(() => 'down (playwright will start it for web-lane drives)')
console.log(`INFO dev server 5173: ${dev}`)

for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.label}: ${r.detail}`)
if (results.some((r) => !r.ok)) process.exit(1)
