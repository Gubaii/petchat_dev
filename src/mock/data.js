// 宠物虚拟数据
export const petData = {
  id: 'pet-001',
  name: '一点点',
  type: '仓鼠',
  breed: '侏儒仓鼠',
  age: 1,
  gender: '公',
  birthday: '2023-05-15',
  adoptionDate: '2023-06-20',
  avatar: 'https://images.pexels.com/photos/4520481/pexels-photo-4520481.jpeg?auto=compress&cs=tinysrgb&w=600',
  voice: {
    type: '轻快活泼',
    speed: 1.2,
    pitch: 1.5,
  },
  personality: ['活泼好动', '好奇', '喜欢储存食物'],
  languageStyle: '欢快可爱',
  interests: ['跑轮运动', '挖洞', '收集食物'],
  healthStatus: '良好',
  lastActive: Date.now() - 1800000, // 30分钟前
};

// 所有宠物数据
export const allPetsData = [
  {
    id: 'pet-001',
    name: '一点点',
    type: '仓鼠',
    breed: '侏儒仓鼠',
    age: 1,
    gender: '公',
    birthday: '2023-05-15',
    adoptionDate: '2023-06-20',
    avatar: '/assets/images/hamster-avatar.jpeg',
    voice: {
      type: '轻快活泼',
      speed: 1.2,
      pitch: 1.5,
    },
    personality: ['活泼好动', '好奇', '喜欢储存食物'],
    languageStyle: '欢快可爱',
    interests: ['跑轮运动', '挖洞', '收集食物'],
    healthStatus: '良好',
    lastActive: Date.now() - 1800000,
    lastMessage: '吱吱~主人，我好想你啊！什么时候回来？',
    lastMessageTime: '12:30'
  },
  {
    id: 'pet-002',
    name: '阿努比斯',
    type: '猫',
    breed: '英国短毛猫',
    age: 2,
    gender: '母',
    birthday: '2022-03-10',
    adoptionDate: '2022-04-15',
    avatar:'/assets/images/cat-avatar.jpeg',
    voice: {
      type: '优雅甜美',
      speed: 1.0,
      pitch: 1.3,
    },
    personality: ['高傲', '优雅', '独立', '爱干净'],
    languageStyle: '美少女战士风格',
    interests: ['晒太阳', '抓老鼠', '捉逗猫棒'],
    healthStatus: '良好',
    lastActive: Date.now() - 900000, // 15分钟前
    lastMessage: '以月亮的名义，我要惩罚你的迟到喵！晚饭呢？',
    lastMessageTime: '17:45'
  },
  {
    id: 'pet-003',
    name: '咪咕',
    type: '狗',
    breed: '柴犬',
    age: 3,
    gender: '公',
    birthday: '2021-06-20',
    adoptionDate: '2021-08-10',
    avatar: '/assets/images/dog-avatar.jpeg',
    voice: {
      type: '诙谐幽默',
      speed: 1.4,
      pitch: 1.1,
    },
    personality: ['忠诚', '机智', '活泼', '幽默'],
    languageStyle: '郭德纲相声风格',
    interests: ['散步', '捡球', '看家护院'],
    healthStatus: '良好',
    lastActive: Date.now() - 600000, // 10分钟前
    lastMessage: '您瞧瞧，这日子过的，连根骨头都没有，惨啊！',
    lastMessageTime: '18:20'
  },
  {
    id: 'pet-004',
    name: '刘看山',
    type: '荷兰猪',
    breed: '英国荷兰猪',
    age: 1,
    gender: '母',
    birthday: '2023-01-05',
    adoptionDate: '2023-02-15',
    avatar: '/assets/images/pig-avatar.jpeg',
    voice: {
      type: '憨厚可爱',
      speed: 0.9,
      pitch: 1.6,
    },
    personality: ['胆小', '温顺', '贪吃', '蠢萌'],
    languageStyle: '蠢萌憨厚风格',
    interests: ['吃蔬菜', '钻纸箱', '咕噜咕噜叫'],
    healthStatus: '良好',
    lastActive: Date.now() - 1200000, // 20分钟前
    lastMessage: '咕噜咕噜~我刚刚把自己卡在纸箱里了...救命...',
    lastMessageTime: '16:50'
  }
];

// 消息虚拟数据
export const messageData = [
  // 前天的消息
  {
    id: 'msg-past-001',
    type: 'system',
    contentType: 'text',
    content: '周一健康提醒：豆豆的饮水量略低于平均水平，建议多关注饮水情况。',
    timestamp: Date.now() - 36 * 3600 * 1000 - 12 * 3600 * 1000, // 前天
    read: true,
    category: 'alert',
    urgent: 1,
  },
  {
    id: 'msg-past-002',
    type: 'pet',
    contentType: 'voice',
    content: '吱！闹钟响第三次了，再不起床你全勤奖没了...唔...其实我也刚醒... ',
    timestamp: Date.now() - 36 * 3600 * 1000 - 11 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',  // 原来是 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3'
    duration: 3,
  },
  {
    id: 'msg-past-003',
    type: 'user',
    contentType: 'voice',
    content: '豆豆，你今天要记得喝足够的水？我看系统提醒你最近饮水量不足。',
    timestamp: Date.now() - 36 * 3600 * 1000 - 10.9 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',  // 原来是 'https://assets.mixkit.co/active_storage/sfx/2448/2448-preview.mp3'
    duration: 3,
  },
  {
    id: 'msg-past-004',
    type: 'pet',
    contentType: 'voice',
    content: '知道了知道了，你快去赚钱吧！',
    timestamp: Date.now() - 36 * 3600 * 1000 - 10.8 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',  // 原来是 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3'
    duration: 2,
  },
 
  {
    id: 'msg-past-005',
    type: 'user',
    contentType: 'voice',
    content: '那我一会儿给你准备一些黄瓜片和生菜叶，你要乖乖吃完哦！记得多喝水对身体好！',
    timestamp: Date.now() - 36 * 3600 * 1000 - 10.7 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',  // 原来是 'https://assets.mixkit.co/active_storage/sfx/2448/2448-preview.mp3'
    duration: 4,
  },
  
  {
    id: 'msg-past-006',
    type: 'pet',
    contentType: 'image',
    content: '主人看，我整理好我的小窝了！',
    timestamp: Date.now() - 36 * 3600 * 1000 - 6 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://images.pexels.com/photos/8891758/pexels-photo-8891758.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  
  // 昨天的消息
  {
    id: 'msg-yesterday-001',
    type: 'system',
    contentType: 'text',
    content: '豆豆的日报已生成，昨天总活动时间4.2小时，较平时增加15%，健康状况良好。',
    timestamp: Date.now() - 24 * 3600 * 1000 - 10 * 3600 * 1000,
    read: true,
    category: 'daily',
    urgent: 0,
  },
  {
    id: 'msg-yesterday-002',
    type: 'pet',
    contentType: 'voice',
    content: '勇哥，我今天听到了个好玩的歌，分享给你听听！',
    timestamp: Date.now() - 24 * 3600 * 1000 - 9 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 4,
  },
  {
    id: 'msg-yesterday-003',
    type: 'pet',
    contentType: 'voice',
    content: '老鼠怕猫！那是谣传！一只小猫！有啥可怕！壮起鼠胆！把猫打翻！千古偏见！一定推翻！',
    timestamp: Date.now() - 24 * 3600 * 1000 - 8.9 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '/audio/ratMusic.mp3',
    duration: 3,
  },
  {
    id: 'msg-yesterday-0031',
    type: 'pet',
    contentType: 'voice',
    content: '好听吧？，，，你怎么不说话了？',
    timestamp: Date.now() - 24 * 3600 * 1000 - 8.9 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '/public/audio/ratMusic.mp3',
    duration: 3,
  },
  {
    id: 'msg-yesterday-004',
    type: 'user',
    contentType: 'image',
    content: '我买了新的小零食，明天带给你尝尝！',
    timestamp: Date.now() - 24 * 3600 * 1000 - 8.8 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://images.pexels.com/photos/6957449/pexels-photo-6957449.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'msg-yesterday-005',
    type: 'pet',
    contentType: 'voice',
    content: '哇！看起来好好吃！我最喜欢尝试新食物了！谢谢主人！',
    timestamp: Date.now() - 24 * 3600 * 1000 - 8.7 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 3,
  },
  {
    id: 'msg-yesterday-006',
    type: 'user',
    contentType: 'voice',
    content: '豆豆，你今天有玩你的新迷宫吗？我特意给你挑选的，希望你会喜欢！',
    timestamp: Date.now() - 24 * 3600 * 1000 - 6 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 3,
  },
  {
    id: 'msg-yesterday-007',
    type: 'pet',
    contentType: 'video',
    content: '玩了！我已经找到穿过迷宫的捷径啦，主人看我多聪明！',
    timestamp: Date.now() - 24 * 3600 * 1000 - 5.9 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://vd3.bdstatic.com/mda-neqraqq8h8an23ei/720p/h264/1653385969639200280/mda-neqraqq8h8an23ei.mp4',
  },
  
  // 今天的消息
  {
    id: 'msg-001',
    type: 'system',
    contentType: 'text',
    content: '早上好！今天是周二，气温22-28°C，阳光明媚，适合让豆豆在阳光下活动一下哦！',
    timestamp: Date.now() - 10 * 3600 * 1000, // 10小时前
    read: true,
    category: 'chat',
    urgent: 0,
  },
  {
    id: 'msg-002',
    type: 'pet',
    contentType: 'voice',
    content: '主人早上好！我昨晚在跑轮上跑了好久呢，好开心！',
    timestamp: Date.now() - 9.9 * 3600 * 1000, // 9小时58分钟前
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 3,
  },
  {
    id: 'msg-audio-001',
    type: 'pet',
    contentType: 'audio',
    content: '',
    timestamp: Date.now() - 9.85 * 3600 * 1000, // 9小时51分钟前
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 2,
  },
  {
    id: 'msg-003',
    type: 'user',
    contentType: 'voice',
    content: '豆豆早上好，今天有好好吃饭吗？你最喜欢的葵花籽我又买了一大包！',
    timestamp: Date.now() - 9.8 * 3600 * 1000, // 9小时56分钟前
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 4,
  },
  {
    id: 'msg-audio-002',
    type: 'user',
    contentType: 'audio',
    content: '',
    timestamp: Date.now() - 9.75 * 3600 * 1000, // 9小时45分钟前
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 3,
  },
  {
    id: 'msg-004',
    type: 'pet',
    contentType: 'voice',
    content: '当然啦！我把葵花籽和小麦片全部吃完了，还把一些藏在了小窝里~',
    timestamp: Date.now() - 9.7 * 3600 * 1000, // 9小时55分钟前
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 4,
  },
  {
    id: 'msg-005',
    type: 'system',
    contentType: 'text',
    content: '检测到豆豆在咬笼子栏杆，可能是牙齿需要磨一磨，建议提供适合啃咬的木制玩具。',
    timestamp: Date.now() - 5.5 * 3600 * 1000, // 5.5小时前
    read: true,
    category: 'alert',
    urgent: 1,
    mediaUrl: 'https://images.pexels.com/photos/3493730/pexels-photo-3493730.jpeg?auto=compress&cs=tinysrgb&w=600',
    contentType: 'image',
  },
  // 添加更多聊天消息
  {
    id: 'msg-new-001',
    type: 'user',
    contentType: 'voice',
    content: '豆豆，我最近发现你特别喜欢跑轮呢！你每天在上面跑多久呀？',
    timestamp: Date.now() - 5.4 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 3,
  },
  {
    id: 'msg-new-002',
    type: 'pet',
    contentType: 'voice',
    content: '吱吱！那是因为跑轮超级好玩的！我喜欢感受风吹过我的小脸蛋！',
    timestamp: Date.now() - 5.3 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 3,
  },
  {
    id: 'msg-new-003',
    type: 'user',
    contentType: 'image',
    content: '看，我给你买了新的玩具！',
    timestamp: Date.now() - 5.2 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://images.pexels.com/photos/33787/chimpanzee-sitting-sad-mammal.jpg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'msg-new-004',
    type: 'pet',
    contentType: 'voice',
    content: '哇！好棒的新玩具！我好想玩啊！主人什么时候回来给我呢？',
    timestamp: Date.now() - 5.1 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 3,
  },
  {
    id: 'msg-new-005',
    type: 'user',
    contentType: 'voice',
    content: '我晚上6点就回去了，你再等等哦~我还给你准备了惊喜礼物！',
    timestamp: Date.now() - 5 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 3,
  },
  {
    id: 'msg-new-006',
    type: 'pet',
    contentType: 'voice',
    content: '吱吱！太好了！我好想你啊，快点回来陪我玩吧！',
    timestamp: Date.now() - 4.9 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 2,
  },
  {
    id: 'msg-new-007',
    type: 'user',
    contentType: 'voice',
    content: '豆豆你最近有什么特别想吃的食物吗？我可以明天去超市多买一些！',
    timestamp: Date.now() - 3 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 3,
  },
  {
    id: 'msg-new-008',
    type: 'pet',
    contentType: 'voice',
    content: '我想吃葵花籽！还有那个小饼干！对了，还有苹果粒，甜甜的好好吃！',
    timestamp: Date.now() - 2.9 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 3,
  },
  {
    id: 'msg-new-009',
    type: 'user',
    contentType: 'video',
    content: '看我昨天拍到你偷吃零食的样子，好可爱！',
    timestamp: Date.now() - 2.8 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
  },
  {
    id: 'msg-new-010',
    type: 'pet',
    contentType: 'voice',
    content: '吱吱！那是我的秘密仓库被发现了！主人不要告诉别人哦~',
    timestamp: Date.now() - 2.7 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 2,
  },
  {
    id: 'msg-new-011',
    type: 'user',
    contentType: 'voice',
    content: '豆豆，你今天有没有好好运动啊？我听说运动对小仓鼠很重要，能帮助你保持健康！',
    timestamp: Date.now() - 1.5 * 3600 * 1000, // 1.5小时前
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 4,
  },
  {
    id: 'msg-new-012',
    type: 'pet',
    contentType: 'image',
    content: '我今天在跑轮上跑了好久呢！超级厉害的！',
    timestamp: Date.now() - 1.4 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://images.pexels.com/photos/4520474/pexels-photo-4520474.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'msg-new-013',
    type: 'user',
    contentType: 'voice',
    content: '太棒了！健康的小仓鼠！我为你感到骄傲，你是最棒的小伙伴！',
    timestamp: Date.now() - 1.3 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: '',
    duration: 3,
  },
  {
    id: 'msg-new-014',
    type: 'user',
    contentType: 'voice',
    content: '对了，你的新垫材喜欢吗？我特意挑选了柔软透气的那种，应该会让你睡得更舒服！',
    timestamp: Date.now() - 1 * 3600 * 1000, // 1小时前
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/2448/2448-preview.mp3',
    duration: 4,
  },
  {
    id: 'msg-new-015',
    type: 'pet',
    contentType: 'voice',
    content: '超级喜欢！软软的，我已经在里面挖了一个小洞，做了一个舒服的小窝！',
    timestamp: Date.now() - 0.9 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/1018/1018-preview.mp3',
    duration: 3,
  },
  {
    id: 'msg-new-016',
    type: 'pet',
    contentType: 'image',
    content: '看，这是我的新家！',
    timestamp: Date.now() - 0.8 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://images.pexels.com/photos/8891763/pexels-photo-8891763.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'msg-new-017',
    type: 'user',
    contentType: 'voice',
    content: '太可爱了！你真是个聪明的小家伙！你的小窝布置得真漂亮！',
    timestamp: Date.now() - 0.7 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/2448/2448-preview.mp3',
    duration: 3,
  },
  {
    id: 'msg-new-018',
    type: 'pet',
    contentType: 'voice',
    content: '吱吱~我的牙好痒，需要咬点东西！主人能不能买些木质玩具给我？',
    timestamp: Date.now() - 0.6 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3',
    duration: 3,
  },
  {
    id: 'msg-new-019',
    type: 'user',
    contentType: 'voice',
    content: '好的，我明天就去买！你喜欢什么颜色的？我可以买不同种类让你选择！',
    timestamp: Date.now() - 0.5 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/2300/2300-preview.mp3',
    duration: 3,
  },
  {
    id: 'msg-new-020',
    type: 'pet',
    contentType: 'voice',
    content: '吱吱~我的牙店好棒，需要吃点东西！',
    timestamp: Date.now() - 0.3 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3',
    duration: 2,
  },
  // 当前时间
  {
    id: 'msg-new-021',
    type: 'user',
    contentType: 'voice',
    content: '晚上好啊豆豆，我马上就到家了！你想我了吗？我给你带了新鲜的水果！',
    timestamp: Date.now() - 5 * 60 * 1000, // 5分钟前
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/2448/2448-preview.mp3',
    duration: 4,
  },
  {
    id: 'msg-new-022',
    type: 'pet',
    contentType: 'voice',
    content: '嘤嘤嘤哈，妈妈，等晚上你们睡着了才能到家。所以你们早点睡觉，妈妈早点回家，可以吗？',
    timestamp: Date.now() - 2 * 60 * 1000, // 2分钟前
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3',
    duration: 10,
  },
  // 添加系统消息
  // ... 保留现有的系统消息 ...
];

// 详细报告数据
export const reportData = {
  daily: {
    id: 'report-daily-001',
    type: 'daily',
    date: new Date().toISOString().split('T')[0],
    summary: '今天豆豆的活动状态良好，精神充沛，饮食正常。',
    activityData: {
      totalActive: 150, // 2小时30分钟
      restTime: 780,    // 13小时
      intensityDistribution: {
        低: 40,
        中: 80,
        高: 30
      },
      peakTimes: ['09:15', '20:30']
    },
    feedingData: {
      count: 2,
      times: ['08:30', '19:00'],
      duration: 25
    },
    abnormalBehaviors: [
      {
        type: '咬笼子',
        time: '14:20',
        description: '连续咬笼子约1分钟',
        mediaUrl: 'https://images.pexels.com/photos/4520571/pexels-photo-4520571.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ],
    highlights: [
      {
        title: '跑轮运动',
        description: '在跑轮上快乐奔跑了15分钟',
        mediaUrl: 'https://images.pexels.com/photos/4520476/pexels-photo-4520476.jpeg?auto=compress&cs=tinysrgb&w=600',
        time: '10:05'
      },
      {
        title: '收集食物',
        description: '忙碌地将食物储存到小窝里',
        mediaUrl: 'https://images.pexels.com/photos/8891761/pexels-photo-8891761.jpeg?auto=compress&cs=tinysrgb&w=600',
        time: '15:30'
      }
    ],
    healthMetrics: {
      score: 92,
      sleepQuality: 95,
      activityLevel: 88,
      nutritionBalance: 90,
      stressLevel: 15
    },
    recommendations: [
      '建议提供适合啃咬的木质玩具',
      '可以增加一些迷宫类玩具，增加运动乐趣',
      '考虑增加一种新的谷物混合，丰富饮食'
    ]
  },
  
  weekly: {
    id: 'report-weekly-001',
    type: 'weekly',
    date: '2023年5月第3周',
    summary: '本周豆豆的整体状态良好，活动量适中，饮食规律，睡眠充足。',
    activityData: {
      totalActive: 1050, // 周累计活动时间（分钟）
      restTime: 5460,    // 周累计休息时间（分钟）
      intensityDistribution: {
        低: 350,
        中: 550,
        高: 150
      },
      peakTimes: ['早晨9点-10点', '晚上8点-9点']
    },
    feedingData: {
      count: 14, // 周累计进食次数
      times: ['早晨', '晚上'],
      duration: 175 // 周累计进食时间（分钟）
    },
    abnormalBehaviors: [
      {
        type: '过度磨牙',
        time: '周二下午',
        description: '连续磨牙时间超过正常水平',
        mediaUrl: 'https://images.pexels.com/photos/4520483/pexels-photo-4520483.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        type: '夜间活动增多',
        time: '周四晚上',
        description: '与往常相比，夜间活动时间延长约20分钟',
        mediaUrl: 'https://images.pexels.com/photos/3493730/pexels-photo-3493730.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ],
    highlights: [
      {
        title: '迷宫探索',
        description: '成功穿越了新的迷宫玩具',
        mediaUrl: 'https://images.pexels.com/photos/7654864/pexels-photo-7654864.jpeg?auto=compress&cs=tinysrgb&w=600',
        time: '周三'
      },
      {
        title: '洗澡时间',
        description: '在沙浴盒中玩耍了很久',
        mediaUrl: 'https://images.pexels.com/photos/8891811/pexels-photo-8891811.jpeg?auto=compress&cs=tinysrgb&w=600',
        time: '周五'
      },
      {
        title: '主人互动',
        description: '与主人玩耍并完成了简单训练',
        mediaUrl: 'https://vd3.bdstatic.com/mda-mfajriy5ybnwrpbm/cae_h264/1623391898992371158/mda-mfajriy5ybnwrpbm.mp4',
        time: '周末'
      }
    ],
    healthMetrics: {
      score: 90,
      sleepQuality: 92,
      activityLevel: 85,
      nutritionBalance: 88,
      stressLevel: 20
    },
    recommendations: [
      '建议固定喂食时间，避免不规律进食',
      '可以考虑增加一些互动游戏，提升活动质量',
      '注意观察夜间活动增多的情况，可能与环境变化有关',
      '保持饮水器清洁，确保水源新鲜'
    ]
  },
  
  monthly: {
    id: 'report-monthly-001',
    type: 'monthly',
    date: '2023年5月',
    summary: '本月豆豆的健康状况稳定，体重增加了5克，饮食习惯良好，活动规律。',
    activityData: {
      totalActive: 4500, // 月累计活动时间（分钟）
      restTime: 23400,   // 月累计休息时间（分钟）
      intensityDistribution: {
        低: 1500,
        中: 2300,
        高: 700
      },
      peakTimes: ['早晨7点-9点', '晚上7点-10点']
    },
    feedingData: {
      count: 60, // 月累计进食次数
      times: ['早8点', '晚7点'],
      duration: 750 // 月累计进食时间（分钟）
    },
    abnormalBehaviors: [
      {
        type: '食物储存行为增加',
        time: '月初',
        description: '将食物储存在多个新位置，可能是本能行为增强',
        mediaUrl: 'https://images.pexels.com/photos/8892015/pexels-photo-8892015.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        type: '笼子底部刨挖增多',
        time: '月中',
        description: '在笼子底部刨挖的频率增加，可能需要更深的垫材',
        mediaUrl: 'https://images.pexels.com/photos/8892853/pexels-photo-8892853.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ],
    highlights: [
      {
        title: '健康检查',
        description: '完成了月度健康检查，各项指标正常',
        mediaUrl: 'https://images.pexels.com/photos/4520483/pexels-photo-4520483.jpeg?auto=compress&cs=tinysrgb&w=600',
        time: '5月10日'
      },
      {
        title: '新玩具',
        description: '适应了新的隧道玩具，经常在里面穿梭',
        mediaUrl: 'https://images.pexels.com/photos/4520474/pexels-photo-4520474.jpeg?auto=compress&cs=tinysrgb&w=600',
        time: '5月15日'
      },
      {
        title: '生日庆祝',
        description: '度过了快乐的一岁生日！',
        mediaUrl: 'https://vd3.bdstatic.com/mda-nf5juyjf5z8rvjmb/720p/h264/1654489953345293267/mda-nf5juyjf5z8rvjmb.mp4',
        time: '5月22日'
      }
    ],
    healthMetrics: {
      score: 95,
      sleepQuality: 96,
      activityLevel: 92,
      nutritionBalance: 94,
      stressLevel: 10
    },
    recommendations: [
      '可以考虑更换一些食物种类，提供更丰富的营养',
      '增加垫材厚度，满足挖掘需求',
      '保持适宜的环境温度和湿度，避免季节变化带来的不适',
      '定期更换和清洁玩具，保持环境卫生'
    ]
  }
};

// 随机生成环境数据
export function getEnvironmentData() {
  return {
    temperature: (22 + Math.random() * 3).toFixed(1),
    humidity: Math.floor(45 + Math.random() * 15),
    light: Math.floor(500 + Math.random() * 300),
    noise: Math.floor(30 + Math.random() * 10)
  };
}

// 为每个宠物创建特定风格的聊天信息
export const catMessages = [
  {
    id: 'cat-msg-001',
    type: 'pet',
    contentType: 'text',
    content: '以月亮的名义，我要惩罚你的迟到喵！我的晚餐呢？',
    timestamp: Date.now() - 2 * 3600 * 1000, // 2小时前
    read: false,
    category: 'chat',
    urgent: 0,
  },
  {
    id: 'cat-msg-002',
    type: 'user',
    contentType: 'voice',
    content: '对不起阿努比斯，今天加班晚了，马上就给你准备美味的猫粮！',
    timestamp: Date.now() - 1.9 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/2448/2448-preview.mp3',
    duration: 3,
  },
  {
    id: 'cat-msg-003',
    type: 'pet',
    contentType: 'voice',
    content: '哼！正义的战士可不接受这种借口！不过...看在你这么诚恳的份上，我可以原谅你喵～',
    timestamp: Date.now() - 1.8 * 3600 * 1000,
    read: false,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/2076/2076-preview.mp3',
    duration: 4,
  },
  {
    id: 'cat-msg-004',
    type: 'user',
    contentType: 'image',
    content: '看，给你准备了特别款待的金枪鱼罐头！',
    timestamp: Date.now() - 1.7 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://images.pexels.com/photos/1618426/pexels-photo-1618426.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'cat-msg-005',
    type: 'pet',
    contentType: 'text',
    content: '看在月亮的份上！这可是我的至爱！好吧，你被我的爱之光芒原谅了喵～但下次不许再迟到了，否则我就用月亮魔杖惩罚你！',
    timestamp: Date.now() - 1.6 * 3600 * 1000,
    read: false,
    category: 'chat',
    urgent: 0,
  },
  {
    id: 'cat-msg-006',
    type: 'pet',
    contentType: 'image',
    content: '今天我在窗台上发现了一只邪恶的蝴蝶，我英勇地保护了家园！守护正义就是我的使命喵～',
    timestamp: Date.now() - 6 * 3600 * 1000,
    read: false,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export const dogMessages = [
  {
    id: 'dog-msg-001',
    type: 'pet',
    contentType: 'text',
    content: '各位观众，各位听众，今天是个好日子！您瞧瞧，这日子过的，连根骨头都没有，惨啊！这主人，一天天的，上哪说理去啊？',
    timestamp: Date.now() - 3 * 3600 * 1000, // 3小时前
    read: false,
    category: 'chat',
    urgent: 0,
  },
  {
    id: 'dog-msg-002',
    type: 'user',
    contentType: 'voice',
    content: '咪咕，我今天给你买了新的狗粮和骨头玩具，你又在那胡说什么呢？',
    timestamp: Date.now() - 2.9 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/2300/2300-preview.mp3',
    duration: 3,
  },
  {
    id: 'dog-msg-003',
    type: 'pet',
    contentType: 'voice',
    content: '哎呦！我的亲主人来了！我说啥来着？我这不是逗您玩儿呢嘛！您这一进门，狗生都亮堂了！比那路灯都亮！这骨头，您瞧瞧，多有谱儿啊！',
    timestamp: Date.now() - 2.8 * 3600 * 1000,
    read: false,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/2374/2374-preview.mp3',
    duration: 5,
  },
  {
    id: 'dog-msg-004',
    type: 'user',
    contentType: 'image',
    content: '瞧你那个样子，今天我们要出门遛弯，想去公园转转吗？',
    timestamp: Date.now() - 2.7 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'dog-msg-005',
    type: 'pet',
    contentType: 'text',
    content: '走着！遛弯儿？那可是我的强项！咱这技术，在狗界，可以说是数一数二的人物了！这公园，我熟，哪有好吃的，哪有好玩的，我都门儿清！别瞧我平时嘴上跑火车，办起正事儿来，那叫一个利索！',
    timestamp: Date.now() - 2.6 * 3600 * 1000,
    read: false,
    category: 'chat',
    urgent: 0,
  },
  {
    id: 'dog-msg-006',
    type: 'pet',
    contentType: 'image',
    content: '您瞧瞧！这不是我昨天抓到的大灰球嘛！那叫一个威风，全公园的狗都给我面子，都说我咪咕厉害啊！',
    timestamp: Date.now() - 6 * 3600 * 1000,
    read: false,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export const guineaPigMessages = [
  {
    id: 'gp-msg-001',
    type: 'pet',
    contentType: 'text',
    content: '咕噜咕噜~主人，我刚刚把自己卡在纸箱里了...救命...我太胖了钻不出来...',
    timestamp: Date.now() - 4 * 3600 * 1000, // 4小时前
    read: false,
    category: 'chat',
    urgent: 0,
  },
  {
    id: 'gp-msg-002',
    type: 'user',
    contentType: 'voice',
    content: '刘看山，又卡住了？我跟你说过多少次不要钻那么小的洞啦！',
    timestamp: Date.now() - 3.9 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/2448/2448-preview.mp3',
    duration: 3,
  },
  {
    id: 'gp-msg-003',
    type: 'pet',
    contentType: 'voice',
    content: '可是...可是那个洞看起来很好玩嘛...而且我以为我能钻过去的...咕噜咕噜...我下次一定注意！但是那个胡萝卜看起来太诱人了呀...',
    timestamp: Date.now() - 3.8 * 3600 * 1000,
    read: false,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://assets.mixkit.co/active_storage/sfx/537/537-preview.mp3',
    duration: 4,
  },
  {
    id: 'gp-msg-004',
    type: 'user',
    contentType: 'image',
    content: '看，给你买了新鲜的蔬菜，以后不要再钻小洞了好吗？',
    timestamp: Date.now() - 3.7 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://images.pexels.com/photos/3943174/pexels-photo-3943174.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'gp-msg-005',
    type: 'pet',
    contentType: 'text',
    content: '啊！！！是胡萝卜和青菜！！我最爱吃的！咕噜咕噜咕噜！！！我保证不钻洞了！真的！但是...如果那个洞特别特别大的话...我还是想试试...因为看起来好好玩哦...',
    timestamp: Date.now() - 3.6 * 3600 * 1000,
    read: false,
    category: 'chat',
    urgent: 0,
  },
  {
    id: 'gp-msg-006',
    type: 'pet',
    contentType: 'image',
    content: '主人主人！我刚才吃东西的时候不小心把自己的前爪弄脏了，但我不知道怎么洗...我好笨啊咕噜咕噜...',
    timestamp: Date.now() - 6 * 3600 * 1000,
    read: false,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://images.pexels.com/photos/881152/pexels-photo-881152.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

// 群组聊天消息
export const groupMessages = [
  {
    id: 'group-msg-001',
    type: 'system',
    contentType: 'text',
    content: '欢迎来到宠物家族群，大家可以在这里一起聊天！',
    timestamp: Date.now() - 5 * 3600 * 1000, // 5小时前
    read: true,
    category: 'chat',
    urgent: 0,
  },
  {
    id: 'group-msg-002',
    type: 'pet',
    petId: 'pet-001',
    contentType: 'voice',
    content: '大家好啊！我是仓鼠豆豆，今天跑轮跑得超快的！(^o^)',
    timestamp: Date.now() - 4.8 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://example.com/audio/hamster1.mp3',
    duration: 8,
  },
  {
    id: 'group-msg-003',
    type: 'pet',
    petId: 'pet-002',
    contentType: 'voice',
    content: '以月亮的名义！我是猫阿努比斯咪，我是守护这个家的英雄喵～',
    timestamp: Date.now() - 4.7 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://example.com/audio/cat1.mp3',
    duration: 12,
  },
  {
    id: 'group-msg-004',
    type: 'pet',
    petId: 'pet-003',
    contentType: 'voice',
    content: '各位，各位！您瞧瞧这阵势，四位齐聚一堂，那可真是蓬荜生辉啊！阿努比斯给您问好了！',
    timestamp: Date.now() - 4.6 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://example.com/audio/dog1.mp3',
    duration: 15,
  },
  {
    id: 'group-msg-005',
    type: 'pet',
    petId: 'pet-004',
    contentType: 'voice',
    content: '咕噜咕噜...大家好...我是刘看山...我有点害怕...这么多宠物在一起...不过很高兴认识大家...',
    timestamp: Date.now() - 4.5 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://example.com/audio/guineapig1.mp3',
    duration: 10,
  },
  {
    id: 'group-msg-006',
    type: 'user',
    contentType: 'voice',
    content: '看到大家聚在一起聊天，我好开心！今晚给大家加餐！',
    timestamp: Date.now() - 4.4 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://example.com/audio/user1.mp3',
    duration: 6,
  },
  {
    id: 'group-msg-007',
    type: 'pet',
    petId: 'pet-001',
    contentType: 'image',
    content: '我的新跑轮，大家要来试试吗？',
    timestamp: Date.now() - 3.5 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://images.pexels.com/photos/3973414/pexels-photo-3973414.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'group-msg-008',
    type: 'pet',
    petId: 'pet-003',
    contentType: 'voice',
    content: '哎呦我去！仓鼠老弟这跑轮不错啊！不过您看我阿努比斯这身板，往上一趴，怕是得把这跑轮压成煎饼啊！哈哈哈哈！',
    timestamp: Date.now() - 3.4 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://example.com/audio/dog2.mp3',
    duration: 14,
  },
  {
    id: 'group-msg-009',
    type: 'pet',
    petId: 'pet-002',
    contentType: 'image',
    content: '哼！跑轮算什么，看我在窗台上抓到的邪恶蝴蝶！月亮猫咪的战利品喵～',
    timestamp: Date.now() - 2.5 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'group-msg-010',
    type: 'pet',
    petId: 'pet-004',
    contentType: 'voice',
    content: '啊啊啊啊！阿努比斯抓到蝴蝶了！好可怕！我要躲起来！咕噜咕噜...',
    timestamp: Date.now() - 2.4 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://example.com/audio/guineapig2.mp3',
    duration: 7,
  },
  {
    id: 'group-msg-011',
    type: 'pet',
    petId: 'pet-001',
    contentType: 'voice',
    content: '阿努比斯好厉害！我也想抓蝴蝶，但是我太小了，蝴蝶飞得太高啦！',
    timestamp: Date.now() - 2.3 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://example.com/audio/hamster2.mp3',
    duration: 9,
  },
  {
    id: 'group-msg-012',
    type: 'pet',
    petId: 'pet-002',
    contentType: 'voice',
    content: '哼哼～作为月亮猫咪，捕捉飞行生物是我与生俱来的使命！豆豆你要学习的话，我可以教你喵～',
    timestamp: Date.now() - 2.2 * 3600 * 1000,
    read: true,
    category: 'chat',
    urgent: 0,
    mediaUrl: 'https://example.com/audio/cat2.mp3',
    duration: 13,
  }
];

// 创建系统消息报告卡片
export const systemMessagesV2 = [
  {
    id: "system-daily-1",
    type: "system",
    contentType: "report-card",
    title: "今日宠物健康日报",
    summary: "您的宠物们今天整体状态良好，活动量有所提高。",
    details: "查看所有宠物的详细健康数据",
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    read: false,
    reportType: "daily",
    category: "report",
    icon: "pets",
    color: "bg-green-50",
    iconColor: "text-green-500",
    chartData: {
      activityData: {
        petNames: ["豆豆", "阿努比斯", "阿努比斯", "刘看山"],
        activityValues: [65, 42, 83, 37],
        previousValues: [50, 45, 70, 30],
        timeDistribution: [
          {name: "休息", value: 14.5},
          {name: "低强度活动", value: 5.2},
          {name: "中强度活动", value: 3.1},
          {name: "高强度活动", value: 1.2}
        ]
      },
      healthScores: {
        petNames: ["豆豆", "阿努比斯", "阿努比斯", "刘看山"],
        scores: [92, 88, 95, 86]
      },
      feedingData: {
        meals: [
          {time: "08:30", petNames: ["豆豆", "阿努比斯", "阿努比斯", "刘看山"], amount: "正常"},
          {time: "12:45", petNames: ["豆豆", "阿努比斯", "刘看山"], amount: "正常"},
          {time: "13:20", petNames: ["阿努比斯"], amount: "少量"},
          {time: "18:00", petNames: ["豆豆", "阿努比斯", "阿努比斯", "刘看山"], amount: "正常"}
        ],
        waterIntake: {
          petNames: ["豆豆", "阿努比斯", "阿努比斯", "刘看山"],
          values: [85, 65, 90, 95],
          unit: "ml"
        }
      },
      momentHighlights: [
        {petName: "豆豆", time: "10:23", description: "在跑轮上跑了20分钟", imageUrl: "https://images.pexels.com/photos/4520474/pexels-photo-4520474.jpeg?auto=compress&cs=tinysrgb&w=600"},
        {petName: "阿努比斯", time: "14:12", description: "在窗台晒太阳", imageUrl: "https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg?auto=compress&cs=tinysrgb&w=600"},
        {petName: "阿努比斯", time: "16:30", description: "玩飞盘游戏", imageUrl: "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=600"},
        {petName: "刘看山", time: "11:45", description: "吃新鲜蔬菜", imageUrl: "https://images.pexels.com/photos/5623628/pexels-photo-5623628.jpeg?auto=compress&cs=tinysrgb&w=600"}
      ]
    }
  },
  {
    id: "system-weekly-1",
    type: "system",
    contentType: "report-card",
    title: "本周宠物健康周报",
    summary: "您所有的宠物本周健康状况优良，豆豆运动量较上周增加15%。",
    details: "查看完整周健康报告",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    read: false,
    reportType: "weekly",
    category: "report",
    icon: "insert_chart",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
    chartData: {
      weeklyTrend: {
        days: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        datasets: [
          {name: "豆豆", values: [60, 70, 65, 75, 68, 80, 85]},
          {name: "阿努比斯", values: [45, 50, 40, 55, 60, 50, 48]},
          {name: "咪咕", values: [80, 75, 82, 78, 85, 90, 88]},
          {name: "刘看山", values: [30, 35, 32, 40, 35, 42, 45]}
        ],
        previousWeekAvg: [65, 48, 78, 35]
      },
      behaviorPatterns: {
        petNames: ["豆豆", "阿努比斯", "咪咕", "刘看山"],
        sleepQuality: [4.2, 4.5, 4.0, 3.8],
        activityRegularity: [3.8, 3.5, 4.3, 3.6],
        socialInteractions: [4.0, 3.2, 4.5, 3.0],
        maxScore: 5
      },
      healthIndicators: {
        petNames: ["豆豆", "阿努比斯", "咪咕", "刘看山"],
        appetite: [90, 85, 95, 80],
        energy: [95, 75, 90, 85],
        hydration: [85, 70, 90, 95],
        grooming: [80, 95, 85, 75]
      },
      weeklyHighlights: {
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnail: "https://images.pexels.com/photos/4587955/pexels-photo-4587955.jpeg?auto=compress&cs=tinysrgb&w=600",
        description: "本周精彩瞬间：阿努比斯和刘看山的玩耍时光"
      }
    }
  },
  {
    id: "system-monthly-1",
    type: "system",
    contentType: "report-card",
    title: "10月宠物健康月报",
    summary: "所有宠物本月健康评分均在85分以上，刘看山体重有轻微增加。",
    details: "查看详细月度健康分析报告",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7,
    read: false,
    reportType: "monthly",
    category: "report",
    icon: "insights",
    color: "bg-purple-50",
    iconColor: "text-purple-500",
    chartData: {
      monthlyHealth: {
        petNames: ["豆豆", "阿努比斯", "咪咕", "刘看山"],
        currentScores: [93, 89, 95, 87],
        previousScores: [90, 92, 94, 85],
        categoryScores: {
          categories: ["营养", "活动", "休息", "体重", "精神"],
          datasets: [
            {name: "豆豆", values: [90, 95, 85, 92, 94]},
            {name: "阿努比斯", values: [88, 80, 95, 90, 92]},
            {name: "咪咕", values: [92, 98, 90, 95, 96]},
            {name: "刘看山", values: [85, 75, 90, 82, 88]}
          ]
        }
      },
      behaviorChanges: {
        weeks: ["第1周", "第2周", "第3周", "第4周"],
        datasets: [
          {name: "豆豆-活动", values: [60, 65, 70, 75]},
          {name: "阿努比斯-活动", values: [45, 42, 48, 50]},
          {name: "咪咕-活动", values: [80, 82, 85, 88]},
          {name: "刘看山-活动", values: [30, 32, 35, 40]}
        ]
      },
      anomalies: [
        {petName: "豆豆", week: "第2周", issue: "轻微食欲下降", resolution: "已调整饮食，恢复正常"},
        {petName: "阿努比斯", week: "第3周", issue: "睡眠时间延长", resolution: "已观察无异常，可能因季节变化"}
      ],
      dietAnalysis: {
        petNames: ["豆豆", "阿努比斯", "咪咕", "刘看山"],
        foodPreferences: [
          ["葵花籽", "小麦", "坚果"],
          ["猫粮", "小鱼干", "猫草"],
          ["狗粮", "牛肉", "鸡胸肉"],
          ["胡萝卜", "小黄瓜", "苜蓿草"]
        ],
        intakePattern: {
          timeSlots: ["早上", "中午", "晚上"],
          datasets: [
            {name: "豆豆", values: [35, 30, 35]},
            {name: "阿努比斯", values: [40, 20, 40]},
            {name: "咪咕", values: [30, 30, 40]},
            {name: "刘看山", values: [25, 35, 40]}
          ]
        }
      },
      growthTracking: {
        months: ["8月", "9月", "10月"],
        weights: [
          {name: "豆豆", values: [0.13, 0.14, 0.145]},
          {name: "阿努比斯", values: [4.2, 4.3, 4.25]},
          {name: "咪咕", values: [9.8, 10.1, 10.2]},
          {name: "刘看山", values: [0.8, 0.85, 0.9]}
        ],
        units: "kg"
      },
      monthlyMoments: {
        collageUrl: "https://images.pexels.com/photos/4588047/pexels-photo-4588047.jpeg?auto=compress&cs=tinysrgb&w=600",
        description: "10月宠物精彩时刻合集"
      }
    }
  },
  {
    id: "system-alert-1",
    type: "system",
    contentType: "alert-card",
    title: "活动提醒",
    summary: "豆豆今天的活动量略低，建议增加互动时间。",
    details: "活动量低于平均水平30%",
    timestamp: Date.now() - 1000 * 60 * 30,
    read: false,
    category: "alert",
    urgent: 1,
    icon: "warning",
    color: "bg-amber-50",
    iconColor: "text-amber-500"
  },
  {
    id: "system-msg-1",
    type: "system",
    contentType: "text",
    content: "欢迎使用宠聊智能管家！我会为您提供所有宠物的健康报告和实时状态。如需查看详细报告，请点击相应的报告卡片。",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
    read: true,
    category: "welcome"
  }
]; 

// 群组数据
export const groupData = {
  id: 'group-001',
  name: '宠物家族群',
  avatar: '/assets/images/group-avatar.jpeg?v=' + Date.now(),
  members: [
    { 
      id: 'pet-001', 
      name: '一点点',
      avatar: '/assets/images/hamster-avatar.jpeg'
    },
    { 
      id: 'pet-002', 
      name: '阿努比斯',
      avatar: '/assets/images/cat-avatar.jpeg'
    },
    { 
      id: 'pet-003', 
      name: '阿努比斯',
      avatar: '/assets/images/dog-avatar.jpeg'
    },
    { 
      id: 'pet-004', 
      name: '刘看山',
      avatar: '/assets/images/pig-avatar.jpeg'
    }
  ],
  lastActive: Date.now() - 600000, // 10分钟前
  description: '这里是所有宠物的共同家园，一起分享快乐时光！'
};