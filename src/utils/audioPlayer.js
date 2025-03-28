/**
 * 音频播放器初始化
 */
import { textToSpeech, getPetTypeIdentifier, isDefaultAudio } from './ttsService.js';

// 确保TTS服务器URL没有尾部斜杠
const TTS_SERVER_URL = 'http://localhost:3001';
const normalizedTtsServerUrl = TTS_SERVER_URL.endsWith('/') ? 
                              TTS_SERVER_URL.slice(0, -1) : 
                              TTS_SERVER_URL;

export function initAudioPlayer() {
  // 确保window.appData存在
  if (!window.appData) {
    window.appData = {};
  }
  
  // 清除音频缓存
  try {
    localStorage.removeItem('cachedTTS');
    console.log('已清除TTS缓存');
  } catch (e) {
    console.warn('清除TTS缓存失败:', e);
  }
  
  // 注册播放语音消息的方法
  window.appData.playVoiceMessage = async function(msgId, text, type, petType) {
    console.log('播放语音消息:', msgId, text, type, petType);
    
    // 获取音频元素
    const audioElement = document.getElementById(`audio-${msgId}`);
    if (!audioElement) {
      console.error('未找到音频元素:', `audio-${msgId}`);
      return;
    }
    
    // 先停止所有其他正在播放的音频
    document.querySelectorAll('audio').forEach(audio => {
      if (audio.id !== `audio-${msgId}` && !audio.paused) {
        try {
          audio.pause();
          audio.currentTime = 0;
          
          // 更新对应的播放按钮状态
          const otherMessageId = audio.id.replace('audio-', '');
          const otherButton = document.querySelector(`.voice-message-play[data-message-id="${otherMessageId}"]`);
          if (otherButton) {
            const icon = otherButton.querySelector('.material-icons');
            if (icon) icon.textContent = 'play_arrow';
            const voiceMsg = otherButton.closest('.voice-message');
            if (voiceMsg) voiceMsg.classList.remove('playing');
          }
        } catch (e) {
          console.warn('停止其他音频时出错:', e);
        }
      }
    });
    
    // 显示播放加载状态
    const messageElement = audioElement.closest('.message-item');
    if (messageElement) {
      messageElement.classList.add('audio-loading');
    }
    
    try {
      // 针对msg-yesterday-003的特殊处理：直接播放mediaUrl而不生成TTS
      if (msgId === 'msg-yesterday-003') {
        console.log('检测到特殊消息ID: msg-yesterday-003, 直接播放mediaUrl');
        
        // 尝试获取消息的mediaUrl
        let mediaUrl = '';
        try {
          const Alpine = window.Alpine;
          if (Alpine) {
            const appElement = document.querySelector('[x-data]');
            if (appElement) {
              const appData = Alpine.$data(appElement);
              if (appData && appData.messages) {
                const msgObj = appData.messages.find(m => m.id === msgId);
                if (msgObj && msgObj.mediaUrl) {
                  mediaUrl = msgObj.mediaUrl;
                }
              }
            }
          }
        } catch (err) {
          console.warn('无法从Alpine获取消息数据:', err);
        }
        
        // 如果无法从Alpine获取，尝试使用预设值
        if (!mediaUrl) {
          mediaUrl = '/audio/ratMusic.mp3';
          console.log('使用预设的mediaUrl:', mediaUrl);
        }
        
        if (mediaUrl) {
          // 使用相对路径，不使用外部URL
          if (mediaUrl.startsWith('http') && !mediaUrl.includes('localhost')) {
            console.warn('检测到外部URL，将使用本地音频文件');
            mediaUrl = '/audio/ratMusic.mp3';
          }
          
          // 去掉/public前缀（如果有的话）
          if (mediaUrl.startsWith('/public/')) {
            mediaUrl = mediaUrl.replace('/public/', '/');
            console.log('移除/public前缀，修正后的URL:', mediaUrl);
          }
          
          console.log('最终使用的mediaUrl:', mediaUrl);
          audioElement.src = mediaUrl;
          audioElement.load();
          
          // 更新播放按钮状态
          const playButton = document.querySelector(`.voice-message-play[data-message-id="${msgId}"]`);
          if (playButton) {
            const icon = playButton.querySelector('.material-icons');
            if (icon) icon.textContent = 'pause';
            const voiceMsg = playButton.closest('.voice-message');
            if (voiceMsg) voiceMsg.classList.add('playing');
          }
          
          try {
            await audioElement.play();
            console.log('特殊消息音频开始播放:', mediaUrl);
            
            // 添加结束事件监听
            audioElement.onended = function() {
              console.log('特殊消息音频播放结束');
              // 重置播放按钮状态
              if (playButton) {
                const icon = playButton.querySelector('.material-icons');
                if (icon) icon.textContent = 'play_arrow';
                const voiceMsg = playButton.closest('.voice-message');
                if (voiceMsg) voiceMsg.classList.remove('playing');
              }
            };
          } catch (playError) {
            console.error('特殊消息音频播放失败:', playError);
            // 错误时也重置按钮状态
            if (playButton) {
              const icon = playButton.querySelector('.material-icons');
              if (icon) icon.textContent = 'play_arrow';
              const voiceMsg = playButton.closest('.voice-message');
              if (voiceMsg) voiceMsg.classList.remove('playing');
            }
          }
          
          // 移除加载状态
          if (messageElement) {
            try {
              messageElement.classList.remove('audio-loading');
            } catch (e) {
              console.warn('移除加载状态失败:', e);
            }
          }
          
          return; // 提前结束函数执行
        }
      }
      
      // 强制每次都生成新音频
      console.log('生成新音频');
      
      // 在生成前，清空当前的音频源，防止默认音频播放
      audioElement.src = '';
      audioElement.load(); // 确保清空源后加载
      
      // 转换为实际的宠物类型标识符
      const petTypeId = getPetTypeIdentifier(petType);
      console.log('原始宠物类型:', petType, '转换后的宠物类型标识符:', petTypeId);
      
      // 判断是否为纯音频类型（没有text内容）
      const isAudioOnly = !text || text.trim() === '';
      console.log('是否为纯音频类型:', isAudioOnly);
      
      // 如果是纯音频类型，使用预设的文本或生成简短描述
      let ttsText = text;
      if (isAudioOnly) {
        // 根据类型和宠物类型生成简短描述
        if (type === 'pet') {
          const soundTexts = {
            'hamster': '吱吱吱',
            'cat': '喵喵喵',
            'dog': '汪汪汪',
            'guineaPig': '咕噜咕噜'
          };
          ttsText = soundTexts[petTypeId] || '动物声音';
        } else {
          ttsText = '人类声音';
        }
        console.log('生成的音频描述:', ttsText);
      }
      
      // 调用TTS服务生成语音
      console.log('调用TTS服务，参数:', {text: ttsText, type, petTypeId});
      
      // 添加超时和重试逻辑
      let retryCount = 0;
      const maxRetries = 2;
      let result = null;
      
      while (retryCount <= maxRetries) {
        try {
          result = await Promise.race([
            textToSpeech(ttsText, type, petTypeId),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error("TTS生成超时")), 10000)
            )
          ]);
          break; // 如果成功，跳出循环
        } catch (err) {
          console.warn(`TTS请求失败(尝试${retryCount + 1}/${maxRetries + 1}):`, err);
          retryCount++;
          if (retryCount > maxRetries) {
            throw err; // 超过重试次数，抛出错误
          }
          // 等待一秒后重试
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      const { audioUrl, duration, speedRatio } = result || { audioUrl: null, duration: 3 };
      console.log('TTS服务返回结果:', audioUrl, duration, '语速:', speedRatio);
      
      if (audioUrl) {
        console.log('收到TTS结果:', audioUrl, duration);
        
        // 确保audioUrl是有效的完整URL并且必须指向TTS服务器（3001端口）
        let validAudioUrl = audioUrl;
        
        // 添加时间戳参数以避免缓存
        validAudioUrl = `${validAudioUrl}${validAudioUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
        
        // 检查URL是否是完整URL，如果不是则添加TTS服务器前缀
        if (!validAudioUrl.startsWith('http')) {
          validAudioUrl = validAudioUrl.startsWith('/') 
            ? `${normalizedTtsServerUrl}${validAudioUrl}`
            : `${normalizedTtsServerUrl}/${validAudioUrl}`;
        }
        
        // 确保URL指向正确的服务器端口
        if (validAudioUrl.includes('localhost:3000')) {
          validAudioUrl = validAudioUrl.replace('localhost:3000', 'localhost:3001');
        }
        
        console.log('处理后的音频URL:', validAudioUrl);
        
        // 确保音频元素使用完整URL
        audioElement.src = validAudioUrl;
        audioElement.load(); // 加载新的音频源
        
        // 添加播放准备事件监听
        const playPromise = new Promise((resolve, reject) => {
          const canPlayListener = () => {
            console.log('音频准备完毕，可以播放:', validAudioUrl);
            audioElement.removeEventListener('canplaythrough', canPlayListener);
            audioElement.removeEventListener('error', errorListener);
            resolve();
          };
          
          const errorListener = (e) => {
            console.error('音频加载出错:', e);
            audioElement.removeEventListener('canplaythrough', canPlayListener);
            audioElement.removeEventListener('error', errorListener);
            reject(new Error('音频加载失败'));
          };
          
          audioElement.addEventListener('canplaythrough', canPlayListener);
          audioElement.addEventListener('error', errorListener);
          
          // 5秒超时
          setTimeout(() => {
            audioElement.removeEventListener('canplaythrough', canPlayListener);
            audioElement.removeEventListener('error', errorListener);
            reject(new Error('音频加载超时'));
          }, 5000);
        });
        
        // 等待音频准备好后播放
        try {
          await playPromise;
          await audioElement.play();
          console.log('音频开始播放');
        } catch (playError) {
          console.error('音频播放失败:', playError);
          
          // 尝试使用新的Audio对象播放
          try {
            const tempAudio = new Audio(validAudioUrl);
            await tempAudio.play();
            console.log('使用临时Audio对象播放成功');
          } catch (tempError) {
            console.error('临时Audio对象播放失败:', tempError);
          }
        }
        
        // 尝试更新消息对象 (通过Alpine.js)
        try {
          const Alpine = window.Alpine;
          if (Alpine) {
            const appElement = document.querySelector('[x-data]');
            if (appElement) {
              const appData = Alpine.$data(appElement);
              if (appData && appData.messages) {
                const msgIndex = appData.messages.findIndex(m => m.id === msgId);
                if (msgIndex !== -1) {
                  appData.messages[msgIndex].mediaUrl = validAudioUrl;
                  appData.messages[msgIndex].duration = duration;
                }
              }
            }
          }
        } catch (err) {
          console.warn('无法更新消息数据:', err);
        }
      } else {
        // 如果生成失败
        console.warn('生成音频失败');
        
        // 尝试播放默认提示音
        try {
          // 确保通知音频存在
          const defaultAudioPath = '/assets/audio/notification.mp3';
          console.log('尝试播放默认提示音:', defaultAudioPath);
          const defaultAudio = new Audio(defaultAudioPath);
          
          // 添加错误处理
          defaultAudio.onerror = (e) => {
            console.error('默认提示音加载失败:', e);
          };
          
          await defaultAudio.play();
          console.log('默认提示音播放成功');
        } catch (defaultError) {
          console.error('播放默认提示音失败:', defaultError);
        }
      }
      
    } catch (error) {
      console.error('处理语音错误:', error);
    } finally {
      // 确保在结束时移除加载状态
      if (messageElement) {
        try {
          messageElement.classList.remove('audio-loading');
        } catch (e) {
          console.warn('移除加载状态失败:', e);
        }
      }
    }
  };
  
  // 监听所有音频消息的播放事件，用于UI交互
  document.addEventListener('click', async (event) => {
    // 检查是否点击了播放按钮
    const playButton = event.target.closest('.voice-message-play');
    
    if (playButton) {
      try {
        // 获取相关信息
        const messageId = playButton.getAttribute('data-message-id');
        const audioElement = document.getElementById(`audio-${messageId}`);
        
        if (!audioElement) {
          console.error('找不到音频元素:', `audio-${messageId}`);
          return;
        }
        
        // 如果是特殊消息，使用特殊处理
        if (messageId === 'msg-yesterday-003') {
          event.preventDefault();
          event.stopPropagation();
          
          console.log('点击特殊消息，使用特殊处理');
          // 获取消息文本和类型
          const messageItem = playButton.closest('.message-item');
          const petType = messageItem ? messageItem.getAttribute('data-pet-type') || 'hamster' : 'hamster';
          const text = '';
          
          // 调用专门的播放函数
          await window.appData.playVoiceMessage(messageId, text, 'pet', petType);
          return;
        }
        
        // 标准播放逻辑
        if (audioElement) {
          // 播放音频
          if (audioElement.paused) {
            // 先停止所有其他正在播放的音频
            document.querySelectorAll('audio').forEach(audio => {
              if (audio.id !== `audio-${messageId}` && !audio.paused) {
                try {
                  audio.pause();
                  audio.currentTime = 0;
                  
                  // 更新对应的播放按钮状态
                  const otherMessageId = audio.id.replace('audio-', '');
                  const otherButton = document.querySelector(`.voice-message-play[data-message-id="${otherMessageId}"]`);
                  if (otherButton) {
                    const icon = otherButton.querySelector('.material-icons');
                    if (icon) icon.textContent = 'play_arrow';
                    const voiceMsg = otherButton.closest('.voice-message');
                    if (voiceMsg) voiceMsg.classList.remove('playing');
                  }
                } catch (e) {
                  console.warn('停止其他音频时出错:', e);
                }
              }
            });
            
            try {
              // 开始播放
              await audioElement.play();
              
              // 更新播放按钮图标
              const icon = playButton.querySelector('.material-icons');
              if (icon) icon.textContent = 'pause';
              const voiceMsg = playButton.closest('.voice-message');
              if (voiceMsg) voiceMsg.classList.add('playing');
            } catch (error) {
              console.error('播放音频失败:', error);
              
              // 重置UI
              const icon = playButton.querySelector('.material-icons');
              if (icon) icon.textContent = 'play_arrow';
              const voiceMsg = playButton.closest('.voice-message');
              if (voiceMsg) voiceMsg.classList.remove('playing');
            }
          } else {
            // 暂停播放
            try {
              audioElement.pause();
              audioElement.currentTime = 0;
              
              // 更新播放按钮图标
              const icon = playButton.querySelector('.material-icons');
              if (icon) icon.textContent = 'play_arrow';
              const voiceMsg = playButton.closest('.voice-message');
              if (voiceMsg) voiceMsg.classList.remove('playing');
            } catch (error) {
              console.error('暂停音频失败:', error);
            }
          }
        }
      } catch (err) {
        console.error('音频播放事件处理错误:', err);
      }
    }
  });
  
  // 监听音频播放完成事件
  document.addEventListener('ended', (event) => {
    if (event.target.tagName === 'AUDIO') {
      const messageId = event.target.id.replace('audio-', '');
      const playButton = document.querySelector(`.voice-message-play[data-message-id="${messageId}"]`);
      
      if (playButton) {
        // 重置播放状态
        const icon = playButton.querySelector('.material-icons');
        if (icon) icon.textContent = 'play_arrow';
        
        const voiceMsg = playButton.closest('.voice-message');
        if (voiceMsg) voiceMsg.classList.remove('playing');
      }
    }
  }, true);

  // 为所有音频元素添加直接的ended事件监听
  function setupAudioEndedListeners() {
    document.querySelectorAll('audio').forEach(audio => {
      audio.addEventListener('ended', function() {
        const messageId = this.id.replace('audio-', '');
        const playButton = document.querySelector(`.voice-message-play[data-message-id="${messageId}"]`);
        
        if (playButton) {
          try {
            const icon = playButton.querySelector('.material-icons');
            if (icon) icon.textContent = 'play_arrow';
            
            const voiceMsg = playButton.closest('.voice-message');
            if (voiceMsg) voiceMsg.classList.remove('playing');
          } catch (e) {
            console.warn('重置播放状态出错:', e);
          }
        }
      });
    });
  }

  // 初始设置
  setupAudioEndedListeners();
  
  // 创建MutationObserver来监听DOM变化，为新添加的音频元素设置监听器
  const observer = new MutationObserver(mutations => {
    let shouldSetup = false;
    
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          if (node.tagName === 'AUDIO' || 
              (node.nodeType === 1 && node.querySelector('audio'))) {
            shouldSetup = true;
          }
        });
      }
    });
    
    if (shouldSetup) {
      setupAudioEndedListeners();
    }
  });
  
  // 开始观察DOM变化
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
}

// 导出直接播放音频的函数
export function playAudio(url) {
  const audio = new Audio(url);
  return audio.play();
}

export default {
  initAudioPlayer,
  playAudio
}; 