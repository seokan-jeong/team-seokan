#!/bin/bash

# Team-Seokan 플러그인 설치 스크립트
# 사용법: curl -fsSL https://raw.githubusercontent.com/seokan-jeong/team-seokan/main/install.sh | bash

set -e

PLUGIN_NAME="team-seokan"
PLUGIN_DIR="$HOME/.claude/plugins/$PLUGIN_NAME"
REPO_URL="https://github.com/seokan-jeong/team-seokan.git"

echo "🎬 Team-Seokan 플러그인 설치를 시작합니다..."
echo ""

# 필수 도구 확인
check_requirements() {
    if ! command -v git &> /dev/null; then
        echo "❌ git이 설치되어 있지 않습니다."
        exit 1
    fi

    if ! command -v node &> /dev/null; then
        echo "❌ Node.js가 설치되어 있지 않습니다."
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        echo "❌ npm이 설치되어 있지 않습니다."
        exit 1
    fi

    echo "✓ 필수 도구 확인 완료"
}

# 플러그인 디렉토리 생성
setup_directory() {
    mkdir -p "$HOME/.claude/plugins"

    if [ -d "$PLUGIN_DIR" ]; then
        echo "⚠️  기존 설치가 발견되었습니다. 업데이트합니다..."
        cd "$PLUGIN_DIR"
        git pull origin main
    else
        echo "📥 플러그인을 다운로드합니다..."
        git clone "$REPO_URL" "$PLUGIN_DIR"
        cd "$PLUGIN_DIR"
    fi

    echo "✓ 플러그인 다운로드 완료"
}

# 의존성 설치 및 빌드
install_and_build() {
    echo "📦 의존성을 설치합니다..."
    npm install --silent

    echo "🔨 플러그인을 빌드합니다..."
    npx tsc --outDir dist

    echo "✓ 빌드 완료"
}

# 메인 실행
main() {
    echo "================================================"
    echo "  Team-Seokan v2.0 - 짱구 멀티 에이전트 시스템"
    echo "  자기학습 | 회고 | 개선"
    echo "================================================"
    echo ""

    check_requirements
    setup_directory
    install_and_build

    echo ""
    echo "================================================"
    echo "✅ 설치가 완료되었습니다!"
    echo ""
    echo "📍 설치 위치: $PLUGIN_DIR"
    echo ""
    echo "🚀 사용 방법:"
    echo "   1. Claude Code를 재시작하세요"
    echo "   2. 새 세션에서 플러그인이 자동으로 로드됩니다"
    echo ""
    echo "📚 사용 가능한 명령어:"
    echo "   /memories  - 학습된 메모리 조회"
    echo "   /learn     - 수동으로 학습 추가"
    echo "   /forget    - 메모리 삭제"
    echo ""
    echo "🎭 14개의 짱구 캐릭터 에이전트가 준비되었습니다!"
    echo "================================================"
}

main
