"""生成装饰性 SVG：背景线稿（bg-lines.svg）与莲瓣圆框（petal-ring.svg）。"""
import math, os
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img')

def roof(cx, y, w, h=16, lift=7):
    """歇山式屋檐：中间高、两端起翘。"""
    x0, x1 = cx - w / 2, cx + w / 2
    return (f'M{x0-6:.1f},{y+2:.1f} Q{x0+3:.1f},{y-lift:.1f} {x0+w*.14:.1f},{y-4:.1f} '
            f'L{cx-w*.18:.1f},{y-h:.1f} L{cx+w*.18:.1f},{y-h:.1f} L{x1-w*.14:.1f},{y-4:.1f} '
            f'Q{x1-3:.1f},{y-lift:.1f} {x1+6:.1f},{y+2:.1f} Z')

def tower(cx, base, w, tiers=2, wall=26):
    p = []
    p.append(f'M{cx-w/2-14:.1f},{base} h{w+28:.1f} v-8 h-{w+28:.1f} Z')           # 台基
    p.append(f'M{cx-w/2-8:.1f},{base-8} h{w+16:.1f} v-6 h-{w+16:.1f} Z')
    y = base - 14
    cw = w
    for t in range(tiers):
        p.append(f'M{cx-cw/2:.1f},{y} v-{wall} h{cw:.1f} v{wall}')               # 墙身
        n = max(3, int(cw // 14))
        for k in range(1, n):
            xx = cx - cw / 2 + cw * k / n
            p.append(f'M{xx:.1f},{y} v-{wall}')
        p.append(f'M{cx-cw/2:.1f},{y-wall+7} h{cw:.1f}')
        y -= wall
        p.append(roof(cx, y, cw + 26, 18))
        y -= 8
        cw *= .74
        wall *= .86
    p.append(f'M{cx:.1f},{y-8} v-10')                                             # 宝顶
    return ' '.join(p)

def pavilion(cx, base, w):
    p = [f'M{cx-w/2-8:.1f},{base} h{w+16:.1f} v-6 h-{w+16:.1f} Z']
    y = base - 6
    p.append(f'M{cx-w/2:.1f},{y} v-22 h{w:.1f} v22')
    for k in range(1, 4):
        p.append(f'M{cx-w/2+w*k/4:.1f},{y} v-22')
    p.append(roof(cx, y - 22, w + 22, 20, 9))
    p.append(f'M{cx:.1f},{y-46} v-10 m-3,0 h6')
    return ' '.join(p)

def paifang(cx, base, w):
    p = [f'M{cx-w/2:.1f},{base} v-50 M{cx-w/6:.1f},{base} v-56 M{cx+w/6:.1f},{base} v-56 M{cx+w/2:.1f},{base} v-50',
         f'M{cx-w/2-6:.1f},{base-48} h{w+12:.1f} M{cx-w/2-6:.1f},{base-40} h{w+12:.1f}']
    p.append(roof(cx, base - 56, w / 3 + 16, 12, 6))
    p.append(roof(cx - w / 2, base - 50, 34, 10, 5))
    p.append(roof(cx + w / 2, base - 50, 34, 10, 5))
    return ' '.join(p)

def bg():
    S = '#8A6A3C'
    items = [tower(86, 150, 110, 2), pavilion(372, 296, 54), tower(150, 470, 150, 2, 30),
             paifang(380, 640, 120), pavilion(70, 700, 46), tower(360, 880, 96, 2, 24),
             paifang(120, 1010, 130), tower(380, 1110, 120, 2, 26)]
    paths = ''.join(f'<path d="{d}"/>' for d in items)
    # 虚线中轴线与云纹点缀
    deco = '<path d="M240,0 V1200" stroke-dasharray="2 10"/>'
    for (x, y) in [(250, 230), (60, 380), (400, 520), (230, 780), (80, 930), (300, 1060)]:
        deco += f'<path d="M{x},{y} q8,-10 16,0 q8,-10 16,0 M{x+6},{y+6} q8,-8 16,0" />'
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="1200" viewBox="0 0 480 1200">'
           f'<g fill="none" stroke="{S}" stroke-opacity=".16" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">{paths}{deco}</g></svg>')
    open(os.path.join(OUT, 'bg-lines.svg'), 'w').write(svg)

def petals():
    gold, fill, line = '#C9B27A', '#F8F3E1', '#D8C79C'
    n = 14
    g = ''
    for k in range(n):
        a = 360 / n * k
        g += (f'<g transform="rotate({a:.2f} 200 200)">'
              f'<path d="M200,100 C170,98 160,56 174,30 C184,12 216,12 226,30 C240,56 230,98 200,100 Z" fill="{fill}" stroke="{line}" stroke-width="1.4"/>'
              f'<path d="M200,86 C182,82 178,54 190,38 C196,30 204,30 210,38 C222,54 218,82 200,86 Z" fill="none" stroke="{line}" stroke-width="1"/>'
              f'<circle cx="200" cy="58" r="3.2" fill="{gold}" fill-opacity=".7"/></g>')
    # 内层小瓣
    for k in range(n):
        a = 360 / n * (k + .5)
        g += (f'<g transform="rotate({a:.2f} 200 200)"><path d="M200,100 C210,92 216,80 200,66 C184,80 190,92 200,100 Z" '
              f'fill="{fill}" stroke="{line}" stroke-width="1"/></g>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">'
           f'<circle cx="200" cy="200" r="176" fill="{fill}" fill-opacity=".6"/>{g}'
           f'<circle cx="200" cy="200" r="132" fill="#F6EFD6" stroke="{gold}" stroke-width="1.2"/></svg>')
    open(os.path.join(OUT, 'petal-ring.svg'), 'w').write(svg)

def line_tower():
    d = tower(86, 150, 110, 2)
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 52 172 100"><g fill="none" stroke="#9E402A" stroke-width="1.3" '
           f'stroke-linejoin="round" stroke-linecap="round"><path d="{d}"/></g></svg>')
    open(os.path.join(OUT, 'line-tower.svg'), 'w').write(svg)

bg(); petals(); line_tower(); print('ok')
