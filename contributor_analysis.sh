echo -e "Contributor\tAdded\tRemoved\tNetLOC\tNetLOC%"
git log --format='%aE' | sort -u | while read email; do
  # Get the first matching contributor name for the email
  name=$(git log --author="$email" --format='%aN' | head -n1)
  # Calculate stats for JS/TS and config-related files
  stats=$(git log --author="$email" --pretty=tformat: --numstat \
    | grep -E "\.(js|jsx|ts|tsx|json|rc|config)$" \
    | awk 'BEGIN { add=0; subs=0 }
           { add += $1; subs += $2 }
           END {
             net = add - subs;
             total = add + subs;
             perc = (total > 0) ? (net / total * 100) : 0;
             printf "%d\t%d\t%d\t%.2f%%", add, subs, net, perc
           }')
  echo -e "$name <$email>\t$stats"
done | sort -t$'\t' -k4 -nr | column -t -s $'\t'
echo "This is only for fun!"