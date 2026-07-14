#!/bin/sh
# one-time VPS setup for the landing page + demo. run as: sudo sh scripts/vps-bootstrap.sh
set -e

pacman -S --needed --noconfirm caddy rsync

mkdir -p /srv/http/tapmytab /srv/http/tapmytab-demo
chown -R kel: /srv/http/tapmytab /srv/http/tapmytab-demo

tee /etc/caddy/Caddyfile > /dev/null <<'EOF'
tapmytab.krehwell.cloud {
    root * /srv/http/tapmytab
    file_server
}

tapmytab-demo.krehwell.cloud {
    root * /srv/http/tapmytab-demo
    file_server
}
EOF

systemctl enable --now caddy
systemctl reload caddy
echo "bootstrap done. caddy will fetch HTTPS certs automatically once DNS resolves."
