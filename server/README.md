# 宠物聊天应用 TTS 服务器

这是宠物聊天应用的语音合成服务器，使用火山引擎TTS API将文本转换为语音。

## 功能特点

- 使用火山引擎TTS API进行高质量语音合成
- 支持为不同角色（宠物和主人）应用不同音色
- 自动缓存语音文件，避免重复请求相同文本
- 无缝集成到宠物聊天应用中

## 安装

1. 确保已安装Node.js (v14+)
2. 进入server目录
3. 安装依赖:

```bash
npm install
```

## 配置

在`tts_http_service.js`文件中，您可以修改以下配置：

```javascript
// 火山引擎配置
const VOLC_CONFIG = {
  appid: '1936777178',  // 您的火山引擎AppID
  token: 'Ogk8WF0-LV5ZCWKHBgVbed0JN9YojXBd',  // 您的火山引擎Token
  cluster: 'volcano_tts'  // 集群名称
};

// 音色配置
const VOICE_TYPES = {
  hamster: 'zh_male_M392_conversation_wvae_bigtts',  // 仓鼠
  cat: 'zh_female_M392_conversation_wvae_bigtts',    // 猫咪
  dog: 'zh_male_M392_conversation_wvae_bigtts',      // 狗狗
  guineaPig: 'zh_female_M392_conversation_wvae_bigtts', // 荷兰猪
  owner: 'zh_male_M392_conversation_wvae_bigtts'     // 主人
};
```

## 使用方法

### 启动服务器

```bash
npm start
```

服务器将在本地端口3001上运行。

### API接口

#### 1. 文本转语音 (代理方式)

```
POST /api/tts_proxy
```

请求体格式:

```json
{
  "app": {
    "appid": "1936777178",
    "token": "Ogk8WF0-LV5ZCWKHBgVbed0JN9YojXBd",
    "cluster": "volcano_tts"
  },
  "user": {
    "uid": "uid123"
  },
  "audio": {
    "voice_type": "zh_male_M392_conversation_wvae_bigtts",
    "encoding": "mp3",
    "speed_ratio": 1.0
  },
  "request": {
    "reqid": "uuid-here",
    "text": "要转换为语音的文本",
    "text_type": "plain",
    "operation": "query"
  }
}
```

成功响应:

```json
{
  "success": true,
  "audioUrl": "/audio_cache/file.mp3",
  "duration": 3.5,
  "fileSize": 12345,
  "apiResponse": {
    "code": 3000,
    "message": "Success",
    "sequence": -1,
    "duration": 3500
  }
}
```

#### 2. 简化的文本转语音接口

```
POST /api/tts
```

请求体格式:

```json
{
  "text": "要转换为语音的文本",
  "type": "pet", // 或 "user"
  "petType": "hamster" // 或 "cat", "dog", "guineaPig"
}
```

成功响应:

```json
{
  "success": true,
  "audioUrl": "/audio_cache/file.mp3",
  "duration": 3.5,
  "fromCache": false,
  "fileSize": 12345
}
```

## 前端集成

在前端中，已经提供了`ttsService.js`工具类来处理与TTS服务器的通信。使用示例:

```javascript
import { textToSpeech, getPetTypeIdentifier } from './utils/ttsService.js';

// 转换文本为语音
async function generateSpeech(text, petType) {
  const petTypeId = getPetTypeIdentifier(petType); // 例如 '仓鼠' -> 'hamster'
  const { audioUrl, duration } = await textToSpeech(text, 'pet', petTypeId);
  
  // 使用生成的语音URL和时长
  console.log('生成的语音URL:', audioUrl);
  console.log('语音时长:', duration, '秒');
  
  // 播放语音
  const audio = new Audio(audioUrl);
  audio.play();
}
```

## 故障排除

1. 如果遇到403或401错误，请检查火山引擎的配置信息是否正确
2. 如果遇到音频无法播放的问题，请查看服务器日志中的错误信息
3. 确保创建了`audio_cache`目录，并且有写入权限

## 注意事项

- 火山引擎API的响应是JSON格式，包含Base64编码的音频数据
- 服务器会解码Base64数据并保存为MP3文件
- 使用`reqid`确保每个请求的唯一性 