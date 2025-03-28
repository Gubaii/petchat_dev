const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use('/audio_cache', express.static(path.join(__dirname, 'audio_cache'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp3')) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      // 设置正确的内容长度
      try {
        const stats = fs.statSync(filePath);
        res.setHeader('Content-Length', stats.size);
      } catch (err) {
        console.error('获取文件大小失败:', err);
      }
    }
  },
  maxAge: 0 // 不缓存
}));

// 创建缓存目录
const CACHE_DIR = path.join(__dirname, 'audio_cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// 火山引擎配置
const VOLC_API_URL = 'https://openspeech.bytedance.com/api/v1/tts';
const VOLC_CONFIG = {
  appid: '1936777178',  // 这是实际错误日志中看到的appid
  token: 'Ogk8WF0-LV5ZCWKHBgVbed0JN9YojXBd',  // 这是实际错误日志中看到的token
  cluster: 'volcano_tts'  // 这是实际错误日志中看到的cluster
};

// 音色配置
const VOICE_TYPES = {
  hamster: 'zh_male_M392_conversation_wvae_bigtts',  // 仓鼠
  cat: 'zh_female_M392_conversation_wvae_bigtts',    // 猫咪
  dog: 'zh_male_M392_conversation_wvae_bigtts',      // 狗狗
  guineaPig: 'zh_female_M392_conversation_wvae_bigtts', // 荷兰猪
  owner: 'zh_male_M392_conversation_wvae_bigtts'     // 主人
};

// 语速配置
const SPEED_RATIOS = {
  hamster: 1.2,     // 仓鼠语速偏快
  cat: 0.9,         // 猫咪语速稍慢
  dog: 1.0,         // 狗狗正常语速
  guineaPig: 0.85,  // 荷兰猪语速较慢
  owner: 1.0        // 主人使用正常语速
};

// 根据文本内容生成缓存文件名
function getCacheFileName(text, voiceType) {
  const timestamp = Date.now(); // 添加时间戳确保文件名唯一
  const hash = crypto.createHash('md5').update(text + voiceType + timestamp).digest('hex');
  return `${hash}.mp3`;
}

// 检查缓存是否存在
function checkCache(fileName) {
  // 始终返回false，表示不使用缓存
  return false;
}

// 调用火山API生成语音
async function generateSpeech(text, voiceType) {
  try {
    console.log('生成语音:', text, voiceType);
    
    // 获取对应的语速
    let speedRatio = 1.0; // 默认语速
    for (const petType in VOICE_TYPES) {
      if (VOICE_TYPES[petType] === voiceType) {
        speedRatio = SPEED_RATIOS[petType];
        console.log(`找到匹配的语速设置: ${petType} = ${speedRatio}`);
        break;
      }
    }
    
    const reqid = crypto.randomUUID();
    console.log('使用reqid:', reqid);
    
    // 构建请求数据
    const requestData = {
      app: {
        appid: VOLC_CONFIG.appid,
        token: VOLC_CONFIG.token,
        cluster: VOLC_CONFIG.cluster
      },
      user: {
        uid: "uid123"
      },
      audio: {
        voice_type: voiceType,
        encoding: "mp3",
        speed_ratio: speedRatio // 使用匹配的语速
      },
      request: {
        reqid: reqid,
        text: text,
        text_type: "plain",
        operation: "query"
      }
    };
    
    console.log('请求数据:', JSON.stringify(requestData, null, 2));
    
    const response = await axios({
      method: 'post',
      url: VOLC_API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer;${VOLC_CONFIG.token}`
      },
      data: requestData,
      responseType: 'arraybuffer'
    });
    
    console.log('TTS API响应成功, 状态码:', response.status);
    
    // 从响应头获取音频时长信息
    let duration = 0;
    if (response.headers['x-tt-duration']) {
      duration = parseInt(response.headers['x-tt-duration']) / 1000;
    } else {
      duration = estimateDuration(text);
    }

    return {
      audioData: response.data,
      duration: duration
    };
  } catch (error) {
    console.error('语音生成错误:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应头:', JSON.stringify(error.response.headers));
      try {
        const errorData = Buffer.from(error.response.data).toString();
        console.error('错误详情:', errorData);
      } catch (e) {
        console.error('无法解析错误数据');
      }
    }
    throw error;
  }
}

// 估算文本的语音时长（如果API没有返回实际时长）
function estimateDuration(text) {
  // 简单估算：约 5 个中文字符/秒
  const charCount = text.length;
  return Math.max(1, Math.ceil(charCount / 5));
}

// API端点: 文本转语音
app.post('/api/tts', async (req, res) => {
  try {
    const { text, type, petType } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing text parameter' });
    }
    
    console.log('TTS请求:', { text, type, petType });
    
    // 确定使用的音色
    let voiceType;
    if (type === 'pet') {
      voiceType = VOICE_TYPES[petType] || VOICE_TYPES.hamster;
    } else {
      voiceType = VOICE_TYPES.owner;
    }
    
    // 确定使用的语速
    let speedRatio;
    if (type === 'pet') {
      speedRatio = SPEED_RATIOS[petType] || SPEED_RATIOS.hamster;
    } else {
      speedRatio = SPEED_RATIOS.owner;
    }
    
    console.log('使用音色:', voiceType, '语速:', speedRatio);
    
    // 生成缓存文件名 (添加时间戳确保唯一)
    const cacheFileName = getCacheFileName(text, voiceType);
    const cacheFilePath = path.join(CACHE_DIR, cacheFileName);
    
    // 直接调用TTS API，不检查缓存
    const { audioData, duration } = await generateSpeech(text, voiceType);
    
    // 保存到文件
    fs.writeFileSync(cacheFilePath, audioData);
    
    // 返回音频URL和时长
    return res.json({
      success: true,
      audioUrl: `/audio_cache/${cacheFileName}`,
      duration: duration,
      fromCache: false,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('TTS错误:', error);
    res.status(500).json({ 
      error: error.message || 'TTS生成失败',
      timestamp: Date.now()
    });
  }
});

// 添加静态文件服务和TTS API代理

// 添加路由处理程序来提供测试页面
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'test_tts.html'));
});

// 代理中间件 - 处理base64编码的音频数据
app.post('/api/tts_proxy', async (req, res) => {
  try {
    console.log('收到代理请求:', JSON.stringify(req.body, null, 2));
    
    // 检查请求文本是否存在
    if (!req.body.request?.text) {
      return res.status(400).json({ 
        success: false,
        error: '请求中缺少text参数',
        debug: { body: req.body }
      });
    }
    
    // 检查并调整语速设置，确保在合理范围内
    if (req.body.audio && req.body.audio.speed_ratio) {
      const speedRatio = parseFloat(req.body.audio.speed_ratio);
      if (isNaN(speedRatio) || speedRatio < 0.5 || speedRatio > 2.0) {
        console.warn('语速设置不在合理范围内，调整为默认值1.0:', req.body.audio.speed_ratio);
        req.body.audio.speed_ratio = 1.0;
      }
    }
    
    // 获取请求中的token
    const token = req.body.app?.token;
    
    if (!token) {
      return res.status(400).json({ 
        success: false,
        error: '请求中缺少token参数',
        debug: { body: req.body }
      });
    }
    
    const cleanToken = token.trim(); // 清理可能的空格
    
    // 发送请求，预期返回JSON数据（包含base64编码的音频）
    console.log('发送请求...');
    console.log('完整请求头:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer;${cleanToken}`
    });
    console.log('请求数据:', JSON.stringify(req.body, null, 2));
    
    try {
      const response = await axios({
        method: 'post',
        url: VOLC_API_URL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer;${cleanToken}`
        },
        data: req.body,
        timeout: 15000 // 15秒超时
        // 不指定responseType，默认是json
      });
      
      console.log('API响应成功, 状态码:', response.status);
      console.log('响应类型:', typeof response.data);
      
      // 检查响应是否包含期望的字段
      if (!response.data) {
        return res.status(400).json({
          success: false,
          error: 'API返回了空数据'
        });
      }
      
      console.log('API响应码:', response.data.code);
      console.log('API消息:', response.data.message);
      
      // 检查API返回的状态码
      if (response.data.code !== 3000) {
        return res.status(400).json({
          success: false,
          error: `API错误: ${response.data.message || '未知错误'}`,
          apiResponse: response.data
        });
      }
      
      // 检查是否有base64编码的音频数据
      if (!response.data.data) {
        return res.status(400).json({
          success: false,
          error: 'API响应中缺少音频数据',
          apiResponse: response.data
        });
      }
      
      // 将base64编码的音频数据转换为二进制
      const audioBuffer = Buffer.from(response.data.data, 'base64');
      console.log('解码后的音频数据大小:', audioBuffer.length, '字节');
      
      // 获取音频时长信息
      let duration = 0;
      if (response.data.addition && response.data.addition.duration) {
        duration = parseInt(response.data.addition.duration) / 1000; // 毫秒转秒
      } else {
        duration = estimateDuration(req.body.request?.text || '');
      }
      
      // 生成唯一文件名
      const fileName = `${Date.now()}_${crypto.randomUUID()}.mp3`;
      const filePath = path.join(CACHE_DIR, fileName);
      
      // 写入MP3文件
      fs.writeFileSync(filePath, audioBuffer);
      console.log(`音频数据已保存到文件: ${filePath}, 大小: ${audioBuffer.length} 字节`);
      
      return res.json({
        success: true,
        audioUrl: `/audio_cache/${fileName}`,
        duration: duration,
        fileSize: audioBuffer.length,
        timestamp: Date.now(),
        apiResponse: {
          code: response.data.code,
          message: response.data.message,
          sequence: response.data.sequence,
          duration: response.data.addition?.duration
        }
      });
    } catch (axiosError) {
      console.error('API请求失败:', axiosError);
      
      if (axiosError.response) {
        return res.status(500).json({
          success: false,
          error: 'API请求失败',
          statusCode: axiosError.response.status,
          statusText: axiosError.response.statusText,
          errorData: axiosError.response.data
        });
      } else if (axiosError.request) {
        // 请求已发送但未收到响应
        return res.status(500).json({
          success: false,
          error: '无法连接到TTS API服务器',
          message: axiosError.message,
          code: axiosError.code
        });
      } else {
        // 请求设置时出错
        return res.status(500).json({
          success: false,
          error: '配置TTS API请求时出错',
          message: axiosError.message
        });
      }
    }
  } catch (error) {
    console.error('代理请求失败:', error);
    
    // 提供更详细的错误信息
    return res.status(500).json({ 
      success: false,
      error: '代理请求处理失败', 
      message: error.message,
      stack: error.stack
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`TTS HTTP service running on port ${PORT}`);
}); 