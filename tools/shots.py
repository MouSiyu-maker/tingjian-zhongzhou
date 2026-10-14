import subprocess, sys
from PIL import Image
routes = dict(home='#/home', splash='', dig='#/dig', explain='#/explain', s01='#/sound/01', s05='#/sound/05', s09='#/sound/09', s16='#/sound/16', s11='#/sound/11',
              music='#/create/music', ip='#/create/ip', events='#/create/events', show='#/show')
which = sys.argv[1:] or list(routes)
for k in which:
    subprocess.run(['tools/shot.sh', routes[k], '844' if k=='splash' else ('9000' if k in ('dig','ip','explain') else '5000'), f'/tmp/p_{k}.png'])
    im = Image.open(f'/tmp/p_{k}.png'); im = im.crop((20, 0, im.width-20, im.height))
    # trim bottom: find last non-dark row
    px = im.convert('RGB'); 
    h = im.height
    n = 0
    for i in range(0, h, 1500):
        im.crop((0, i, im.width, min(h, i+1500))).save(f'/tmp/p_{k}_{n}.png'); n += 1
    print(k, im.size, n)
