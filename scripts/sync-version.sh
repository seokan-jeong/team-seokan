#!/bin/bash
# Sync version from package.json to plugin files

VERSION=$(node -p "require('./package.json').version")

# Update plugin.json
sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" .claude-plugin/plugin.json

# Update marketplace.json
sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" .claude-plugin/marketplace.json

echo "Synced version to $VERSION"
