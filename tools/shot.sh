#!/bin/sh
# 用法: tools/shot.sh '#/home' 1800 out.png   （移动端 390 宽，需先 python3 -m http.server 8765）
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --user-data-dir=/tmp/chrome-shot-profile --disk-cache-size=1 --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=500,${2:-1800} --virtual-time-budget=4000 \
  --screenshot="${3:-/tmp/shot.png}" "http://localhost:8765/index.html?t=$(date +%s)$1" >/dev/null 2>&1
# 注：无头 Chrome 最小宽度约 500，#app 最大宽 480 居中，故截图左右各有 10px 暗边。
