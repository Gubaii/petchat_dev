/**
 * 语音合成服务工具类
 * 用于与后端TTS服务交互，将文本转换为语音
 */

// TTS服务器地址
const TTS_SERVER_URL = 'http://localhost:3001';

// 确保TTS_SERVER_URL没有尾部斜杠
const normalizedTtsServerUrl = TTS_SERVER_URL.endsWith('/') ? 
                               TTS_SERVER_URL.slice(0, -1) : 
                               TTS_SERVER_URL;

// 缓存key
const TTS_CACHE_KEY = 'cachedTTS';

/**
 * 将文本转换为语音
 * @param {string} text - 要转换的文本内容
 * @param {string} type - 消息类型，'pet'或'user'
 * @param {string} petType - 宠物类型，'hamster'、'cat'、'dog'或'guineaPig'
 * @returns {Promise<Object>} - 包含audioUrl和duration的对象
 */
export async function textToSpeech(text, type, petType) {
  try {
    console.log('TTS开始处理文本:', text, '类型:', type, '宠物类型:', petType);
    
    // 确保petType值有效
    if (!petType && type === 'pet') {
      console.warn('未提供宠物类型，使用默认值hamster');
      petType = 'hamster';
    }
    
    // 禁用缓存获取部分，始终重新生成
    console.log('生成新的语音:', text, type, petType);
    
    // 生成reqid - 唯一识别符
    const reqid = generateUUID();
    
    // 获取语速设置
    const speedRatio = getSpeedRatio(type, petType);
    console.log('使用语速:', speedRatio);
    
    // 构建火山引擎TTS API格式的请求
    const requestData = {
      app: {
        appid: '1936777178',
        token: 'Ogk8WF0-LV5ZCWKHBgVbed0JN9YojXBd', 
        cluster: 'volcano_tts'
      },
      user: {
        uid: "uid123"
      },
      audio: {
        voice_type: getVoiceType(type, petType),
        encoding: "mp3",
        speed_ratio: speedRatio
      },
      request: {
        reqid: reqid,
        text: text,
        text_type: "plain",
        operation: "query"
      },
      timestamp: Date.now() // 添加时间戳确保每次请求都是新的
    };

    // 发送请求到本地代理服务器
    console.log('发送TTS请求到:', `${normalizedTtsServerUrl}/api/tts_proxy?t=${Date.now()}`);
    
    try {
      const response = await fetch(`${normalizedTtsServerUrl}/api/tts_proxy?t=${Date.now()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify(requestData),
        timeout: 10000 // 10秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // 检查是否成功
      if (!data.success) {
        console.error('TTS API返回错误:', data.error);
        throw new Error(data.error || 'TTS API返回错误');
      }
      
      // 记录原始audioUrl
      console.log('服务器返回的原始audioUrl:', data.audioUrl);
      
      // 构建结果对象
      const result = {
        audioUrl: `${normalizedTtsServerUrl}${data.audioUrl.startsWith('/') ? data.audioUrl : `/${data.audioUrl}`}`,
        duration: data.duration || estimateDuration(text),
        speedRatio: speedRatio  // 返回使用的语速值
      };
      
      console.log('构建的完整audioUrl:', result.audioUrl);
      
      return result;
    } catch (fetchError) {
      console.error('TTS请求失败:', fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error('TTS服务错误:', error);
    // 返回默认值，防止UI异常
    return {
      audioUrl: null,
      duration: estimateDuration(text),
    };
  }
}

/**
 * 根据角色类型获取对应的语音类型
 * @param {string} type - 消息类型，'pet'或'user'
 * @param {string} petType - 宠物类型
 * @returns {string} - 语音类型
 */
function getVoiceType(type, petType) {
  console.log('获取语音类型，消息类型:', type, '宠物类型:', petType);
  
  // 使用不同的音色映射
  const voiceTypes = {
    user: 'zh_male_M392_conversation_wvae_bigtts', // 主人统一使用男声
    pet: {
      hamster: 'zh_male_naiqimengwa_mars_bigtts', // 仓鼠音色
      cat: 'zh_female_M392_conversation_wvae_bigtts',   // 猫咪音色
      dog: 'zh_male_M392_conversation_wvae_bigtts',     // 狗狗音色
      guineaPig: 'zh_male_xionger_mars_bigtts'  // 荷兰猪音色
    },
    system: 'zh_female_M392_conversation_wvae_bigtts'  // 系统消息音色
  };
  
  // 为了调试，记录所有可用的宠物类型
  console.log('支持的宠物类型:', Object.keys(voiceTypes.pet));
  
  // 猫的特殊处理，因为可能会有大小写问题或中文"猫"
  if (type === 'pet' && 
      (petType === 'cat' || petType === 'Cat' || petType === '猫' || 
       petType?.toLowerCase() === 'cat')) {
    console.log('检测到猫类型，使用猫咪音色');
    return voiceTypes.pet.cat;
  }
  
  if (type === 'pet') {
    if (!petType || !voiceTypes.pet[petType]) {
      console.warn('无效的宠物类型:', petType, '使用默认仓鼠音色');
      return voiceTypes.pet.hamster;
    }
    return voiceTypes.pet[petType];
  } else if (type === 'system') {
    return voiceTypes.system;
  } else {
    return voiceTypes.user;
  }
}

/**
 * 根据角色类型获取对应的语速比率
 * @param {string} type - 消息类型，'pet'或'user'
 * @param {string} petType - 宠物类型
 * @returns {number} - 语速比率
 */
function getSpeedRatio(type, petType) {
  console.log('获取语速比率，消息类型:', type, '宠物类型:', petType);
  
  // 不同角色的语速设置
  const speedRatios = {
    user: 1.0,  // 主人使用正常语速
    pet: {
      hamster: 1.1,     // 仓鼠语速偏快
      cat: 0.9,         // 猫咪语速稍慢
      dog: 1.0,         // 狗狗正常语速
      guineaPig: 0.85   // 荷兰猪语速较慢
    },
    system: 1.0  // 系统消息正常语速
  };
  
  // 猫的特殊处理，因为可能会有大小写问题或中文"猫"
  if (type === 'pet' && 
      (petType === 'cat' || petType === 'Cat' || petType === '猫' || 
       petType?.toLowerCase() === 'cat')) {
    return speedRatios.pet.cat;
  }
  
  if (type === 'pet') {
    if (!petType || !speedRatios.pet[petType]) {
      return speedRatios.pet.hamster; // 默认使用仓鼠的语速
    }
    return speedRatios.pet[petType];
  } else if (type === 'system') {
    return speedRatios.system;
  } else {
    return speedRatios.user;
  }
}

/**
 * 生成UUID
 * @returns {string} - UUID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 从缓存中获取音频数据
 * @param {string} text - 文本内容
 * @param {string} type - 消息类型
 * @param {string} petType - 宠物类型
 * @returns {Object|null} - 缓存的结果或null
 */
function getCachedAudio(text, type, petType) {
  try {
    const cacheKey = `${text}_${type}_${petType}`;
    const cachedData = localStorage.getItem(TTS_CACHE_KEY);
    if (cachedData) {
      const cache = JSON.parse(cachedData);
      return cache[cacheKey];
    }
  } catch (e) {
    console.warn('读取TTS缓存失败:', e);
  }
  return null;
}

/**
 * 缓存音频数据
 * @param {string} text - 文本内容
 * @param {string} type - 消息类型
 * @param {string} petType - 宠物类型
 * @param {Object} result - 结果对象
 */
function cacheAudio(text, type, petType, result) {
  try {
    const cacheKey = `${text}_${type}_${petType}`;
    const cachedData = localStorage.getItem(TTS_CACHE_KEY);
    const cache = cachedData ? JSON.parse(cachedData) : {};
    cache[cacheKey] = result;
    localStorage.setItem(TTS_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('缓存TTS结果失败:', e);
  }
}

/**
 * 估算文本转语音的时长
 * @param {string} text - 文本内容
 * @returns {number} - 估计的时长（秒）
 */
function estimateDuration(text) {
  // 简单估算：约 5 个中文字符/秒
  const charCount = text.length;
  return Math.max(1, Math.ceil(charCount / 5));
}

/**
 * 获取宠物类型对应的标识
 * @param {string} petType - 宠物类型名称（可能是中文或英文）
 * @returns {string} - 宠物类型标识
 */
export function getPetTypeIdentifier(petType) {
  // 如果已经是英文标识，直接返回
  if (['hamster', 'cat', 'dog', 'guineaPig'].includes(petType)) {
    return petType;
  }
  
  // 中文名称转换
  const typeMap = {
    '仓鼠': 'hamster',
    '猫': 'cat', 
    '狗': 'dog',
    '荷兰猪': 'guineaPig'
  };
  
  return typeMap[petType] || 'hamster';
}

/**
 * 检查URL是否为默认的示例音频或为空
 * @param {string} url - 音频URL
 * @returns {boolean} - 是否需要生成新音频
 */
export function isDefaultAudio(url) {
  // 如果URL为空、undefined或只是#号，认为需要生成新音频
  if (!url || url === '' || url === '#') {
    return true;
  }
  
  // 默认示例音频URL包含mixkit.co
  return url.includes('mixkit.co');
}

export default {
  textToSpeech,
  getPetTypeIdentifier,
  isDefaultAudio
}; 