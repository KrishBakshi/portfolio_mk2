#!/bin/sh
# rclone against the assets bucket, using S3 credentials from .env (never printed).
#
#   scripts/assets.sh lsd assets:                                   list buckets
#   scripts/assets.sh lsf assets:<bucket> --dirs-only               list folders
#   scripts/assets.sh copy public/assets/demo/preview assets:<bucket>/demo-preview
#
# .env needs: SUPABASE_S3_ACCESS_KEY_ID, SUPABASE_S3_SECRET_ACCESS_KEY
# Optional:   SUPABASE_S3_ENDPOINT (default: derived from NEXT_PUBLIC_SUPABASE_URL)
#             SUPABASE_S3_REGION   (default: us-east-1; set it if requests are rejected)
ENV_FILE="$(dirname "$0")/../.env"

get() { grep -E "^$1=" "$ENV_FILE" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'; }

for v in SUPABASE_S3_ACCESS_KEY_ID SUPABASE_S3_SECRET_ACCESS_KEY; do
  if [ -z "$(get $v)" ]; then echo "assets.sh: $v is missing in .env" >&2; exit 1; fi
done

ENDPOINT="$(get SUPABASE_S3_ENDPOINT)"
if [ -z "$ENDPOINT" ]; then
  PROJECT_URL="$(get NEXT_PUBLIC_SUPABASE_URL)"
  [ -n "$PROJECT_URL" ] || { echo "assets.sh: set SUPABASE_S3_ENDPOINT or NEXT_PUBLIC_SUPABASE_URL in .env" >&2; exit 1; }
  ENDPOINT="$(echo "$PROJECT_URL" | sed -e 's#\.supabase\.co.*#.storage.supabase.co/storage/v1/s3#')"
fi
REGION="$(get SUPABASE_S3_REGION)"; REGION="${REGION:-us-east-1}"

export RCLONE_CONFIG_ASSETS_TYPE=s3
export RCLONE_CONFIG_ASSETS_PROVIDER=Other
export RCLONE_CONFIG_ASSETS_FORCE_PATH_STYLE=true
export RCLONE_CONFIG_ASSETS_NO_CHECK_BUCKET=true
export RCLONE_CONFIG_ASSETS_ENDPOINT="$ENDPOINT"
export RCLONE_CONFIG_ASSETS_REGION="$REGION"
export RCLONE_CONFIG_ASSETS_ACCESS_KEY_ID="$(get SUPABASE_S3_ACCESS_KEY_ID)"
export RCLONE_CONFIG_ASSETS_SECRET_ACCESS_KEY="$(get SUPABASE_S3_SECRET_ACCESS_KEY)"

exec rclone "$@"
