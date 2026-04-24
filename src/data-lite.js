(function attachLiteConfig(root) {
  const config = {
  "title": "RMBTI 老板出手人格测试 · 快速版",
  "subtitle": "测测你在场子里，是哪一张老板牌",
  "helper": [
    "1-2 分钟",
    "12 题",
    "主牌 + 副签"
  ],
  "introMessages": [
    "正在洗牌……",
    "正在读取你的出手气场……",
    "主牌即将显影……",
    "请进入老板席。"
  ],
  "progressStages": [
    {
      "threshold": 0.33,
      "text": "牌桌已就位……"
    },
    {
      "threshold": 0.66,
      "text": "气场正在聚拢……"
    },
    {
      "threshold": 1,
      "text": "主牌即将显影……"
    }
  ],
  "homeCardIds": [
    "king",
    "deep",
    "myth"
  ],
  "primaryOrder": [
    "deep",
    "saver",
    "ctrl",
    "loyal",
    "myth",
    "rare",
    "king",
    "clutch"
  ],
  "secondaryOrder": [
    "burst",
    "steady",
    "heroic",
    "timing"
  ],
  "primary": {
    "deep": {
      "id": "deep",
      "name": "深情",
      "code": "DEEP",
      "sentence": "你买的不是热闹，是 TA 只向你亮起的一盏灯。",
      "desire": "偏爱确认",
      "keywords": [
        "偏爱",
        "私密",
        "例外"
      ],
      "color": "#0D1B2A",
      "accent": "#C93A4E",
      "imageSrc": "../assets/cards/card_deep.webp",
      "long": "你在意的不是全场有多吵，而是某个重要的人是否把你从人群里单独认出来。你愿意出手，是为了确认那束光真的只照向你。",
      "highlight": "TA 在热闹里单独点到你，或者用一句别人接不上的话回应你。",
      "turnoff": "辜负深情的人，一文不值。"
    },
    "saver": {
      "id": "saver",
      "name": "逆转",
      "code": "SAVE-R",
      "sentence": "你买的不是礼物，是局面因你改写的那一秒。",
      "desire": "改命扭转",
      "keywords": [
        "悬念",
        "翻盘",
        "拯救"
      ],
      "color": "#3D0000",
      "accent": "#D5A33A",
      "imageSrc": "../assets/cards/card_saver.webp",
      "long": "你天然会被危机点吸引。越是局面要塌、倒计时越近，你越想证明自己不是旁观者，而是那个能把结局重新写一遍的人。",
      "highlight": "眼看要输的局，因为你一笔下去重新活过来。",
      "turnoff": "该翻盘的局翻不了，是你们不争气。"
    },
    "ctrl": {
      "id": "ctrl",
      "name": "掌盘",
      "code": "CTRL",
      "sentence": "你买的不是礼物，是今晚往哪走由你说了算。",
      "desire": "介入与控制",
      "keywords": [
        "主导",
        "操盘",
        "指令感"
      ],
      "color": "#0D2B1A",
      "accent": "#BFA65A",
      "imageSrc": "../assets/cards/card_ctrl.webp",
      "long": "你喜欢的不是单点热闹，而是场子的方向感开始响应你。你出手之后，节奏、路线、气氛都该变得更清晰。",
      "highlight": "大家开始默认关键节点要看你的意思，局势按你的路线走。",
      "turnoff": "不听调度的场子，不值得我费心。"
    },
    "loyal": {
      "id": "loyal",
      "name": "长情",
      "code": "LOYAL",
      "sentence": "你买的不是一时上头，是时间站在你这边的证明。",
      "desire": "长期留痕",
      "keywords": [
        "陪伴",
        "沉淀",
        "年轮"
      ],
      "color": "#3A2414",
      "accent": "#C7832C",
      "imageSrc": "../assets/cards/card_loyal.webp",
      "long": "你不急着用一次大动静证明自己。你更在意很多个夜晚之后，这里是否还留下你的名字、习惯和位置。",
      "highlight": "过了一阵子再回来，场子里还保留着你的名字和痕迹。",
      "turnoff": "不值得我久留的地方，我转身就走。"
    },
    "myth": {
      "id": "myth",
      "name": "神话",
      "code": "MYTH",
      "sentence": "你买的不是礼物，是把一个普通夜晚点成传奇。",
      "desire": "造景与传奇感",
      "keywords": [
        "名场面",
        "故事",
        "电影感"
      ],
      "color": "#211238",
      "accent": "#9F75FF",
      "imageSrc": "../assets/cards/card_myth.webp",
      "long": "你最在意的是一笔钱能不能让普通时刻升级成故事。你不是只要贵，你要的是以后大家还会提起那一幕。",
      "highlight": "一个普通房间被你点成全场记住的名场面。",
      "turnoff": "没有故事的夜晚，不配有我在场。"
    },
    "rare": {
      "id": "rare",
      "name": "典藏",
      "code": "RARE",
      "sentence": "你买的不是贵，是别人没有而你拥有。",
      "desire": "稀缺占有",
      "keywords": [
        "唯一",
        "限量",
        "印记"
      ],
      "color": "#20242B",
      "accent": "#CBD5E1",
      "imageSrc": "../assets/cards/card_rare.webp",
      "long": "你对稀缺和专属非常敏感。真正让你觉得值的，是别人拿不到、复制不了、过了这个节点就不会再有的身份印记。",
      "highlight": "只此一份、只有你拿到的编号、徽章、身份或印记。",
      "turnoff": "满大街都有的东西，配不上我的眼光。"
    },
    "king": {
      "id": "king",
      "name": "君临",
      "code": "KING",
      "sentence": "你买的不是礼物，是全场抬头的那一秒。",
      "desire": "中心性与排面",
      "keywords": [
        "高位",
        "显圣",
        "全场目光"
      ],
      "color": "#0A0A0F",
      "accent": "#D4AF37",
      "imageSrc": "../assets/cards/card_king.webp",
      "long": "你要的是存在感被集体承认。你不一定需要解释自己是谁，场子的反应应该替你完成介绍。",
      "highlight": "你一出现，全场先静一秒，目光自然往你这里聚。",
      "turnoff": "我的光环，汝等竟敢视而不见。"
    },
    "clutch": {
      "id": "clutch",
      "name": "绝杀",
      "code": "CLUTCH",
      "sentence": "你买的不是礼物，是胜负线上的最后一击。",
      "desire": "终局定音",
      "keywords": [
        "压线",
        "收官",
        "一锤定音"
      ],
      "color": "#3A1A05",
      "accent": "#F59E0B",
      "imageSrc": "../assets/cards/card_clutch.webp",
      "long": "你喜欢把力气留到真正决定结果的地方。别人可以热闹很久，但最后那个把胜负钉死的人，最好是你。",
      "highlight": "最后一秒你把结果钉死，全场都知道这一下不能被替代。",
      "turnoff": "最后一击没人能收，是这局不配有结尾。"
    }
  },
  "secondary": {
    "burst": {
      "id": "burst",
      "name": "爆冲",
      "sentence": "你不一定常出手，但真到那个点，你会狠狠干一把。",
      "keywords": [
        "关键节点",
        "猛冲",
        "突然拉满"
      ],
      "short": "你的节奏不是平均分配，而是把能量攒到关键点一次打出去。",
      "turnoff": "我这一把梭出去，场子接不住，是你们的问题。"
    },
    "steady": {
      "id": "steady",
      "name": "常陪",
      "sentence": "你不是靠一把大的证明自己，你是靠一直都在。",
      "keywords": [
        "细水长流",
        "常来常往",
        "陪伴感"
      ],
      "short": "你更相信持续出现的力量。慢慢坐实的位置，比一时热闹更让你安心。",
      "turnoff": "我天天在的地方，居然不记得我？那是你们不配。"
    },
    "heroic": {
      "id": "heroic",
      "name": "豪侠",
      "sentence": "你出手不只是为了一个人，你是来把整个场子托起来的。",
      "keywords": [
        "热场",
        "仗义",
        "交情"
      ],
      "short": "你花得舒服的时候，往往不只是某个人开心，而是整场气氛都被你抬起来。",
      "turnoff": "我把气氛托到这份上了，你们还冷着？不识抬举。"
    },
    "timing": {
      "id": "timing",
      "name": "卡点",
      "sentence": "你不乱冲，但你很会冲，最会挑那个值得出手的瞬间。",
      "keywords": [
        "时机",
        "节点",
        "刀刃"
      ],
      "short": "你不喜欢无效热闹。你更享受看准节点之后，一笔花在刀刃上的精准感。",
      "turnoff": "我看准的时机从不浪费，浪费的是你们不懂配合。"
    }
  },
  "combinationTemplates": {
    "burst": {
      "sentence": "{primaryName}·爆冲的你，平时未必时时亮牌，但真到{desire}被点燃的那一秒，你会把力道一次拉满。",
      "hiddenTitles": {
        "deep": "烈焰偏爱者",
        "saver": "绝地翻盘手",
        "ctrl": "闪电操盘手",
        "loyal": "烈焰守夜人",
        "myth": "一夜封神者",
        "rare": "孤品猎手",
        "king": "闪电君王",
        "clutch": "极限终结者"
      }
    },
    "steady": {
      "sentence": "{primaryName}·常陪的你，不靠一时热闹证明自己，而是用很多个夜晚把{desire}慢慢坐实。",
      "hiddenTitles": {
        "deep": "守夜偏爱者",
        "saver": "长线翻盘手",
        "ctrl": "长线操盘手",
        "loyal": "长明守夜人",
        "myth": "连载封神者",
        "rare": "年鉴收藏家",
        "king": "常驻君王",
        "clutch": "迟来终结者"
      }
    },
    "heroic": {
      "sentence": "{primaryName}·豪侠的你，出手不只是为了自己爽，也会把{desire}变成整个场子都能感到的气势。",
      "hiddenTitles": {
        "deep": "暖场偏爱者",
        "saver": "全场翻盘手",
        "ctrl": "全场操盘手",
        "loyal": "暖场守夜人",
        "myth": "全场封神者",
        "rare": "全场收藏家",
        "king": "全场君王",
        "clutch": "全场终结者"
      }
    },
    "timing": {
      "sentence": "{primaryName}·卡点的你，不乱冲，但很会挑时机；你要的是在最值得的一刻，让{desire}被所有人看见。",
      "hiddenTitles": {
        "deep": "等灯偏爱者",
        "saver": "精准翻盘手",
        "ctrl": "节点操盘手",
        "loyal": "等灯守夜人",
        "myth": "定格封神者",
        "rare": "限时收藏家",
        "king": "等灯君王",
        "clutch": "精准终结者"
      }
    }
  },
  "mirrorTagTone": {
    "排面欢迎": "你需要被明确看见、被列队欢迎",
    "私密欢迎": "你只在意少数人是否注意到你来了",
    "控场欢迎": "你一来，气氛就该起来",
    "记忆欢迎": "你要求别人记得你的喜好",
    "排面截图": "你会收藏排面被点亮的证据",
    "CP 截图": "你会留下和在意的人同框的瞬间",
    "热闹截图": "你喜欢把热闹留成可回看的证据",
    "收藏截图": "你对专属编号和印记很敏感",
    "专属位": "你对自己的位置和身份有明确要求",
    "控局位": "你天然会找能看清全局的位置",
    "靠近位": "你更想靠近真正重要的人",
    "热场位": "你喜欢站在能把气氛带起来的位置",
    "潜伏位": "你擅长等到最好的时机再出手",
    "灯": "你的出手像一盏灯，亮起来就有方向",
    "火": "你的出手像一把火，点到就能窜起来",
    "河": "你的出手像一条河，安静但一直在场",
    "刀": "你的出手像一把刀，收着时安静，出鞘时很准"
  },
  "questions": [
    {
      "id": 1,
      "type": "primary_regular",
      "prompt": "你刷了一波大的，最想看到啥？",
      "options": [
        {
          "label": "A",
          "text": "我在意的人，高兴、开心就行",
          "scores": [
            {
              "target": "deep",
              "points": 3
            },
            {
              "target": "loyal",
              "points": 1
            }
          ]
        },
        {
          "label": "B",
          "text": "逆转局面，打的就是心跳，偷的就是塔",
          "scores": [
            {
              "target": "saver",
              "points": 3
            },
            {
              "target": "clutch",
              "points": 1
            }
          ]
        },
        {
          "label": "C",
          "text": "全场整体氛围被带动起来，大家一起 high",
          "scores": [
            {
              "target": "ctrl",
              "points": 3
            },
            {
              "target": "king",
              "points": 1
            }
          ]
        },
        {
          "label": "D",
          "text": "震惊全座、激起一片惊叹声最舒心",
          "scores": [
            {
              "target": "king",
              "points": 3
            },
            {
              "target": "myth",
              "points": 1
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "type": "secondary_regular",
      "prompt": "你花钱的节奏是哪一种？",
      "options": [
        {
          "label": "A",
          "text": "平时无所谓怎么都行，关键时刻一把梭哈",
          "scores": [
            {
              "target": "burst",
              "points": 3
            },
            {
              "target": "timing",
              "points": 1
            }
          ]
        },
        {
          "label": "B",
          "text": "天天来，主打一个我在场子就不会断",
          "scores": [
            {
              "target": "steady",
              "points": 3
            },
            {
              "target": "heroic",
              "points": 1
            }
          ]
        },
        {
          "label": "C",
          "text": "看我心情，心情好，顺手烘托起来气氛",
          "scores": [
            {
              "target": "heroic",
              "points": 3
            },
            {
              "target": "steady",
              "points": 1
            }
          ]
        },
        {
          "label": "D",
          "text": "观察局势，不见兔子不撒鹰",
          "scores": [
            {
              "target": "timing",
              "points": 3
            },
            {
              "target": "burst",
              "points": 1
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "type": "mirror",
      "prompt": "你进房间，最想要哪种待遇？",
      "options": [
        {
          "label": "A",
          "text": "公屏整体列队欢迎我",
          "scores": [],
          "tag": "排面欢迎"
        },
        {
          "label": "B",
          "text": "我在意的人一眼看到我",
          "scores": [],
          "tag": "私密欢迎"
        },
        {
          "label": "C",
          "text": "我进来，房间的气氛就活跃起来",
          "scores": [],
          "tag": "控场欢迎"
        },
        {
          "label": "D",
          "text": "主播记得我的喜好，节目立刻就位",
          "scores": [],
          "tag": "记忆欢迎"
        }
      ]
    },
    {
      "id": 4,
      "type": "primary_regular",
      "prompt": "房间里突然冷场了，你会？",
      "options": [
        {
          "label": "A",
          "text": "没事，我等我在意的人说话就行",
          "scores": [
            {
              "target": "deep",
              "points": 3
            },
            {
              "target": "loyal",
              "points": 1
            }
          ]
        },
        {
          "label": "B",
          "text": "我来整个活儿，把气氛救回来",
          "scores": [
            {
              "target": "myth",
              "points": 3
            },
            {
              "target": "rare",
              "points": 1
            }
          ]
        },
        {
          "label": "C",
          "text": "安静等着呗，急什么，我又不是第一天来",
          "scores": [
            {
              "target": "loyal",
              "points": 3
            },
            {
              "target": "deep",
              "points": 1
            }
          ]
        },
        {
          "label": "D",
          "text": "直接点人上麦，场子不能塌",
          "scores": [
            {
              "target": "king",
              "points": 3
            },
            {
              "target": "ctrl",
              "points": 1
            }
          ]
        }
      ]
    },
    {
      "id": 5,
      "type": "secondary_regular",
      "prompt": "你最喜欢什么样的主播？",
      "options": [
        {
          "label": "A",
          "text": "情商高、让人情绪舒服的",
          "scores": [
            {
              "target": "heroic",
              "points": 2
            }
          ]
        },
        {
          "label": "B",
          "text": "嘴甜心甜，像吃了糖一样",
          "scores": [
            {
              "target": "steady",
              "points": 2
            }
          ]
        },
        {
          "label": "C",
          "text": "必须有两把刷子的才艺",
          "scores": [
            {
              "target": "timing",
              "points": 2
            }
          ]
        },
        {
          "label": "D",
          "text": "我口味独特，常常反其道行之",
          "scores": [
            {
              "target": "burst",
              "points": 2
            }
          ]
        }
      ]
    },
    {
      "id": 6,
      "type": "primary_regular",
      "prompt": "主播说要给你一个专属待遇，你最想要啥？",
      "options": [
        {
          "label": "A",
          "text": "和我戴情侣头像框、情侣座驾",
          "scores": [
            {
              "target": "deep",
              "points": 3
            },
            {
              "target": "loyal",
              "points": 1
            }
          ]
        },
        {
          "label": "B",
          "text": "用我的名字冠名她的房间",
          "scores": [
            {
              "target": "loyal",
              "points": 3
            },
            {
              "target": "rare",
              "points": 1
            }
          ]
        },
        {
          "label": "C",
          "text": "在个人页官宣锁定我",
          "scores": [
            {
              "target": "rare",
              "points": 3
            },
            {
              "target": "deep",
              "points": 1
            }
          ]
        },
        {
          "label": "D",
          "text": "当着全场和我甜蜜互动",
          "scores": [
            {
              "target": "myth",
              "points": 3
            },
            {
              "target": "king",
              "points": 1
            }
          ]
        }
      ]
    },
    {
      "id": 7,
      "type": "secondary_regular",
      "prompt": "你对各种榜单、活动的态度是？",
      "options": [
        {
          "label": "A",
          "text": "看心情，有时候打、有时候不打",
          "scores": [
            {
              "target": "timing",
              "points": 2
            }
          ]
        },
        {
          "label": "B",
          "text": "看活动策划质量，有喜欢的奖励就参加",
          "scores": [
            {
              "target": "burst",
              "points": 2
            }
          ]
        },
        {
          "label": "C",
          "text": "取决于我在意的人打不打这次活动",
          "scores": [
            {
              "target": "steady",
              "points": 2
            }
          ]
        },
        {
          "label": "D",
          "text": "控制子弹打出的节奏，有的参加有的就放弃",
          "scores": [
            {
              "target": "heroic",
              "points": 2
            }
          ]
        }
      ]
    },
    {
      "id": 8,
      "type": "mirror",
      "prompt": "你觉得你在语音房的风格更像哪个？",
      "options": [
        {
          "label": "A",
          "text": "一盏灯，亮了大家就知道不一样了",
          "scores": [],
          "tag": "灯"
        },
        {
          "label": "B",
          "text": "一把火，点着了直接窜起来",
          "scores": [],
          "tag": "火"
        },
        {
          "label": "C",
          "text": "一条河，不吵，但一直在流",
          "scores": [],
          "tag": "河"
        },
        {
          "label": "D",
          "text": "一把刀，平时收着，出鞘就很准",
          "scores": [],
          "tag": "刀"
        }
      ]
    },
    {
      "id": 9,
      "type": "primary_turnoff",
      "prompt": "哪种情况让你直接不玩了？",
      "options": [
        {
          "label": "A",
          "text": "主播对我和对别人一个样",
          "scores": [
            {
              "target": "deep",
              "points": 4
            }
          ]
        },
        {
          "label": "B",
          "text": "进房间，竟然没人认识我一样",
          "scores": [
            {
              "target": "king",
              "points": 4
            }
          ]
        },
        {
          "label": "C",
          "text": "房间才艺水平太差，感觉没玩头",
          "scores": [
            {
              "target": "loyal",
              "points": 4
            }
          ]
        },
        {
          "label": "D",
          "text": "以为限量版，结果人手一个",
          "scores": [
            {
              "target": "rare",
              "points": 4
            }
          ]
        }
      ]
    },
    {
      "id": 10,
      "type": "primary_discriminator",
      "prompt": "哪种爽感最对你胃口？",
      "options": [
        {
          "label": "A",
          "text": "眼看要塌的局，被我一把救活",
          "scores": [
            {
              "target": "saver",
              "points": 5
            },
            {
              "target": "clutch",
              "points": 1
            }
          ]
        },
        {
          "label": "B",
          "text": "最后一秒，我把结果钉死",
          "scores": [
            {
              "target": "clutch",
              "points": 5
            },
            {
              "target": "saver",
              "points": 1
            }
          ]
        },
        {
          "label": "C",
          "text": "全程都在我的节奏里走",
          "scores": [
            {
              "target": "ctrl",
              "points": 5
            },
            {
              "target": "king",
              "points": 1
            }
          ]
        },
        {
          "label": "D",
          "text": "我不需要动，大家自然先看我",
          "scores": [
            {
              "target": "king",
              "points": 5
            },
            {
              "target": "ctrl",
              "points": 1
            }
          ]
        }
      ]
    },
    {
      "id": 11,
      "type": "secondary_regular",
      "prompt": "你觉得直播在你的生活里扮演什么角色？",
      "options": [
        {
          "label": "A",
          "text": "小娱乐、生活的小点缀",
          "scores": [
            {
              "target": "timing",
              "points": 2
            }
          ]
        },
        {
          "label": "B",
          "text": "陪我喜欢的人和朋友，一种线上的社交空间",
          "scores": [
            {
              "target": "steady",
              "points": 2
            }
          ]
        },
        {
          "label": "C",
          "text": "我的挥洒舞台，墨镜一戴、座驾一起、我的场子",
          "scores": [
            {
              "target": "burst",
              "points": 2
            }
          ]
        },
        {
          "label": "D",
          "text": "玩一段时间又不玩了，过段时间又想玩了",
          "scores": [
            {
              "target": "heroic",
              "points": 2
            }
          ]
        }
      ]
    },
    {
      "id": 12,
      "type": "primary_regular",
      "prompt": "你最爱的主播今天 PK 要输了，你会？",
      "options": [
        {
          "label": "A",
          "text": "冲！我在的 PK 我必须赢",
          "scores": [
            {
              "target": "king",
              "points": 3
            },
            {
              "target": "saver",
              "points": 1
            }
          ]
        },
        {
          "label": "B",
          "text": "如果 ta 在意，我一定要打上去",
          "scores": [
            {
              "target": "deep",
              "points": 3
            },
            {
              "target": "loyal",
              "points": 1
            }
          ]
        },
        {
          "label": "C",
          "text": "理性算分，能打就打，不能就撤退",
          "scores": [
            {
              "target": "clutch",
              "points": 3
            },
            {
              "target": "ctrl",
              "points": 1
            }
          ]
        },
        {
          "label": "D",
          "text": "PK 没那么重要，就是玩儿，平常心",
          "scores": [
            {
              "target": "myth",
              "points": 3
            },
            {
              "target": "loyal",
              "points": 1
            }
          ]
        }
      ]
    }
  ],
  "tiebreakers": {
    "primaryDiscriminatorQuestionIds": [
      10
    ],
    "primaryTurnoffQuestionIds": [
      9
    ],
    "secondaryTurnoffQuestionIds": []
  }
};

  root.RMBTI_LITE_CONFIG = config;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = config;
  }
})(typeof window !== "undefined" ? window : globalThis);
