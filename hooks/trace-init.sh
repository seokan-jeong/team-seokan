#!/bin/bash
# Team-Shinchan Trace Init — Command Hook (UserPromptSubmit)
# Generates a unique trace ID per user prompt for event correlation.
# Replaces the prompt-based trace-init.md with deterministic execution.
set -eo pipefail

DOCS_DIR="${PWD}/.shinchan-docs"
mkdir -p "$DOCS_DIR"

# Generate trace ID: trace-{epoch_ms}-{4_hex}
RAND_HEX=$(openssl rand -hex 2 2>/dev/null || printf '%04x' $((RANDOM % 65536)))
TRACE_ID="trace-$(date +%s)$(printf '%03d' $((RANDOM % 1000)))-${RAND_HEX}"

echo "$TRACE_ID" > "${DOCS_DIR}/.trace-id"

exit 0
