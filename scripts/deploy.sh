#!/bin/sh
# deploy landing + demo on the VPS. run from anywhere on the server: sh ~/personal/tapmytab/scripts/deploy.sh
set -e
cd "$(dirname "$0")/.."

git pull
deno install --allow-scripts
deno task build

rsync -a --delete landing/ /srv/http/tapmytab/
rsync -a --delete dist/ /srv/http/tapmytab-demo/

echo "deployed:"
echo "  landing -> https://tapmytab.krehwell.cloud"
echo "  demo    -> https://tapmytab-demo.krehwell.cloud"
