#!/bin/bash
#
# Team-Shinchan Test Runner
# Run before deploying to validate plugin integrity
#
# Usage:
#   ./run-tests.sh           # Run all tests
#   ./run-tests.sh static    # Run static validation only (no API calls)
#   ./run-tests.sh agents    # Run agent behavior tests (requires API key)
#   ./run-tests.sh e2e       # Run E2E workflow tests (requires API key)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "╔════════════════════════════════════════╗"
echo "║  Team-Shinchan Test Runner             ║"
echo "╚════════════════════════════════════════╝"
echo ""

run_static() {
    echo -e "${YELLOW}Running static validation...${NC}"
    echo ""
    node tests/validate/index.js
    return $?
}

run_agents() {
    echo -e "${YELLOW}Running agent behavior tests...${NC}"
    echo ""

    if ! command -v promptfoo &> /dev/null; then
        echo -e "${RED}Error: promptfoo is not installed${NC}"
        echo "Install with: npm install -g promptfoo"
        return 1
    fi

    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo -e "${YELLOW}Warning: ANTHROPIC_API_KEY not set${NC}"
        echo "Set with: export ANTHROPIC_API_KEY=your-key"
        return 1
    fi

    cd promptfoo
    promptfoo eval
    cd ..
    return $?
}

run_e2e() {
    echo -e "${YELLOW}Running E2E workflow tests...${NC}"
    echo ""

    if ! command -v promptfoo &> /dev/null; then
        echo -e "${RED}Error: promptfoo is not installed${NC}"
        echo "Install with: npm install -g promptfoo"
        return 1
    fi

    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo -e "${YELLOW}Warning: ANTHROPIC_API_KEY not set${NC}"
        echo "Set with: export ANTHROPIC_API_KEY=your-key"
        return 1
    fi

    promptfoo eval -c tests/e2e/e2e-promptfoo.yaml
    return $?
}

case "${1:-all}" in
    static)
        run_static
        ;;
    agents)
        run_agents
        ;;
    e2e)
        run_e2e
        ;;
    all)
        run_static
        STATIC_RESULT=$?

        if [ $STATIC_RESULT -eq 0 ]; then
            echo ""
            echo -e "${GREEN}Static validation passed!${NC}"
            echo ""

            # Only run agent tests if API key is set
            if [ -n "$ANTHROPIC_API_KEY" ]; then
                run_agents
                echo ""
                run_e2e
            else
                echo -e "${YELLOW}Skipping agent + E2E tests (ANTHROPIC_API_KEY not set)${NC}"
                echo "To run: export ANTHROPIC_API_KEY=your-key && ./run-tests.sh all"
            fi
        else
            echo ""
            echo -e "${RED}Static validation failed! Fix errors before running agent tests.${NC}"
            exit 1
        fi
        ;;
    *)
        echo "Usage: $0 {static|agents|e2e|all}"
        echo ""
        echo "  static  - Run static validation only (no API calls, free)"
        echo "  agents  - Run agent behavior tests (requires ANTHROPIC_API_KEY)"
        echo "  e2e     - Run E2E workflow tests (requires ANTHROPIC_API_KEY)"
        echo "  all     - Run all tests"
        exit 1
        ;;
esac

echo ""
echo "Done!"
