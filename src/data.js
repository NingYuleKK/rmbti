(function attachConfig(root) {
  const primaryOrder = ["deep", "saver", "ctrl", "loyal", "myth", "rare", "king", "clutch"];
  const secondaryOrder = ["burst", "steady", "heroic", "timing"];

  const primary = {
    deep: {
      id: "deep",
      name: "深情",
      code: "DEEP",
      sentence: "你买的不是热闹，是 TA 只向你亮起的一盏灯。",
      desire: "偏爱确认",
      keywords: ["偏爱", "私密", "例外"],
      color: "#0D1B2A",
      accent: "#C93A4E",
      imageSrc: "../assets/cards/card_deep.webp",
      long: "你在意的不是全场有多吵，而是某个重要的人是否把你从人群里单独认出来。你愿意出手，是为了确认那束光真的只照向你。",
      highlight: "TA 在热闹里单独点到你，或者用一句别人接不上的话回应你。",
      turnoff: "辜负深情的人，一文不值。"
    },
    saver: {
      id: "saver",
      name: "逆转",
      code: "SAVE-R",
      sentence: "你买的不是礼物，是局面因你改写的那一秒。",
      desire: "改命扭转",
      keywords: ["悬念", "翻盘", "拯救"],
      color: "#3D0000",
      accent: "#D5A33A",
      imageSrc: "../assets/cards/card_saver.webp",
      long: "你天然会被危机点吸引。越是局面要塌、倒计时越近，你越想证明自己不是旁观者，而是那个能把结局重新写一遍的人。",
      highlight: "眼看要输的局，因为你一笔下去重新活过来。",
      turnoff: "该翻盘的局翻不了，是你们不争气。"
    },
    ctrl: {
      id: "ctrl",
      name: "掌盘",
      code: "CTRL",
      sentence: "你买的不是礼物，是今晚往哪走由你说了算。",
      desire: "介入与控制",
      keywords: ["主导", "操盘", "指令感"],
      color: "#0D2B1A",
      accent: "#BFA65A",
      imageSrc: "../assets/cards/card_ctrl.webp",
      long: "你喜欢的不是单点热闹，而是场子的方向感开始响应你。你出手之后，节奏、路线、气氛都该变得更清晰。",
      highlight: "大家开始默认关键节点要看你的意思，局势按你的路线走。",
      turnoff: "不听调度的场子，不值得我费心。"
    },
    loyal: {
      id: "loyal",
      name: "长情",
      code: "LOYAL",
      sentence: "你买的不是一时上头，是时间站在你这边的证明。",
      desire: "长期留痕",
      keywords: ["陪伴", "沉淀", "年轮"],
      color: "#3A2414",
      accent: "#C7832C",
      imageSrc: "../assets/cards/card_loyal.webp",
      long: "你不急着用一次大动静证明自己。你更在意很多个夜晚之后，这里是否还留下你的名字、习惯和位置。",
      highlight: "过了一阵子再回来，场子里还保留着你的名字和痕迹。",
      turnoff: "不值得我久留的地方，我转身就走。"
    },
    myth: {
      id: "myth",
      name: "神话",
      code: "MYTH",
      sentence: "你买的不是礼物，是把一个普通夜晚点成传奇。",
      desire: "造景与传奇感",
      keywords: ["名场面", "故事", "电影感"],
      color: "#211238",
      accent: "#9F75FF",
      imageSrc: "../assets/cards/card_myth.webp",
      long: "你最在意的是一笔钱能不能让普通时刻升级成故事。你不是只要贵，你要的是以后大家还会提起那一幕。",
      highlight: "一个普通房间被你点成全场记住的名场面。",
      turnoff: "没有故事的夜晚，不配有我在场。"
    },
    rare: {
      id: "rare",
      name: "典藏",
      code: "RARE",
      sentence: "你买的不是贵，是别人没有而你拥有。",
      desire: "稀缺占有",
      keywords: ["唯一", "限量", "印记"],
      color: "#20242B",
      accent: "#CBD5E1",
      imageSrc: "../assets/cards/card_rare.webp",
      long: "你对稀缺和专属非常敏感。真正让你觉得值的，是别人拿不到、复制不了、过了这个节点就不会再有的身份印记。",
      highlight: "只此一份、只有你拿到的编号、徽章、身份或印记。",
      turnoff: "满大街都有的东西，配不上我的眼光。"
    },
    king: {
      id: "king",
      name: "君临",
      code: "KING",
      sentence: "你买的不是礼物，是全场抬头的那一秒。",
      desire: "中心性与排面",
      keywords: ["高位", "显圣", "全场目光"],
      color: "#0A0A0F",
      accent: "#D4AF37",
      imageSrc: "../assets/cards/card_king.webp",
      long: "你要的是存在感被集体承认。你不一定需要解释自己是谁，场子的反应应该替你完成介绍。",
      highlight: "你一出现，全场先静一秒，目光自然往你这里聚。",
      turnoff: "我的光环，汝等竟敢视而不见。"
    },
    clutch: {
      id: "clutch",
      name: "绝杀",
      code: "CLUTCH",
      sentence: "你买的不是礼物，是胜负线上的最后一击。",
      desire: "终局定音",
      keywords: ["压线", "收官", "一锤定音"],
      color: "#3A1A05",
      accent: "#F59E0B",
      imageSrc: "../assets/cards/card_clutch.webp",
      long: "你喜欢把力气留到真正决定结果的地方。别人可以热闹很久，但最后那个把胜负钉死的人，最好是你。",
      highlight: "最后一秒你把结果钉死，全场都知道这一下不能被替代。",
      turnoff: "最后一击没人能收，是这局不配有结尾。"
    }
  };

  const secondary = {
    burst: {
      id: "burst",
      name: "爆冲",
      sentence: "你不一定常出手，但真到那个点，你会狠狠干一把。",
      keywords: ["关键节点", "猛冲", "突然拉满"],
      short: "你的节奏不是平均分配，而是把能量攒到关键点一次打出去。",
      turnoff: "我这一把梭出去，场子接不住，是你们的问题。"
    },
    steady: {
      id: "steady",
      name: "常陪",
      sentence: "你不是靠一把大的证明自己，你是靠一直都在。",
      keywords: ["细水长流", "常来常往", "陪伴感"],
      short: "你更相信持续出现的力量。慢慢坐实的位置，比一时热闹更让你安心。",
      turnoff: "我天天在的地方，居然不记得我？那是你们不配。"
    },
    heroic: {
      id: "heroic",
      name: "豪侠",
      sentence: "你出手不只是为了一个人，你是来把整个场子托起来的。",
      keywords: ["热场", "仗义", "交情"],
      short: "你花得舒服的时候，往往不只是某个人开心，而是整场气氛都被你抬起来。",
      turnoff: "我把气氛托到这份上了，你们还冷着？不识抬举。"
    },
    timing: {
      id: "timing",
      name: "卡点",
      sentence: "你不乱冲，但你很会冲，最会挑那个值得出手的瞬间。",
      keywords: ["时机", "节点", "刀刃"],
      short: "你不喜欢无效热闹。你更享受看准节点之后，一笔花在刀刃上的精准感。",
      turnoff: "我看准的时机从不浪费，浪费的是你们不懂配合。"
    }
  };

  const combinationTemplates = {
    burst: {
      sentence: "{primaryName}·爆冲的你，平时未必时时亮牌，但真到{desire}被点燃的那一秒，你会把力道一次拉满。",
      hiddenTitles: {
        deep: "烈焰偏爱者",
        saver: "绝地翻盘手",
        ctrl: "闪电操盘手",
        loyal: "烈焰守夜人",
        myth: "一夜封神者",
        rare: "孤品猎手",
        king: "闪电君王",
        clutch: "极限终结者"
      }
    },
    steady: {
      sentence: "{primaryName}·常陪的你，不靠一时热闹证明自己，而是用很多个夜晚把{desire}慢慢坐实。",
      hiddenTitles: {
        deep: "守夜偏爱者",
        saver: "长线翻盘手",
        ctrl: "长线操盘手",
        loyal: "长明守夜人",
        myth: "连载封神者",
        rare: "年鉴收藏家",
        king: "常驻君王",
        clutch: "迟来终结者"
      }
    },
    heroic: {
      sentence: "{primaryName}·豪侠的你，出手不只是为了自己爽，也会把{desire}变成整个场子都能感到的气势。",
      hiddenTitles: {
        deep: "暖场偏爱者",
        saver: "全场翻盘手",
        ctrl: "全场操盘手",
        loyal: "暖场守夜人",
        myth: "全场封神者",
        rare: "全场收藏家",
        king: "全场君王",
        clutch: "全场终结者"
      }
    },
    timing: {
      sentence: "{primaryName}·卡点的你，不乱冲，但很会挑时机；你要的是在最值得的一刻，让{desire}被所有人看见。",
      hiddenTitles: {
        deep: "等灯偏爱者",
        saver: "精准翻盘手",
        ctrl: "节点操盘手",
        loyal: "等灯守夜人",
        myth: "定格封神者",
        rare: "限时收藏家",
        king: "等灯君王",
        clutch: "精准终结者"
      }
    }
  };

  const mirrorTagTone = {
    排面欢迎: "你需要被明确看见、被列队欢迎",
    私密欢迎: "你只在意少数人是否注意到你来了",
    控场欢迎: "你一来，气氛就该起来",
    记忆欢迎: "你要求别人记得你的喜好",
    排面截图: "你会收藏排面被点亮的证据",
    "CP 截图": "你会留下和在意的人同框的瞬间",
    热闹截图: "你喜欢把热闹留成可回看的证据",
    收藏截图: "你对专属编号和印记很敏感",
    专属位: "你对自己的位置和身份有明确要求",
    控局位: "你天然会找能看清全局的位置",
    靠近位: "你更想靠近真正重要的人",
    热场位: "你喜欢站在能把气氛带起来的位置",
    潜伏位: "你擅长等到最好的时机再出手",
    灯: "你的出手像一盏灯，亮起来就有方向",
    火: "你的出手像一把火，点到就能窜起来",
    河: "你的出手像一条河，安静但一直在场",
    刀: "你的出手像一把刀，收着时安静，出鞘时很准"
  };

  const q = (id, type, prompt, options) => ({ id, type, prompt, options });
  const score = (target, points) => ({ target, points });
  const option = (label, text, scores, tag) => ({ label, text, scores, tag });

  const questions = [
    // Q1 primary_regular
    q(1, "primary_regular", "你刷了一波大的，最想看到啥？", [
      option("A", "我在意的人，高兴、开心就行", [score("deep", 3), score("loyal", 1)]),
      option("B", "逆转局面，打的就是心跳，偷的就是塔", [score("saver", 3), score("clutch", 1)]),
      option("C", "全场整体氛围被带动起来，大家一起 high", [score("ctrl", 3), score("king", 1)]),
      option("D", "震惊全座、激起一片惊叹声最舒心", [score("king", 3), score("myth", 1)])
    ]),
    // Q2 secondary_regular
    q(2, "secondary_regular", "你喜欢什么风格的座驾？", [
      option("A", "人无我有，才是我的目标", [score("timing", 2)]),
      option("B", "豪华拉风、配得上我的气质的", [score("burst", 2)]),
      option("C", "我喜新厌旧，只挑最新的座驾", [score("burst", 1), score("timing", 1)]),
      option("D", "我喜欢能和我喜欢的人匹配的风格", [score("steady", 2)])
    ]),
    // Q3 mirror
    q(3, "mirror", "你进房间，最想要哪种待遇？", [
      option("A", "公屏整体列队欢迎我", [], "排面欢迎"),
      option("B", "我在意的人一眼看到我", [], "私密欢迎"),
      option("C", "我进来，房间的气氛就活跃起来", [], "控场欢迎"),
      option("D", "主播记得我的喜好，节目立刻就位", [], "记忆欢迎")
    ]),
    // Q4 secondary_regular
    q(4, "secondary_regular", "你花钱的节奏是哪一种？", [
      option("A", "平时无所谓怎么都行，关键时刻一把梭哈", [score("burst", 3), score("timing", 1)]),
      option("B", "天天来，主打一个我在场子就不会断", [score("steady", 3), score("heroic", 1)]),
      option("C", "看我心情，心情好，顺手烘托起来气氛", [score("heroic", 3), score("steady", 1)]),
      option("D", "观察局势，不见兔子不撒鹰", [score("timing", 3), score("burst", 1)])
    ]),
    // Q5 secondary_regular
    q(5, "secondary_regular", "你最下头的主播行为？", [
      option("A", "懒洋洋，毫无勤奋度", [score("steady", 2)]),
      option("B", "没情商，说话不把门", [score("heroic", 2)]),
      option("C", "咋咋呼呼，毫无特色", [score("timing", 2)]),
      option("D", "记忆不好、业务能力差", [score("burst", 2)])
    ]),
    // Q6（新增）secondary_regular
    q(6, "secondary_regular", "你最喜欢什么样的主播？", [
      option("A", "情商高、让人情绪舒服的", [score("heroic", 2)]),
      option("B", "嘴甜心甜，像吃了糖一样", [score("steady", 2)]),
      option("C", "必须有两把刷子的才艺", [score("timing", 2)]),
      option("D", "我口味独特，常常反其道行之", [score("burst", 2)])
    ]),
    // Q7 primary_regular
    q(7, "primary_regular", "房间里突然冷场了，你会？", [
      option("A", "没事，我等我在意的人说话就行", [score("deep", 3), score("loyal", 1)]),
      option("B", "我来整个活儿，把气氛救回来", [score("myth", 3), score("rare", 1)]),
      option("C", "安静等着呗，急什么，我又不是第一天来", [score("loyal", 3), score("deep", 1)]),
      option("D", "直接点人上麦，场子不能塌", [score("king", 3), score("ctrl", 1)])
    ]),
    // Q8 primary_regular
    q(8, "primary_regular", "主播说要给你一个专属待遇，你最想要啥？", [
      option("A", "和我戴情侣头像框、情侣座驾", [score("deep", 3), score("loyal", 1)]),
      option("B", "用我的名字冠名她的房间", [score("loyal", 3), score("rare", 1)]),
      option("C", "在个人页官宣锁定我", [score("rare", 3), score("deep", 1)]),
      option("D", "当着全场和我甜蜜互动", [score("myth", 3), score("king", 1)])
    ]),
    // Q9 secondary_regular
    q(9, "secondary_regular", "你喜欢什么风格的房间？", [
      option("A", "安静的、文艺的、可以好好待会儿的", [score("steady", 2)]),
      option("B", "热闹的、大家能聊得很开心、玩得好", [score("heroic", 2)]),
      option("C", "沙雕的、和深井冰在一起最开心", [score("burst", 2)]),
      option("D", "当然是声色狗马，越夜越开心的那种", [score("heroic", 1), score("burst", 1)])
    ]),
    // Q10 mirror
    q(10, "mirror", "今晚只能截一张图，你截哪个？", [
      option("A", "截图豪华排面或者飘屏", [], "排面截图"),
      option("B", "和我在意的人凑成一对儿的截图", [], "CP 截图"),
      option("C", "大家一起 High、或者一起搞怪", [], "热闹截图"),
      option("D", "只属于我的特殊排面，比如我的座驾、我的特效", [], "收藏截图")
    ]),
    // Q11 primary_turnoff
    q(11, "primary_turnoff", "哪种情况让你直接不玩了？", [
      option("A", "主播对我和对别人一个样", [score("deep", 4)]),
      option("B", "进房间，竟然没人认识我一样", [score("king", 4)]),
      option("C", "房间才艺水平太差，感觉没玩头", [score("loyal", 4)]),
      option("D", "以为限量版，结果人手一个", [score("rare", 4)])
    ]),
    // Q12 primary_discriminator
    q(12, "primary_discriminator", "哪种爽感最对你胃口？", [
      option("A", "眼看要塌的局，被我一把救活", [score("saver", 5), score("clutch", 1)]),
      option("B", "最后一秒，我把结果钉死", [score("clutch", 5), score("saver", 1)]),
      option("C", "全程都在我的节奏里走", [score("ctrl", 5), score("king", 1)]),
      option("D", "我不需要动，大家自然先看我", [score("king", 5), score("ctrl", 1)])
    ]),
    // Q13 secondary_regular
    q(13, "secondary_regular", "你的昵称是哪种风格？", [
      option("A", "抽象搞怪", [score("burst", 2)]),
      option("B", "豪迈的、特殊的、反映我的风采", [score("heroic", 2)]),
      option("C", "本色演出的昵称", [score("steady", 2)]),
      option("D", "取决于最近我喜欢和谁玩", [score("steady", 1), score("timing", 1)])
    ]),
    // Q14 mirror
    q(14, "mirror", "你在房间里，一般喜欢待在什么地方？", [
      option("A", "必须坐在我的专属席位", [], "专属位"),
      option("B", "挨着我喜欢的人坐", [], "靠近位"),
      option("C", "麦下待着，轻易不上麦", [], "潜伏位"),
      option("D", "看情况决定", [], "控局位")
    ]),
    // Q15 secondary_regular
    q(15, "secondary_regular", "你对各种榜单、活动的态度是？", [
      option("A", "看心情，有时候打、有时候不打", [score("timing", 2)]),
      option("B", "看活动策划质量，有喜欢的奖励就参加", [score("burst", 2)]),
      option("C", "取决于我在意的人打不打这次活动", [score("steady", 2)]),
      option("D", "控制子弹打出的节奏，有的参加有的就放弃", [score("heroic", 2)])
    ]),
    // Q16 mirror
    q(16, "mirror", "你觉得你在语音房的风格更像哪个？", [
      option("A", "一盏灯，亮了大家就知道不一样了", [], "灯"),
      option("B", "一把火，点着了直接窜起来", [], "火"),
      option("C", "一条河，不吵，但一直在流", [], "河"),
      option("D", "一把刀，平时收着，出鞘就很准", [], "刀")
    ]),
    // Q17 secondary_regular
    q(17, "secondary_regular", "你觉得直播在你的生活里扮演什么角色？", [
      option("A", "小娱乐、生活的小点缀", [score("timing", 2)]),
      option("B", "陪我喜欢的人和朋友，一种线上的社交空间", [score("steady", 2)]),
      option("C", "我的挥洒舞台，墨镜一戴、座驾一起、我的场子", [score("burst", 2)]),
      option("D", "玩一段时间又不玩了，过段时间又想玩了", [score("heroic", 2)])
    ]),
    // Q18 primary_regular
    q(18, "primary_regular", "你最爱的主播今天 PK 要输了，你会？", [
      option("A", "冲！我在的 PK 我必须赢", [score("king", 3), score("saver", 1)]),
      option("B", "如果 ta 在意，我一定要打上去", [score("deep", 3), score("loyal", 1)]),
      option("C", "理性算分，能打就打，不能就撤退", [score("clutch", 3), score("ctrl", 1)]),
      option("D", "PK 没那么重要，就是玩儿，平常心", [score("myth", 3), score("loyal", 1)])
    ])
  ];

  const config = {
    title: "RMBTI 老板出手人格测试",
    subtitle: "测测你在场子里，是哪一张老板牌",
    helper: ["2-3 分钟", "18 题", "主牌 + 副签"],
    introMessages: [
      "正在洗牌……",
      "正在读取你的出手气场……",
      "主牌即将显影……",
      "请进入老板席。"
    ],
    homeCardIds: ["king", "deep", "myth"],
    primaryOrder,
    secondaryOrder,
    primary,
    secondary,
    combinationTemplates,
    mirrorTagTone,
    questions,
    tiebreakers: {
      primaryDiscriminatorQuestionIds: [12],
      primaryTurnoffQuestionIds: [11],
      secondaryTurnoffQuestionIds: []
    }
  };

  root.RMBTI_CONFIG = config;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = config;
  }
})(typeof window !== "undefined" ? window : globalThis);
