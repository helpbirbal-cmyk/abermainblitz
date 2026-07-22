#!/bin/bash

# ... (Branch and Remote definitions remain the same)

# Check for a commit message argument
if [ -z "$1" ]; then
  echo "❌ Error: Please provide a commit message as an argument."
  echo "Usage: ./quick_push_v2.sh \"Your commit message\""
  exit 1
fi

COMMIT_MSG="$1" # Use the first command-line argument as the message



# Define the branch and remote
BRANCH=$(git rev-parse --abbrev-ref HEAD)
REMOTE="origin"

# Define the commit message you provided
#COMMIT_MSG="vX mod aberdeen"

echo "=========================================="
echo "🎯 Starting Quick Push: $BRANCH -> $REMOTE/$BRANCH"
echo "------------------------------------------"

# 1. Stage ALL changes
echo "➕ Staging all changes (git add .)..."
git add .

# Check if there are changes to commit (prevents empty commit error)
if git diff --cached --quiet; then
  echo "⚠️ No changes to commit. Aborting push."
  exit 1
fi

# 2. Commit the staged changes
echo "✍️ Committing with message: \"$COMMIT_MSG\""
if git commit -m "$COMMIT_MSG"; then
  echo "✅ Commit successful."
else
  echo "❌ Commit failed. Check local state."
  exit 1
fi

# 3. Push to the remote branch
echo "⬆️ Pushing commit to $REMOTE/$BRANCH..."
# The -u (or --set-upstream) flag is generally only needed on the first push,
# but using it doesn't hurt. We use it to match your requested command.
if git push -u "$REMOTE" "$BRANCH"; then
  echo "🎉 Push successful! All changes synchronized."
else
  # This section handles the common "Updates were rejected" error
  echo "--- ❌ PUSH FAILED ---"
  echo "The remote has new changes. Your local history must be merged first."
  echo "Attempting to pull and fix the divergence..."

  # Attempt a pull to resolve the divergence
  if git pull --rebase "$REMOTE" "$BRANCH"; then
    echo "✅ Pull/Rebase successful. Retrying push..."
    if git push -u "$REMOTE" "$BRANCH"; then
      echo "🎉 Push successful after handling remote changes."
    else
      echo "❌ Final push failed. Please check the conflict resolution status."
      exit 1
    fi
  else
    # Pull failed due to unresolved conflicts
    echo "--- ⚠️ CRITICAL CONFLICT ---"
    echo "Pull/Rebase failed due to conflicts. Manual intervention is required."
    echo "1. Resolve conflicts in the affected files."
    echo "2. Run: 'git rebase --continue' (or 'git merge --continue' if rebase wasn't used)."
    echo "3. Then run the script again."
    echo "---------------------------"
    exit 1
  fi
fi

echo "=========================================="
