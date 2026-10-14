# -*- coding: utf-8 -*-
"""Generate js/sounds.js from the plan doc text (/tmp/doc.txt, extracted from #听见中轴 策划.docx)."""
import json, re
L = open('/tmp/doc.txt').read().split('\n')
sec = json.load(open('/tmp/sec.json'))

TRAIL = ['中国非遗网','北京日报','北京市第二批市级非遗名录','联合国教科文组织','北京市文物局',
         '中国非物质文化遗产网 相关保护成果','国际奥委会','北京市体育局','服贸会官网','北京市西城区政府','三庆园历史']
BAD = ('策划中','不应标','建议标','应删除','原策划')

def clean(t):
    t = t.strip()
    changed = True
    while changed:
        changed = False
        for s in TRAIL:
            if t.endswith(s):
                t = t[:-len(s)].rstrip(); changed = True
    parts = [p for p in t.split('。') if p.strip()]
    parts = [p for p in parts if not any(b in p for b in BAD)]
    return '。'.join(parts) + ('。' if parts and not parts[-1].endswith(('。','”')) else '')

def split_title(txt, title):
    txt = txt.strip()
    return txt[len(title):].strip() if txt.startswith(title) else txt

TITLES = {1:'金声玉振，礼序中和',2:'琴鼓一响，北京开讲',3:'醒木一落，故事开场',5:'一声吆喝，一街烟火',
          6:'锣鼓开场，梨园登台',7:'一人口中，万物有声',8:'一捧一逗，满堂欢笑',13:'击缶迎宾，世界相会',
          14:'脚步向北，城市生长',15:'多语汇聚，共话未来'}

def S(k): return sec[str(k)]
def entry(k):
    d = S(k)
    return dict(
        scene_note = clean(d.get('对应场景','')) if k in (3,10) else '',
        basis = clean(d.get('依据','')),
        copy = split_title(d.get('文案',''), TITLES.get(k,'')) if d.get('文案') else '',
        title = TITLES.get(k,''),
        history = clean(d.get('申报历程') or d.get('形成与认定历程','')),
    )

out = {k: entry(k) for k in [1,2,3,5,6,7,8,10,13,14,15]}
# 4 单弦
out[4] = dict(scene_note='', title='千调百牌，八角铿锵',
    basis='\n'.join([L[298], L[299], L[300], L[301]]),
    copy='\n'.join([L[304], L[305]]),
    history='\n'.join([L[307], L[308]]))
# 9 昆曲（文案待补，使用概述）
out[9] = dict(scene_note='', title='', basis='\n'.join([L[376], L[377]]), copy='', history='', overview=True)
# 10 智化寺：文案
out[10]['title'] = '五百年笙管，一座寺院的时间回声'
out[10]['copy'] = split_title(L[440].replace('文案｜',''), out[10]['title'])
# 11 鸽哨
out[11] = dict(scene_note='', title='', basis='\n'.join([L[467]]), copy='', history='', overview=True,
               overview_text='\n'.join([L[448], L[451]]))
# 12 北韵禅乐
out[12] = dict(scene_note='', title='', basis='\n'.join([L[489], L[491], L[492], L[495]]),
               copy=L[497], history='', overview=False)
# 叫卖词例
cries = [re.sub(r'^\d+、\s*','',x) for x in L[311:336] if re.match(r'^\d+、',x)]
out['cries'] = cries
json.dump(out, open('/tmp/sounds_gen.json','w'), ensure_ascii=False, indent=1)
for k,v in out.items():
    if k=='cries': print('cries',len(v)); continue
    print(k, {a:(len(b) if isinstance(b,str) else b) for a,b in v.items()})
print(out[5]['history']); print(out[15]['history']); print(out[13]['history']); print(out[6]['history'])
print(out[1]['copy'][:40], '|', out[3]['copy'][:30], '|', out[12]['copy'][:30])
