#!/bin/sh
# rclone against the media bucket, using S3 credentials from .env (never printed).
#
#   scripts/media.sh lsd media:                                   list buckets
#   scripts/media.sh ls media:demo-videos                         list files
#   scripts/media.sh copy public/assets/demo/preview media:demo-videos/preview
#
# .env needs: SUPABASE_S3_ENDPOINT, SUPABASE_S3_REGION,
#             SUPABASE_S3_ACCESS_KEY_ID, SUPABASE_S3_SECRET_ACCESS_KEY
ENV_FILE="$(dirname "$0")/../.env"

get() { grep -E "^$1=" "$ENV_FILE" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'; }

for v in SUPABASE_S3_ENDPOINT SUPABASE_S3_REGION SUPABASE_S3_ACCESS_KEY_ID SUPABASE_S3_SECRET_ACCESS_KEY; do
  if [ -z "$(get $v)" ]; then echo "media.sh: $v is missing in .env" >&2; exit 1; fi
done

export RCLONE_CONFIG_MEDIA_TYPE=s3
export RCLONE_CONFIG_MEDIA_PROVIDER=Other
export RCLONE_CONFIG_MEDIA_FORCE_PATH_STYLE=true
export RCLONE_CONFIG_MEDIA_NO_CHECK_BUCKET=true
export RCLONE_CONFIG_MEDIA_ENDPOINT="$(get SUPABASE_S3_ENDPOINT)"
export RCLONE_CONFIG_MEDIA_REGION="$(get SUPABASE_S3_REGION)"
export RCLONE_CONFIG_MEDIA_ACCESS_KEY_ID="$(get SUPABASE_S3_ACCESS_KEY_ID)"
export RCLONE_CONFIG_MEDIA_SECRET_ACCESS_KEY="$(get SUPABASE_S3_SECRET_ACCESS_KEY)"

exec rclone "$@"
