/**
 * 火山引擎TTS HTTP API测试脚本
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 配置信息 - 请替换成您的实际配置
const CONFIG = {
  appid: 'xxx', // 替换为您的appid
  token: 'xxx', // 替换为您的token
  cluster: 'xxx', // 替换为您的cluster
};

// 确保输出目录存在
const OUTPUT_DIR = path.join(__dirname, 'test_output');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function testTtsHttpApi() {
  try {
    console.log('开始测试火山引擎TTS HTTP API...');
    
    // 测试文本
    const testText = '你好，这是一段测试文本，用于验证火山引擎TTS API的调用。';
    
    // 构建请求
    const response = await axios({
      method: 'post',
      url: 'https://openspeech.bytedance.com/api/v1/tts',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer;${CONFIG.token}` // 注意这里是分号而非空格
      },
      data: {
        app: {
          appid: CONFIG.appid,
          token: CONFIG.token,
          cluster: CONFIG.cluster
        },
        user: {
          uid: "user123"
        },
        audio: {
          voice_type: "zh_female_qingxin", // 清新女声
          encoding: "mp3",
          speed_ratio: 1.0,
          volume_ratio: 1.0,
          pitch_ratio: 1.0
        },
        request: {
          reqid: uuidv4(), // 生成唯一ID
          text: testText,
          text_type: "plain",
          operation: "query"
        }
      },
      responseType: 'arraybuffer'
    });
    
    // 检查响应
    console.log('请求成功!');
    console.log('响应状态:', response.status);
    console.log('响应头:', response.headers);
    
    // 保存音频文件
    const outputFile = path.join(OUTPUT_DIR, 'test_output.mp3');
    fs.writeFileSync(outputFile, response.data);
    console.log(`音频文件已保存至: ${outputFile}`);
    
    return true;
  } catch (error) {
    console.error('测试失败!');
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应头:', error.response.headers);
      console.error('响应内容:', error.response.data.toString());
    } else {
      console.error('错误详情:', error.message);
    }
    return false;
  }
}

// 运行测试
testTtsHttpApi()
  .then(success => {
    if (success) {
      console.log('测试完成，API调用成功!');
    } else {
      console.log('测试完成，API调用失败!');
    }
  })
  .catch(err => {
    console.error('测试过程中发生未捕获错误:', err);
  }); 