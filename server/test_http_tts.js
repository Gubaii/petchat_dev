/**
 * 火山引擎TTS HTTP API测试脚本
 * 直接调用API而不通过代理，用于验证配置
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 测试配置 - 请替换成有效的值
const CONFIG = {
  appid: '1936777178', // 替换为您的appid
  token: 'QgK8WF0-LV5ZCWKHBgVbed0JM9YojXBd', // 替换为您的token
  cluster: 'volcano_tts', // 替换为您的cluster
};

// 更新测试文本
const TEST_TEXT = "字节跳动语音合成";

// 更新音色
const VOICE_TYPE = "zh_male_M392_conversation_wvae_bigtts";

// 确保输出目录存在
const OUTPUT_DIR = path.join(__dirname, 'test_output');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function testTtsHttpApi() {
  try {
    console.log('开始测试火山引擎TTS HTTP API...');
    
    // 使用真实的UUID
    const reqid = uuidv4();
    
    console.log(`配置信息:
  appid: ${CONFIG.appid}
  token: ${CONFIG.token}
  cluster: ${CONFIG.cluster}
  reqid: ${reqid}
  text: ${TEST_TEXT}
`);

    // 构建请求头
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer;${CONFIG.token}` // 使用分号连接
    };
    
    console.log('请求头:', headers);
    
    // 构建请求体
    const data = {
      app: {
        appid: CONFIG.appid,
        token: CONFIG.token,
        cluster: CONFIG.cluster
      },
      user: {
        uid: "uid123"
      },
      audio: {
        voice_type: VOICE_TYPE,
        encoding: "mp3",
        speed_ratio: 1.0
      },
      request: {
        reqid: reqid,
        text: TEST_TEXT,
        text_type: "plain",
        operation: "query"
      }
    };
    
    console.log('请求体:', JSON.stringify(data, null, 2));
    
    // 发送请求
    const response = await axios({
      method: 'post',
      url: 'https://openspeech.bytedance.com/api/v1/tts',
      headers: headers,
      data: data,
      responseType: 'arraybuffer'
    });
    
    // 检查响应
    console.log('请求成功!');
    console.log('响应状态:', response.status);
    console.log('响应头:', JSON.stringify(response.headers, null, 2));
    
    // 保存音频文件
    const outputFile = path.join(OUTPUT_DIR, 'test_output.mp3');
    fs.writeFileSync(outputFile, response.data);
    console.log(`音频文件已保存至: ${outputFile}`);
    
    return true;
  } catch (error) {
    console.error('测试失败!');
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应头:', JSON.stringify(error.response.headers, null, 2));
      
      try {
        // 尝试解析错误响应
        if (error.response.headers['content-type']?.includes('application/json')) {
          const errorData = JSON.parse(Buffer.from(error.response.data).toString());
          console.error('错误详情:', JSON.stringify(errorData, null, 2));
        } else {
          console.error('错误内容:', Buffer.from(error.response.data).toString());
        }
      } catch (e) {
        console.error('无法解析错误响应:', e.message);
      }
    } else {
      console.error('网络错误:', error.message);
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