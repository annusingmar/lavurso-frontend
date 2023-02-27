#!/bin/sh
set -e

cd /app
if [ ! -d "/app/dist/spa" ]; then
    quasar build
fi
cd /app/dist/spa

exec "$@"