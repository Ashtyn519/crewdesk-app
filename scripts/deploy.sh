#!/usr/bin/env bash
set -euo pipefail

# =============================================================
# CrewDesk Production Deploy Script
#
# Prerequisites — set these env vars before running:
#   VERCEL_TOKEN          — from vercel.com/account/tokens
#   SUPABASE_DB_PASSWORD  — from Supabase dashboard → Settings → Database
#
# Usage:
#   export VERCEL_TOKEN="vcp_..."
#   export SUPABASE_DB_PASSWORD="your-db-password"
#   bash scripts/deploy.sh
# =============================================================

: "${VERCEL_TOKEN:?Set VERCEL_TOKEN before running this script}"
: "${SUPABASE_DB_PASSWORD:?Set SUPABASE_DB_PASSWORD before running this script}"

SUPABASE_PROJECT_REF="fqvkuzvnqpdzqpeepxoo"

# --- 1. Vercel: Find or create the project ---
echo "==> Finding Vercel project..."
PROJECT_JSON=$(curl -sS -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects")

PROJECT_ID=$(echo "$PROJECT_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for p in data.get('projects', []):
    if 'crewdesk' in p.get('name','').lower():
        print(p['id']); break
" 2>/dev/null || true)

if [ -z "$PROJECT_ID" ]; then
  echo "==> No crewdesk project found. Creating one linked to GitHub..."
  CREATE_RESP=$(curl -sS -X POST -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "crewdesk-app",
      "framework": "nextjs",
      "gitRepository": {
        "type": "github",
        "repo": "Ashtyn519/crewdesk-app"
      }
    }' "https://api.vercel.com/v10/projects")
  PROJECT_ID=$(echo "$CREATE_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
  echo "    Created project: $PROJECT_ID"
else
  echo "    Found project: $PROJECT_ID"
fi

# --- 2. Set environment variables ---
echo "==> Setting Vercel environment variables..."
echo "    Use 'vercel env add <KEY> production' to set each variable."
echo "    See .env.local.example for the full list of required variables."

# --- 3. Run Supabase migration ---
echo "==> Running Supabase migration..."
PGPASSWORD="$SUPABASE_DB_PASSWORD" psql \
  "postgresql://postgres.${SUPABASE_PROJECT_REF}:${SUPABASE_DB_PASSWORD}@aws-0-eu-west-2.pooler.supabase.com:6543/postgres" \
  -f "$(dirname "$0")/../supabase/schema.sql"
echo "    Migration complete."

# --- 4. Add custom domain ---
echo "==> Adding domain app.crewdeskapp.com..."
DOMAIN_RESP=$(curl -sS -X POST -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"app.crewdeskapp.com"}' \
  "https://api.vercel.com/v10/projects/$PROJECT_ID/domains")
echo "    Domain response: $DOMAIN_RESP"
echo ""
echo "    >>> Add this DNS record at your domain registrar:"
echo "    Type: CNAME  |  Name: app  |  Value: cname.vercel-dns.com"
echo ""

# --- 5. Trigger production deployment ---
echo "==> Triggering production deployment..."
DEPLOY_RESP=$(curl -sS -X POST -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"crewdesk-app\",\"project\":\"$PROJECT_ID\",\"gitSource\":{\"type\":\"github\",\"org\":\"Ashtyn519\",\"repo\":\"crewdesk-app\",\"ref\":\"main\"}}" \
  "https://api.vercel.com/v13/deployments")
DEPLOY_URL=$(echo "$DEPLOY_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('url','unknown'))" 2>/dev/null || echo "check Vercel dashboard")
echo "    Deployment triggered: https://$DEPLOY_URL"
echo ""
echo "==> Done! Check your Vercel dashboard for deployment status."
