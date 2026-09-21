#!/bin/sh
# rclone against the Cloudflare R2 assets bucket, using credentials from .env (never printed).
#
#   scripts/assets.sh lsd assets:                                  list buckets
#   scripts/assets.sh lsf assets:<bucket> --dirs-only              list folders
#   scripts/assets.sh copy assets-source assets:<bucket>          upload everything (mirrors the bucket layout)
#
# .env needs: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
ENV_FILE="$(dirname "$0")/../.env"

get() { grep -E "^$1=" "$ENV_FILE" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'; }

for v in R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY; do
  if [ -z "$(get $v)" ]; then echo "assets.sh: $v is missing in .env" >&2; exit 1; fi
done

export RCLONE_CONFIG_ASSETS_TYPE=s3
export RCLONE_CONFIG_ASSETS_PROVIDER=Cloudflare
export RCLONE_CONFIG_ASSETS_NO_CHECK_BUCKET=true
export RCLONE_CONFIG_ASSETS_ENDPOINT="https://$(get R2_ACCOUNT_ID).r2.cloudflarestorage.com"
export RCLONE_CONFIG_ASSETS_ACCESS_KEY_ID="$(get R2_ACCESS_KEY_ID)"
export RCLONE_CONFIG_ASSETS_SECRET_ACCESS_KEY="$(get R2_SECRET_ACCESS_KEY)"

exec rclone "$@"
