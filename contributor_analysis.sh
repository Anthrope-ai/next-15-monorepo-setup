#!/usr/bin/env bash
# Show per‑contributor LOC statistics + share of the total.

echo -e "Contributor\tAdded\tRemoved\tNetLOC\tNetLOC%\tTotal%"

pattern='\.(js|jsx|ts|tsx|json|rc|config)$'

# ─── 1) Grand totals ────────────────────────────────────────────────────
read -r TOTAL_ADD TOTAL_SUB <<<"$(
  git log --pretty=tformat: --numstat |
  grep -E "$pattern" |
  awk '{ a+=$1; s+=$2 } END { print a, s }'
)"
TOTAL_TOUCH=$(( TOTAL_ADD + TOTAL_SUB ))

# ─── 2) Per‑contributor stats ───────────────────────────────────────────
git log --format='%aE' | sort -u | while read -r email; do
  name=$(git log --author="$email" --format='%aN' | head -n1)

  read -r add subs <<<"$(
    git log --author="$email" --pretty=tformat: --numstat |
    grep -E "$pattern" |
    awk '{ a+=$1; s+=$2 } END { print a, s }'
  )"

  total=$(( add + subs ))
  net=$(( add - subs ))

  net_pct=$(awk -v n="$net" -v t="$total"        'BEGIN { printf "%.2f%%", (t ? n/t*100 : 0) }')
  tot_pct=$(awk -v t="$total" -v g="$TOTAL_TOUCH" 'BEGIN { printf "%.2f%%", (g ? t/g*100 : 0) }')

  printf "%s <%s>\t%d\t%d\t%d\t%s\t%s\n" \
         "$name" "$email" "$add" "$subs" "$net" "$net_pct" "$tot_pct"
done |

# ─── 3) Sort & append grand total ───────────────────────────────────────
sort -t$'\t' -k4 -nr |
awk -v A="$TOTAL_ADD" -v S="$TOTAL_SUB" '
  BEGIN { OFS="\t" }
  { print }                       # already‑sorted contributor lines
  END {
    NET = A - S
    print "TOTAL", A, S, NET, "-", "100.00%"
  }' |
column -t -s $'\t'