/* ============================================================
   听见中轴 · 线上博物馆  内容数据
   - 声音正文来自 sounds.gen.js（由策划文档自动生成）
   - 这里只放结构、归属、占位与手写的补充模块
   - 项目级文案在 project.gen.js（来自四份定稿 PDF）
   - 音频文件命名：assets/audio/s01.mp3 … s15.mp3（声音）
                   assets/audio/m-north.mp3 等（二创音乐）
   ============================================================ */

/* 声景分段：按页面从上到下的顺序（下滑 = 往北，由南向北） */
window.SEGMENTS = [
  { id: 'south',     name: '南段',     tag: '皇家礼乐',       range: '天坛神乐署 · 天桥',
    note: '代表中轴线南段“礼乐治国、敬天法祖”的文化秩序。', mascot: 'zhonghe', color: 'red' },
  { id: 'midSouth',  name: '中段南部', tag: '民俗戏曲',       range: '正阳门 · 前门 · 大栅栏',
    note: '前门、鲜鱼口、大栅栏自明清以来商铺、饭馆、摊贩密集，是北京传统商业和市井生活的重要区域。', mascot: 'jiaomai', color: 'orange' },
  { id: 'midNorth',  name: '中段北部', tag: '宫廷戏乐',       range: '景山、故宫至端门',
    note: '自景山至故宫，左社稷坛、右太庙，再至端门。', mascot: 'kunqu', color: 'brown' },
  { id: 'north',     name: '北段',     tag: '市井生活',       range: '钟鼓楼至万宁桥 · 什刹海',
    note: '自钟鼓楼至万宁桥的历史文化街区，反映北京百姓的城市生活。', mascot: 'gengshao', color: 'pink' },
  { id: 'newNorth',  name: '新北段',   tag: '文化轴线的延伸', range: '奥林匹克公园一带',
    note: '表达的是文化轴线的延伸，而不是遗产边界的改变。', mascot: 'kongzhu', color: 'cream' }
];

/* 声音清单。no = 编号，按“由南向北”编号；页面滚动同样由南向北。
   level.kind: nat 国家级 / city 北京市级 / modern 当代声景 / tbd 级别待补 / ph 占位 */
window.SOUNDS = [
  { no: 1,  name: '中和韶乐',     seg: 'south',    place: '天坛神乐署 · 凝禧殿',
    level: { kind: 'nat',    text: '国家级非遗' }, type: '礼乐', deep: true,  music: 'm-south' },
  { no: 2,  name: '北京琴书',     seg: 'south',    place: '天坛南门剧场',
    level: { kind: 'city',   text: '北京市级非遗' }, type: '曲艺' },
  { no: 3,  name: '北京评书',     seg: 'south',    place: '北京湖广会馆 · 宣南书馆',
    level: { kind: 'nat',    text: '国家级非遗' }, type: '曲艺' },
  { no: 4,  name: '单弦牌子曲',   seg: 'south',    place: '天桥历史文化街区',
    level: { kind: 'nat',    text: '国家级非遗' }, type: '曲艺' },
  { no: 5,  name: '老北京叫卖',   seg: 'midSouth', place: '正阳门箭楼 — 前门大街',
    level: { kind: 'city',   text: '北京市级非遗' }, type: '民俗', deep: true, music: 'm-midSouth' },
  { no: 6,  name: '京剧',         seg: 'midSouth', place: '大栅栏 · 三庆园',
    level: { kind: 'nat',    text: '国家级非遗 · 人类非遗代表作' }, type: '戏曲' },
  { no: 7,  name: '口技',         seg: 'midSouth', place: '老舍茶馆',
    level: { kind: 'nat',    text: '国家级非遗' }, type: '技艺' },
  { no: 8,  name: '相声',         seg: 'midSouth', place: '大栅栏 · 广德楼',
    level: { kind: 'nat',    text: '国家级非遗' }, type: '曲艺' },
  { no: 9,  name: '昆曲',         seg: 'midNorth', place: '故宫戏台 · 端门昇平署',
    level: { kind: 'tbd',    text: '级别待补' }, type: '戏曲', deep: true, music: 'm-midNorth' },
  { no: 10, name: '智化寺京音乐', seg: 'midNorth', place: '智化寺 · 智化殿',
    level: { kind: 'nat',    text: '国家级非遗' }, type: '礼乐' },
  { no: 11, name: '北京鸽哨',     seg: 'north',    place: '钟鼓楼片区',
    level: { kind: 'city',   text: '北京市级非遗' }, type: '技艺', deep: true, music: 'm-north' },
  { no: 12, name: '北韵禅乐',     seg: 'north',    place: '什刹海 · 广化寺',
    level: { kind: 'city',   text: '北京市级非遗' }, type: '佛乐' },
  { no: 13, name: '奥运礼序之声', seg: 'newNorth', place: '国家体育场“鸟巢”',
    level: { kind: 'modern', text: '当代声景 · 北京双奥文化声音' }, type: '当代' },
  { no: 14, name: '全民健身之声', seg: 'newNorth', place: '奥林匹克公园中心区',
    level: { kind: 'modern', text: '当代声景' }, type: '当代' },
  { no: 15, name: '国际对话之声', seg: 'newNorth', place: '国家会议中心',
    level: { kind: 'modern', text: '当代声景 · 国际交往声景' }, type: '当代' }
];

/* 二创音乐：AI 创作的四段主题音乐，页面顺序由南向北 */
window.TRACKS = [
  { id: 'm-south',    seg: 'south',    title: '中和雅韶', dur: 73,
    brief: '庄重、平和、有序的礼乐气质。',
    note: '以编钟、磬、笙、埙与古琴构想天坛礼乐空间，气质庄重平和而有序。' },
  { id: 'm-midSouth', seg: 'midSouth', title: '京韵烟火', dur: 73,
    brief: '南城街巷与戏台的人间烟火。',
    note: '借京剧顿挫与锣鼓节奏写南城街巷戏台，留烟火气，不直接搬用唱段。' },
  { id: 'm-midNorth', seg: 'midNorth', title: '昆韵清雅', dur: 74,
    brief: '水磨腔的舒缓与留白，宫苑与庭院的清雅。',
    note: '取昆曲水磨腔的舒缓与留白，以笛箫与弹拨乐写宫苑庭院清雅氛围。' },
  { id: 'm-north',    seg: 'north',    title: '鸽哨市井', dur: 75,
    brief: '北京北城的清晨，鸽群在钟鼓楼上空盘旋。',
    note: '以鸽哨、风声与气声木管为线索，写钟鼓楼上空鸽群由远及近的盘旋。' }
];

/* 三大场景活动（来自《特色描述》《工作坊简介》） */
window.EVENTS = [
  { id: 'sleep', kind: '睡眠音乐会', name: '古音安寝', nameNote: '非遗声景睡眠音乐会',
    audience: '睡眠困扰人群 · 都市青年 · 传统文化爱好者',
    desc: '融合北京中轴线非遗声景与身心疗愈的沉浸式睡眠音乐会。活动以鸽哨、叫卖、昆曲、中和韶乐等中轴声音为线索，结合长笛、古琴、箫等现场演奏，构建“五感”沉浸体验，引导观众在中轴线古音中舒缓身心。',
    tags: ['古建光影', '古法香薰', '专属寝具', '晚安茶饮', '360°环绕声场'],
    done: '2025 年、2026 年在中国人民大学艺术学院音乐厅完成两场实践' },
  { id: 'script', kind: '沉浸式剧本游', name: '钟灵传音 · 中轴寻音记', nameNote: '沉浸式非遗剧本研学',
    audience: '小学 3—6 年级学生 · 可延伸为家庭亲子研学产品',
    desc: '首场活动《风起鸽归》中，孩子们化身“寻栖使团”，在辨听、绘画、手工与合作共创中亲近鸽哨文化，理解声音与城市生活的关系。',
    tags: ['辨听', '绘画', '手工', '合作共创'],
    done: '首场《风起鸽归》落地交道口街道党群服务中心' },
  { id: 'gen', kind: '代际传习', name: '代际声享', nameNote: '中轴声音传习行动',
    audience: '社区 50—80 岁长者 · 18—35 岁青年',
    desc: '以“一对一深度采录”与“一对多社区分享会”双轨模式，让胡同长者的声音记忆被青年听见、记录，转化为《中轴回声》播客与《中轴声音档案册》。',
    tags: ['一对一深度采录', '一对多社区分享会', '《中轴回声》播客', '《中轴声音档案册》'],
    done: '落地交道口街道党群服务中心' }
];

/* 场景活动二级页（来自三份活动产品源文件 PDF） */
window.EVENT_DETAIL = {
  sleep: {
    photos: {
      hero: 'events/sleep/hero.jpg',
      poster: 'events/sleep/poster.jpg',
      film: [
        'events/sleep/sleep_00.jpg','events/sleep/sleep_02.jpg','events/sleep/sleep_04.jpg',
        'events/sleep/sleep_05.jpg','events/sleep/sleep_08.jpg','events/sleep/sleep_09.jpg',
        'events/sleep/sleep_10.jpg','events/sleep/sleep_11.jpg','events/sleep/sleep_12.jpg',
        'events/sleep/sleep_13.jpg'
      ],
      mosaic: [
        'events/sleep/sleep_05.jpg','events/sleep/sleep_08.jpg','events/sleep/sleep_09.jpg',
        'events/sleep/sleep_10.jpg','events/sleep/sleep_11.jpg','events/sleep/sleep_12.jpg','events/sleep/sleep_13.jpg'
      ],
      goods: [
        'events/sleep/sleep_14.jpg','events/sleep/sleep_15.jpg','events/sleep/sleep_16.jpg',
        'events/sleep/sleep_17.jpg','events/sleep/sleep_18.jpg','events/sleep/sleep_19.jpg','events/sleep/sleep_20.jpg'
      ]
    },
    pitch: '把北京中轴线的非遗原声写成一套遵循身心放松节律的现场音乐，让城市人躺在古建声场里，从喧嚣逐渐回到安静。',
    lead: '依托北京中轴线非遗声景打造沉浸式睡眠音乐会，融合古琴、颂钵、箫等现场演奏与四段声脉，观众可躺卧聆听，在古建声场中完成从喧嚣到安静的身心转换。',
    insight: {
      title: '壹 · 洞察与立意',
      why: '为什么是“睡眠”＋非遗声景？',
      paras: [
        '都市人的疲惫，往往不是缺少休息时间，而是身心难以从高唤醒切到放松。本场不作医疗替代，而以可进入、可感知的夜间声景体验为核心，让鸽哨、叫卖、昆曲与韶乐从“被介绍”变为当晚真实休息的一部分。'
      ]
    },
    flow: {
      title: '贰 · 模式流程',
      sub: '一场音乐会，完成从城市喧嚣到身心安静的五步转换',
      layers: '核心层 90 分钟睡眠音乐会；延伸层 20 分钟机动艺术沙龙（乐器解析、轻触铜磬、试吹鸽哨、声音寄语）。',
      steps: [
        { name: '① 入境', meta: '从街道进入古建', body: '净手、领取眼罩与香囊、安置寝具，建立夜间仪式感。', pic: 'events/sleep/sleep_05.jpg' },
        { name: '② 导眠', meta: '高唤醒 → 放松', body: '呼吸引导、古建白噪音、稀疏器乐，卸下外界信息。', pic: 'events/sleep/sleep_08.jpg' },
        { name: '③ 沉浸', meta: '浅层放松 → 深度沉静', body: '四段中轴声景渐进编配，降低感官负荷。', pic: 'events/sleep/sleep_10.jpg' },
        { name: '④ 唤醒', meta: '沉静 → 清醒', body: '声部增加、调式转换、晨间自然声，平缓恢复感知。', pic: 'events/sleep/sleep_11.jpg' },
        { name: '⑤ 共鸣', meta: '聆听者 → 参与者', body: '乐器解析、轻量试奏、声音寄语，完成文化理解与共创。', pic: 'events/sleep/sleep_13.jpg' }
      ]
    },
    content: {
      title: '叁 · 内容结构',
      sub: '一条中轴线，五次身心降速',
      intro: '以中轴线由北向南的空间叙事承载音乐节律变化。非遗原声承担文化识别；钢琴、大提琴、箫与环境声承担连贯与舒缓。',
      items: [
        { name: '第一幕 · 栖', meta: '20 min', body: '轻柔白噪音渐进入场，旋律稀疏轻盈，建立安全、熟悉的城市清晨意象。' },
        { name: '第二幕 · 雅', meta: '20 min', body: '中段北部庙宇禅院与宫廷礼制气质；箫与大提琴长音衔接，进入浅层放松。' },
        { name: '第三幕 · 俗', meta: '20 min', body: '南城街巷与戏台烟火感；全场最低信息密度，支撑深度沉静。' },
        { name: '第四幕 · 和', meta: '30 min', body: '天坛礼乐和鸣；声部缓慢增加、调式渐亮，温柔唤醒。' },
        { name: '第五幕 · 融', meta: '20 min 沙龙', body: '铜磬、复刻鸽哨、寄语中轴；共创声音纳入中轴线声音素材库。' }
      ]
    },
    proof: {
      title: '肆 · 实践基础',
      when: '2025 年、2026 年 3 月 21 日晚 19:00',
      where: '中国人民大学艺术学院音乐厅',
      note: '两场近 2 小时睡眠音乐会，总计参与近百人次。已验证躺卧聆听、低亮度空间、渐进式编排与柔和唤醒的可执行性，并明确转向“北京中轴线非遗声景”文化定位。'
    },
    outcomes: [
      { name: '古音安寝体验套装', body: '眼罩、安眠毛毯、中药香囊、安神香薰与收纳袋统一视觉；现场使用、离场可选购。' },
      { name: '中轴声景 NFC 卡', body: '鸽哨、叫卖、昆曲、中和韶乐四组主题，一触进入对应音频。' },
      { name: '《听见中轴》睡眠播客', body: '现场纯享声轨、幕后创作谈与采集花絮，离场后可持续收听。' }
    ],
    sustain: {
      title: '陆 · 可持续性',
      cost: '单场消耗约 870 元（氛围灯、充气床垫、物料设计、眼罩/线香等）',
      points: [
        '统一表述为放松、休息与文化体验，不使用医疗化承诺。',
        '声音与肖像经授权方可发布；香氛、茶饮、躺卧设过敏与无香/普通坐席选择。',
        '形成“校园验证—中轴主题升级—线下体验—数字音频—非遗文创—系列专场”闭环。'
      ]
    }
  },
  script: {
    photos: {
      hero: 'events/script/hero.jpg',
      poster: 'events/script/poster.jpg',
      film: [
        'events/script/script_00.jpg','events/script/script_02.jpg','events/script/script_04.jpg',
        'events/script/script_05.jpg','events/script/script_07.jpg','events/script/script_08.jpg',
        'events/script/script_09.jpg','events/script/script_10.jpg','events/script/script_11.jpg',
        'events/script/script_12.jpg','events/script/script_13.jpg','events/script/script_14.jpg',
        'events/script/script_15.jpg','events/script/script_16.jpg','events/script/script_17.jpg'
      ],
      mosaic: [
        'events/script/script_07.jpg','events/script/script_09.jpg','events/script/script_11.jpg',
        'events/script/script_13.jpg','events/script/script_14.jpg','events/script/script_15.jpg',
        'events/script/script_16.jpg','events/script/script_17.jpg'
      ],
      goods: [
        'events/script/script_18.jpg','events/script/script_19.jpg','events/script/script_20.jpg',
        'events/script/script_21.jpg','events/script/script_23.jpg','events/script/script_24.jpg',
        'events/script/script_25.jpg','events/script/script_26.jpg','events/script/script_28.jpg',
        'events/script/script_29.jpg','events/script/script_30.jpg'
      ]
    },
    pitch: '让孩子成为中轴线的“寻音小使者”，以一场可参与、可体验、可传播的沉浸式剧本游，重新听见那些容易被忽略的声音。',
    lead: '面向小学三至六年级的中轴寻音剧本游：孩子化身寻音小使者，以角色扮演、闯关与手工共创感受鸽哨等非遗声音，完成一场可参与、可带走的沉浸式美育体验。',
    insight: {
      title: '壹 · 洞察与立意',
      why: '为什么是声音？为什么是剧本游？',
      paras: [
        '城市最先消失的不是房子，是声音。对儿童而言，静态展示难留深刻记忆。项目以声音为媒介、剧本游为载体，建立“听—演—做—创”路径，让中轴非遗由孩子亲身体验后再传向未来。'
      ]
    },
    flow: {
      title: '贰 · 模式流程',
      sub: '从“收到来信”到成为“北京中轴声音小小传承人”',
      layers: '室内沉浸式任务模式；单主题约 95—105 分钟，完整体验约 120—160 分钟；5 人起灵活成团。采用“1 个总 IP＋多条声音主题线＋标准化任务模块”，单场成本约 800 元。',
      steps: [
        { name: '① 开场仪式', meta: '声音唤醒＋故事导入', body: '钟声导入、钟灵来信，介绍“寻音小使者”身份。', pic: 'events/script/script_08.jpg' },
        { name: '② 角色准备', meta: '角色进入＋身份代入', body: '选择主题与 16 种动物角色之一，领取身份卡与头饰/配饰。', pic: 'events/script/script_10.jpg' },
        { name: '③ 主题任务', meta: '听辨＋闯关＋表演＋制作', body: '围绕所选非遗完成 3 个互动任务，逐步收集主题道具。', pic: 'events/script/script_07.jpg' },
        { name: '④ 成果拼合', meta: '线索整合', body: '完成主题线索或象征性道具拼合，确认通关。', pic: 'events/script/script_14.jpg' },
        { name: '⑤ 终章仪式', meta: '仪式感＋文化认同', body: '钟灵出场、颁发证书、全体宣誓、合影。', pic: 'events/script/script_17.jpg' }
      ]
    },
    content: {
      title: '叁 · 内容结构',
      sub: '“栖、雅、俗、和”四卷寻声体系',
      intro: '六百年前铸钟传说中，华仙姑娘化作守护中轴线声音的“钟灵”。她邀请孩子们沿不同寻声之路寻找被遗忘的声音。四条路线主题独立、世界观统一，可按兴趣单选。',
      items: [
        { name: '栖 · 风起鸽归', meta: '鸽哨 · 探索/创造', body: '套圈、绘画接龙、神鸽共创；培养探索力、创造力、动手力。' },
        { name: '雅 · 戏启宫阙', meta: '昆曲 · 听辨/表演', body: '听辨、模仿、表演；培养观察力、倾听力、审美力。' },
        { name: '俗 · 百艺开锣', meta: '京剧/叫卖/口技', body: '角色、表达、即兴；培养表达力、想象力、应变力。' },
        { name: '和 · 天地同和', meta: '中和韶乐 · 协作', body: '寻宝、推理、协作；培养逻辑力、合作力、规则意识。' }
      ]
    },
    proof: {
      title: '肆 · 执行证据',
      when: '2026 年 8 月 31 日 14:00',
      where: '北京市东城区交道口街道党群服务中心',
      note: '首场以《风起鸽归》验证，6 名小学生参与约 2 小时。完成鸽哨套圈、绘画接龙、神鸽共创与真实鸽哨体验；活动后已有参与者主动询问更多中轴线声音。'
    },
    outcomes: [
      { name: '《风起鸽归》剧本游物料', body: '任务手册、角色令牌、钟灵信件、鸽哨识别卡、纸模、传承证书等，米色特种纸＋暗红色系仿古视觉。' },
      { name: '系列文创', body: '亚克力挂件、笔记本、文具礼盒、托特包、明信片等，让中轴文化进入日常。' },
      { name: '“钟灵”IP', body: '核心 NPC 与叙事引导者；融合明代服装与戏曲水袖意象，串联开场、任务与终章。' }
    ],
    sustain: {
      title: '陆 · 可持续性',
      cost: '单场成本约 800 元，全流程标准化，可在任意社区复制',
      points: [
        '配置 1 名“钟灵之声”引导者＋各主题任务 NPC＋安全协助。',
        'SOP 覆盖筹备、场地、物料、培训到终章证书颁发。',
        '后续可按其他声音持续扩展剧本，形成可延续产品线。'
      ]
    }
  },
  gen: {
    photos: {
      hero: 'events/gen/hero.jpg',
      poster: 'events/gen/poster.jpg',
      film: [
        'events/gen/gen_00.jpg','events/gen/gen_02.jpg','events/gen/gen_04.jpg',
        'events/gen/gen_05.jpg','events/gen/gen_06.jpg','events/gen/gen_07.jpg',
        'events/gen/gen_08.jpg','events/gen/gen_09.jpg','events/gen/gen_10.jpg',
        'events/gen/gen_11.jpg','events/gen/gen_12.jpg','events/gen/gen_13.jpg',
        'events/gen/gen_14.jpg'
      ],
      mosaic: [
        'events/gen/gen_05.jpg','events/gen/gen_06.jpg','events/gen/gen_07.jpg',
        'events/gen/gen_08.jpg','events/gen/gen_10.jpg','events/gen/gen_12.jpg',
        'events/gen/gen_13.jpg','events/gen/gen_14.jpg'
      ],
      goods: [
        'events/gen/gen_15.jpg','events/gen/gen_16.jpg','events/gen/gen_18.jpg',
        'events/gen/gen_19.jpg','events/gen/gen_20.jpg','events/gen/gen_21.jpg',
        'events/gen/gen_23.jpg','events/gen/gen_24.jpg','events/gen/gen_26.jpg','events/gen/gen_27.jpg'
      ]
    },
    pitch: '用北京中轴线的声音档案，让被时代落下的老人与被焦虑困住的青年，完成一场平等的互救。',
    lead: '以中轴线声音档案为媒介，连结社区长者与青年：一对一深度采录与社区分享双轨并行，让岁月回声与真诚倾听彼此成全，完成一场平等而温暖的跨代声音互救。',
    insight: {
      title: '壹 · 洞察与立意',
      why: '为什么是声音？为什么是跨代？',
      paras: [
        '老人的孤独与青年的情感空缺恰好互补。我们用中轴声音做出口与载体：跨代不是施与受，而是各取所需——老人贡献慢叙事与人生韧性，青年贡献真诚倾听与数字技术，在互救中彼此成全。'
      ]
    },
    flow: {
      title: '贰 · 模式流程',
      sub: '行动链条与双轨设计',
      layers: '茶香与京味糕点唤醒记忆；老照片与声音打开人生；播客、寄语、回声卡形成循环。单场消耗约 230 元。',
      steps: [
        { name: '轨道一 · 1 对 1 采录', meta: '低压力平行社交', body: '喝茶听声音破冰；录音笔不打断、不念稿；便携打印机当场洗出老人单人照。', pic: 'events/gen/gen_05.jpg' },
        { name: '轨道二 · 1 对多分享', meta: '社区现场', body: '1 位老人面向一群青年讲故事；青年在折扇、蒲扇、帆布包上手写寄语并盖章赠予。', pic: 'events/gen/gen_08.jpg' },
        { name: '社会化漂流', meta: '城市公共空间', body: '《中轴声音档案册》投放咖啡馆、书店；读者填回声卡，志愿者带回社区读给老人听。', pic: 'events/gen/gen_13.jpg' }
      ]
    },
    content: {
      title: '叁 · 内容结构',
      sub: '3＋3 六卷体系：六类声音，六种治愈',
      intro: '去除死板景点绑定，将中轴线声音拓展为广义的市井人文记忆——每一卷回应一种当代青年情绪。',
      items: [
        { name: '卷一 · 鸽哨之声', meta: '天空交响', body: '胡同上空鸽哨与院落闲适；缓解格子间的“空间窒息”与精神内耗。' },
        { name: '卷二 · 叫卖之声', meta: '市井吆喝', body: '老字号与走街手艺人奋斗史；治愈职场内卷中的挫折焦虑。' },
        { name: '卷三 · 曲艺之声', meta: '茶馆欢笑', body: '快板、单弦与京韵大鼓；用幽默解构“进度条卡住”的执念。' },
        { name: '卷四 · 邻里之声', meta: '四合院喧闹', body: '大杂院人情往来；鼓励青年重建社区附近性。' },
        { name: '卷五 · 持家之声', meta: '算盘缝纫机', body: '勤俭持家智慧；缓解消费主义焦虑。' },
        { name: '卷六 · 手艺之声', meta: '烟火匠心', body: '厨房与街角手艺；鼓励脚踏实地掌握一门技艺。' }
      ]
    },
    proof: {
      title: '肆 · 执行证据',
      when: '2026 年 9 月 2 日',
      where: '交道口街道党群服务中心（前圆恩寺胡同 28 号）',
      note: '约 1.5 小时，8 位老人＋10 余名青年参与。嘉宾为荣获“首都最美家庭”的冀红奶奶与杨占岭爷爷。已跑通“破冰—采录—分享—反馈”全流程。'
    },
    outcomes: [
      { name: '《中轴回声》播客', body: '1 对 1 长音频剪辑为 15—20 分钟单集，保留方言金句与胡同白噪音。' },
      { name: '《中轴声音档案册》与回声卡', body: '朱砂红、米白与暗金；长卷式 3＋3 六篇章，结合老照片、波形、二维码与可撕回声卡。' },
      { name: '系列文创', body: '帆布包、团扇、复古印章，把视觉元素延伸到日常。' }
    ],
    sustain: {
      title: '陆 · 可持续性',
      cost: '单场消耗约 230 元；常态化复用设备约 550 元',
      points: [
        '老人签署声音与肖像授权后素材方可发布；敏感内容发布前经确认。',
        '适老化座椅、无障碍路线与急救箱配置。',
        '与交道口街道建立常态化合作，目标形成月度节奏与志愿者梯队。'
      ]
    }
  }
};

/* 文创图集 */
window.GOODS = [
  { group: '声音交互类', items: [
    { img: 'wc-musicbox.jpg',  name: '凸嘟八音盒', wide: true },
    { img: 'wc-windchime.jpg', name: '凸嘟风铃' },
    { img: 'wc-nfc.jpg',       name: '凸嘟 NFC 发声书签' },
    { img: 'wc-rattle.jpg',    name: '凸嘟拨浪鼓' } ] },
  { group: '装饰类', items: [
    { img: 'wc-plush-group.jpg', name: '凸嘟发声毛绒玩具', wide: true },
    { img: 'wc-plush-key.jpg',   name: '毛绒挂件' },
    { img: 'wc-rings.jpg',       name: '戒指系列' } ] },
  { group: '实用类', items: [
    { img: 'wc-blanket.jpg',   name: '氛围毯' },
    { img: 'wc-pillow.jpg',    name: '抱枕' },
    { img: 'wc-eyemask.jpg',   name: '眼罩' },
    { img: 'wc-tote.jpg',      name: '帆布袋' },
    { img: 'wc-bookmarks.jpg', name: '书签' },
    { img: 'wc-mug-phone.jpg', name: '马克杯 · 手机壳', wide: true } ] },
  { group: '工作坊打卡套色印章', items: [
    { img: 'wc-stamp.jpg', name: '三色套色印章', wide: true },
    { img: 'wc-card.jpg',  name: '信纸与折页', wide: true } ] }
];

/* 声音详情里的补充模块（手写，来自策划文档） */
window.EXTRAS = {
  1: { eightSounds: {
    lead: '中和韶乐不是单一声音，而是一个声音系统。以“八音”配置乐器：钟起磬收，柷启敔止，建鼓、搏拊定节拍，竹匏土随字应和。',
    rows: [
      ['金', '镈钟、编钟',     '各 1 只 / 1 组', '起奏，宣“金声”，象征“阳”'],
      ['石', '特磬、编磬',     '各 1 只 / 1 组', '收韵，宣“玉振”，象征“阴”'],
      ['丝', '琴、瑟',         '琴 10 张、瑟 4 架', '“八音之首”，伴奏与歌相和'],
      ['竹', '笛、篪、箫、排箫', '笛 10、箫 10、篪 6、排箫 2', '合奏，一字一音应和'],
      ['土', '埙',             '2 个',           '音色低沉圆润，成对使用'],
      ['木', '柷、敔',         '各 1 件',        '柷启乐（击三声开始），敔止乐（刮击三次结束）'],
      ['匏', '笙',             '10 件',          '和声乐器'],
      ['革', '建鼓、搏拊',     '建鼓 1 架、搏拊 2 个', '击建鼓、拍搏拊，用于和声']
    ] } },
  5: { cries: true },
  9: { stages: [
      ['畅音阁大戏台', '宁寿宫区后部，始建于乾隆三十七年（1772 年），清代宫廷中体量最大的三层大戏楼，高约 20 米，自上而下分“福台”“禄台”“寿台”。台底设水井以产生共鸣音响效果。'],
      ['漱芳斋戏台',   '重华宫区，设有室内小戏台“风雅存”与庭院大戏台，台基下埋有大水井增强声学共鸣。每年元旦，伶人须入漱芳斋为皇帝首演昆曲承应剧目《膺受多福》。'],
      ['倦勤斋戏台',   '宁寿宫内，利用竹丝扣雕与西洋透视画布景，专供皇帝私密性的昆曲赏析与清音雅集。'],
      ['端门 · 昇平署', '昇平署故址在南长街南口，是清代管理宫廷昆曲演出的最高行政与艺术机构，管理近万册剧本曲谱与精美戏衣行头。']
    ],
    calendar: [
      ['正月初一 · 元旦', '《膺受多福》', '迎祥纳福、祈求国泰民安', '重华宫漱芳斋大戏台'],
      ['寒食节',          '《追叙绵山》', '缅怀介子推忠孝节烈', '紫禁城内廷戏台'],
      ['九月初九 · 重阳', '《九华品菊》', '寓意长寿与文人高洁情操', '宁寿宫畅音阁 / 重华宫'],
      ['冬季赏雪',        '《谢庭咏絮》', '借晋代典故赞颂皇家文化气象', '倦勤斋 / 漱芳斋室内戏台'],
      ['帝后万寿节',      '《福禄寿》等', '祈寿、彰显皇家尊严', '畅音阁大戏楼 / 寿安宫戏台']
    ] },
  11: { kinds: [
      ['葫芦类', '音色浑厚，共鸣腔体大，多作主音'],
      ['联筒类', '音响高亢清亮，多哨重叠组合，穿透力强'],
      ['星排类', '排列整齐，声相丰富层次分明'],
      ['星眼类', '多音阶交响，声场充盈度与和声效果最高']
    ] }
};
