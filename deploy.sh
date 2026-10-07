#!/usr/bin/env bash
# Builds the landing and puts it on the family's host under /srv/vibememory/site — see site-deploy of the family kit.
#
# Runs on the OWNER'S machine: ./deploy.sh [--alias vibememory]
set -euo pipefail
cd "$(dirname "$0")"
exec ./node_modules/.bin/site-deploy --site /srv/vibememory/site "$@"
