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
      long: "你在意的不是全场有多吵，而是某个重要的人是否把你从人群里单独认出来。你愿意出手，是为了确认那束光真的只照向你。",
      highlight: "TA 在热闹里单独点到你，或者用一句别人接不上的话回应你。",
      turnoff: "你最受不了自己和别人没有区别，尤其是对方转身又去逢迎别人。"
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
      long: "你天然会被危机点吸引。越是局面要塌、倒计时越近，你越想证明自己不是旁观者，而是那个能把结局重新写一遍的人。",
      highlight: "眼看要输的局，因为你一笔下去重新活过来。",
      turnoff: "明明有机会扳回来，系统、人和场子却没有任何一个接住。"
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
      long: "你喜欢的不是单点热闹，而是场子的方向感开始响应你。你出手之后，节奏、路线、气氛都该变得更清晰。",
      highlight: "大家开始默认关键节点要看你的意思，局势按你的路线走。",
      turnoff: "你想带节奏时，所有人却各玩各的，没人进入同一个盘面。"
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
      long: "你不急着用一次大动静证明自己。你更在意很多个夜晚之后，这里是否还留下你的名字、习惯和位置。",
      highlight: "过了一阵子再回来，场子里还保留着你的名字和痕迹。",
      turnoff: "你断断续续陪了很久，最后却什么专属、名字和痕迹都没留下。"
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
      long: "你最在意的是一笔钱能不能让普通时刻升级成故事。你不是只要贵，你要的是以后大家还会提起那一幕。",
      highlight: "一个普通房间被你点成全场记住的名场面。",
      turnoff: "画面看着挺贵，实际没有故事，也没有任何以后会被讲起的瞬间。"
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
      long: "你对稀缺和专属非常敏感。真正让你觉得值的，是别人拿不到、复制不了、过了这个节点就不会再有的身份印记。",
      highlight: "只此一份、只有你拿到的编号、徽章、身份或印记。",
      turnoff: "你以为拿到的是唯一，结果转头发现人手一份。"
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
      long: "你要的是存在感被集体承认。你不一定需要解释自己是谁，场子的反应应该替你完成介绍。",
      highlight: "你一出现，全场先静一秒，目光自然往你这里聚。",
      turnoff: "你进场时没有像样的欢迎，甚至像没人记得你。"
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
      long: "你喜欢把力气留到真正决定结果的地方。别人可以热闹很久，但最后那个把胜负钉死的人，最好是你。",
      highlight: "最后一秒你把结果钉死，全场都知道这一下不能被替代。",
      turnoff: "胜负线已经到了，却没有人把结果定下来。"
    }
  };

  const secondary = {
    burst: {
      id: "burst",
      name: "爆冲",
      sentence: "你不一定常出手，但真到那个点，你会狠狠干一把。",
      keywords: ["关键节点", "猛冲", "突然拉满"],
      short: "你的节奏不是平均分配，而是把能量攒到关键点一次打出去。",
      turnoff: "你攒到关键时刻才出手，结果场子没有接住那一下。"
    },
    steady: {
      id: "steady",
      name: "常陪",
      sentence: "你不是靠一把大的证明自己，你是靠一直都在。",
      keywords: ["细水长流", "常来常往", "陪伴感"],
      short: "你更相信持续出现的力量。慢慢坐实的位置，比一时热闹更让你安心。",
      turnoff: "你明明常来常在，最后却像谁都不记得你。"
    },
    heroic: {
      id: "heroic",
      name: "豪侠",
      sentence: "你出手不只是为了一个人，你是来把整个场子托起来的。",
      keywords: ["热场", "仗义", "交情"],
      short: "你花得舒服的时候，往往不只是某个人开心，而是整场气氛都被你抬起来。",
      turnoff: "你想把气氛托起来，大家却还是冷冷的、各玩各的。"
    },
    timing: {
      id: "timing",
      name: "卡点",
      sentence: "你不乱冲，但你很会冲，最会挑那个值得出手的瞬间。",
      keywords: ["时机", "节点", "刀刃"],
      short: "你不喜欢无效热闹。你更享受看准节点之后，一笔花在刀刃上的精准感。",
      turnoff: "你明明看准了点，系统、场子或者人却浪费了那个节点。"
    }
  };

  const combinationTemplates = {
    burst: "{primaryName}·爆冲的你，平时未必时时亮牌，但真到{desire}被点燃的那一秒，你会把力道一次拉满。",
    steady: "{primaryName}·常陪的你，不靠一时热闹证明自己，而是用很多个夜晚把{desire}慢慢坐实。",
    heroic: "{primaryName}·豪侠的你，出手不只是为了自己爽，也会把{desire}变成整个场子都能感到的气势。",
    timing: "{primaryName}·卡点的你，不乱冲，但很会挑时机；你要的是在最值得的一刻，让{desire}被所有人看见。"
  };

  const mirrorTagTone = {
    公屏欢迎: "你需要被明确看见",
    默契欢迎: "你在意熟悉感和私密暗号",
    起势欢迎: "你一来就会带动场子的气",
    熟门熟路: "你喜欢别人记得上一次的连接",
    排面截图: "你会收藏排面被点亮的证据",
    点名截图: "你会记住那个只属于你的点名瞬间",
    热闹截图: "你喜欢把热闹留成可回看的证据",
    收藏截图: "你对专属编号和印记很敏感",
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
    q(1, "primary_regular", "你送出一份重礼后，最想看到哪种反应？", [
      option("A", "我在意的人只回给我一句别人接不上来的话", [score("deep", 3), score("loyal", 1)]),
      option("B", "本来要塌的局，被我一手扳了回来", [score("saver", 3), score("clutch", 1)]),
      option("C", "接下来场子怎么走，开始按我的意思变化", [score("ctrl", 3), score("king", 1)]),
      option("D", "全场先静一秒，接着所有人都知道这一笔是谁打的", [score("king", 3), score("myth", 1)])
    ]),
    q(2, "primary_regular", "同样的预算，你更愿意把钱砸在哪种瞬间？", [
      option("A", "我在意的人在人群里偏偏点了我的名字", [score("deep", 3), score("king", 1)]),
      option("B", "倒计时最后几秒，眼看要输的局被我硬生生翻回来", [score("saver", 3), score("clutch", 1)]),
      option("C", "一个普通房间，被我点成今晚谁都忘不了的名场面", [score("myth", 3), score("king", 1)]),
      option("D", "只此一份、过了今晚就不会再有的身份印记", [score("rare", 3), score("loyal", 1)])
    ]),
    q(3, "mirror", "如果你进场时系统只能替你做一件小事，你更希望是哪一种？", [
      option("A", "公屏明确点名欢迎你回来了", [], "公屏欢迎"),
      option("B", "我在意的人熟门熟路地说一句“你来了”", [], "默契欢迎"),
      option("C", "场子自然热起来，大家都知道熟人到了", [], "起势欢迎"),
      option("D", "不用太吵，但有人立刻接上你上次的话题", [], "熟门熟路")
    ]),
    q(4, "primary_regular", "你更希望自己在一个场子里，以哪种方式被记住？", [
      option("A", "TA 不一定会当众表现，但会优先记得我来了", [score("loyal", 3), score("deep", 1)]),
      option("B", "大家都知道，很多事得看我想不想让它发生", [score("ctrl", 3), score("king", 1)]),
      option("C", "我一进场，不用多说，气氛和目光自然往我这边聚", [score("king", 3), score("myth", 1)]),
      option("D", "真到场面快不行的时候，大家知道谁能把它救回来", [score("saver", 3), score("clutch", 1)])
    ]),
    q(5, "secondary_regular", "如果你一周都待在同一个场子里，你的出手节奏更像哪一种？", [
      option("A", "平时不一定常动，真到关键时刻我会狠狠干一把", [score("burst", 3), score("timing", 1)]),
      option("B", "我会常来常在，今天一点、明天一点，慢慢把位置坐实", [score("steady", 3), score("heroic", 1)]),
      option("C", "我喜欢顺手把气氛托起来，让场子一直有人味儿", [score("heroic", 3), score("steady", 1)]),
      option("D", "我会先看局势和节点，等最值得的那一下再出手", [score("timing", 3), score("burst", 1)])
    ]),
    q(6, "primary_discriminator", "下面哪种“值钱”，更让你愿意加码？", [
      option("A", "TA 当下只看见我，其他人都退成背景", [score("deep", 5), score("loyal", 1)]),
      option("B", "过一阵子再回来，这个场子里还留着我的名字和痕迹", [score("loyal", 5), score("deep", 1)]),
      option("C", "今晚被点成了一个以后还会被反复提起的名场面", [score("myth", 5), score("king", 1)]),
      option("D", "我一出现，所有人的目光先落到我身上", [score("king", 5), score("myth", 1)])
    ]),
    q(7, "primary_regular", "如果今晚只能留下一种记忆，你更想留下哪一种？", [
      option("A", "TA 以后想起今晚，会知道我和别人不一样", [score("deep", 3), score("loyal", 1)]),
      option("B", "那个本来平平无奇的夜晚，后来成了大家嘴里的名场面", [score("myth", 3), score("king", 1)]),
      option("C", "这局是在最后时刻，被我一脚定下来的", [score("clutch", 3), score("saver", 1)]),
      option("D", "过了一阵子再回来，这里还有我的名字和痕迹", [score("loyal", 3), score("rare", 1)])
    ]),
    q(8, "mirror", "如果今晚只能截一张图，你更想留哪一张？", [
      option("A", "榜上高亮或飘屏那一秒", [], "排面截图"),
      option("B", "我在意的人单独点到我名字那一秒", [], "点名截图"),
      option("C", "全场最热闹、所有人都在场的名场面", [], "热闹截图"),
      option("D", "只属于我的编号、徽章或印记", [], "收藏截图")
    ]),
    q(9, "primary_turnoff", "最让你瞬间下头的是哪种情况？", [
      option("A", "我在意的人对我和对别人没区别，转身还去逢迎别人", [score("deep", 4)]),
      option("B", "我一进场，连句像样的欢迎都没有，像没人记得我", [score("king", 4)]),
      option("C", "我断断续续陪了这么久，最后什么名字、痕迹、专属都没留下", [score("loyal", 4)]),
      option("D", "我以为拿到的是唯一，结果转头就人手一份", [score("rare", 4)])
    ]),
    q(10, "secondary_regular", "同样一笔预算，你更愿意怎么花？", [
      option("A", "先攒着，等真到高光时刻再狠狠干一笔", [score("burst", 3), score("timing", 1)]),
      option("B", "拆开来花，别断，重要的是让对方一直感受到我在", [score("steady", 3), score("heroic", 1)]),
      option("C", "优先花在能把场子带热、把大家都带进状态的地方", [score("heroic", 3), score("steady", 1)]),
      option("D", "只花在最值、最准、最能起作用的节点上", [score("timing", 3), score("burst", 1)])
    ]),
    q(11, "primary_discriminator", "下面哪种“爽”，更像你？", [
      option("A", "眼看要塌的局，被我一把救活", [score("saver", 5), score("clutch", 1)]),
      option("B", "最后一秒，我把结果钉死", [score("clutch", 5), score("saver", 1)]),
      option("C", "全程都在我的节奏里走", [score("ctrl", 5), score("king", 1)]),
      option("D", "我不需要动太多，大家自然先看我", [score("king", 5), score("ctrl", 1)])
    ]),
    q(12, "primary_regular", "如果系统只能给你一种长期回报，你更想要哪一种？", [
      option("A", "以后回来这里还留着我的名字和痕迹", [score("loyal", 3), score("rare", 1)]),
      option("B", "一个只属于我、别人拿不到的编号或印记", [score("rare", 3), score("loyal", 1)]),
      option("C", "我点过的那个场面，后来还会被反复提起", [score("myth", 3), score("king", 1)]),
      option("D", "我在意的人会默默记得我来过，不必每次都摆在明面上", [score("deep", 3), score("loyal", 1)])
    ]),
    q(13, "mirror", "同一个场子里，你更喜欢待在哪种位置？", [
      option("A", "一眼能看清全场和动线的位置", [], "控局位"),
      option("B", "靠近我在意的人、能随时接上话的位置", [], "靠近位"),
      option("C", "人来人往、最容易把气氛带起来的位置", [], "热场位"),
      option("D", "不太显眼，但能等到最好时机的位置", [], "潜伏位")
    ]),
    q(14, "secondary_regular", "哪一种出手方式，最像你心里“花得舒服”的状态？", [
      option("A", "我不怎么出手就算了，一出手就得让人记住", [score("burst", 3), score("timing", 1)]),
      option("B", "不用每次都大，但我在的时候，TA 慢慢会习惯我的存在", [score("steady", 3), score("heroic", 1)]),
      option("C", "我一搭手，整个场子都顺起来、热起来", [score("heroic", 3), score("steady", 1)]),
      option("D", "我最爽的是看准时机，出手刚好，钱一分都没白花", [score("timing", 3), score("burst", 1)])
    ]),
    q(15, "primary_turnoff", "最让你觉得“这局没意思了”的是哪一种？", [
      option("A", "明明有机会扳回来，结果系统、人和场子谁都没接住", [score("saver", 4)]),
      option("B", "最后的线都到了，结果没人把结果定下来", [score("clutch", 4)]),
      option("C", "我想带节奏，结果所有人都在各玩各的", [score("ctrl", 4)]),
      option("D", "画面看着挺贵，实际一点故事都没有", [score("myth", 4)])
    ]),
    q(16, "primary_regular", "你更愿意让别人怎么谈论你？", [
      option("A", "TA 对我是真的不一样", [score("deep", 3), score("loyal", 1)]),
      option("B", "这个人平时不显山露水，但关键时刻真能救场", [score("saver", 3), score("clutch", 1)]),
      option("C", "那晚就是被我点成名场面的", [score("myth", 3), score("king", 1)]),
      option("D", "那件东西最后被我拿到了，别人没有", [score("rare", 3), score("loyal", 1)])
    ]),
    q(17, "secondary_turnoff", "最让你下头的一种出手体验是？", [
      option("A", "我都憋到关键时刻狠狠干了，结果场子根本没接住", [score("burst", 4)]),
      option("B", "我明明常来常在，最后却像谁都不记得我", [score("steady", 4)]),
      option("C", "我想把气氛托起来，结果大家还是冷冷的、各玩各的", [score("heroic", 4)]),
      option("D", "我明明看准了点，结果系统、场子或者人浪费了那个节点", [score("timing", 4)])
    ]),
    q(18, "mirror", "如果把你的出手比作一样东西，你更认哪一种？", [
      option("A", "一盏灯，亮起来大家就知道不一样了", [], "灯"),
      option("B", "一把火，点到了就会一下子窜起来", [], "火"),
      option("C", "一条河，平时不吵，但一直在流", [], "河"),
      option("D", "一把刀，平时收着，出鞘就很准", [], "刀")
    ]),
    q(19, "primary_discriminator", "下面哪种落差更让你不爽？", [
      option("A", "明明是我出的，结果没人知道", [score("king", 5), score("rare", 1)]),
      option("B", "明明说好是唯一，结果很快人人都有", [score("rare", 5), score("king", 1)]),
      option("C", "明明一直都有我，结果最后没留下任何名字", [score("loyal", 5), score("deep", 1)]),
      option("D", "明明 TA 应该记得我，结果还是把我当其中之一", [score("deep", 5), score("loyal", 1)])
    ]),
    q(20, "primary_regular", "如果今晚只能给自己带走一枚勋章，你更想是哪一枚？", [
      option("A", "常来常在，留下痕迹", [score("loyal", 3), score("rare", 1)]),
      option("B", "只此一份，没人复制", [score("rare", 3), score("king", 1)]),
      option("C", "名场面制造者", [score("myth", 3), score("king", 1)]),
      option("D", "最后一击定音者", [score("clutch", 3), score("saver", 1)])
    ])
  ];

  const config = {
    title: "RMBTI 人民币人格测试",
    subtitle: "测测你花钱时，最想让世界回给你什么。",
    helper: ["2-3 分钟", "20 题", "主牌 + 副签"],
    primaryOrder,
    secondaryOrder,
    primary,
    secondary,
    combinationTemplates,
    mirrorTagTone,
    questions,
    tiebreakers: {
      primaryDiscriminatorQuestionIds: [6, 11, 19],
      primaryTurnoffQuestionIds: [9, 15],
      secondaryTurnoffQuestionIds: [17]
    }
  };

  root.RMBTI_CONFIG = config;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = config;
  }
})(typeof window !== "undefined" ? window : globalThis);
