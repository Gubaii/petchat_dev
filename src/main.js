import './styles/index.css';
import Alpine from 'alpinejs';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

// 导入虚拟数据
import { petData, messageData, reportData, getEnvironmentData, allPetsData, catMessages, dogMessages, guineaPigMessages, groupMessages, systemMessagesV2 } from './mock/data.js';

// 用户头像 - 更新为更好看的图像
const userAvatar = 'https://ui-avatars.com/api/?name=Me&background=3B82F6&color=fff&bold=true&font-size=0.6&rounded=true';

// 管家头像 - 更新为更专业的管家图标
const butlerAvatar = 'https://cdn-icons-png.flaticon.com/512/2271/2271092.png';

// 等待 DOM 加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  // 初始化 ECharts
  window.echarts = echarts;
  
  // 为 Alpine.js 提供全局数据
  window.appData = {
    // 全局状态
    currentPage: 'chatList', // 默认显示聊天列表页面
    currentChatType: null, // 当前聊天类型：'pet' 或 'system' 或 'group'
    currentChatName: '', // 当前聊天名称
    pet: petData,
    allPetsData: allPetsData, // 所有宠物数据
    currentPetId: null, // 当前选中的宠物ID
    messages: [],  // 当前显示的消息
    allMessages: messageData, // 所有消息
    systemMessages: systemMessagesV2, // 使用新的系统消息
    petMessages: [], // 宠物和用户的对话
    groupMessages: groupMessages, // 群组消息
    // 为每个宠物创建单独的消息数组
    petSpecificMessages: {
      'pet-001': messageData, // 仓鼠消息
      'pet-002': catMessages, // 猫消息
      'pet-003': dogMessages, // 狗消息
      'pet-004': guineaPigMessages // 荷兰猪消息
    },
    newMessage: '',
    isVoiceMode: false,
    recording: false,
    recordingStartTime: null,
    recordingTimer: null,
    recordingDuration: 0,
    audioChunks: [],
    mediaRecorder: null,
    environmentData: getEnvironmentData(),
    showModal: false,
    activeReportTab: 'health',
    currentReport: null,
    loadingMessages: false,
    
    // 宠物信息设置
    showPetSettings: false, // 控制宠物设置面板显示
    petSettings: {
      autoReply: true,
      dailyReport: true,
      alertNotification: true,
      messageStyle: 'balanced'
    },
    
    // 初始化方法
    init() {
      // 加载数据
      this.loadData();
      
      // 监听标签页切换，确保图表在显示时正确渲染
      this.$watch('activeReportTab', (value) => {
        console.log('标签页切换到:', value);
        if (value === 'activity') {
          // 延迟一下等DOM更新完成
          setTimeout(() => {
            // 如果是月报并且切换到活动标签，重新渲染行为变化趋势图
            if (this.currentReport?.reportType === 'monthly') {
              console.log('重新渲染月度行为变化趋势图');
              const chartContainer = document.getElementById('behaviorChangeChart');
              if (chartContainer) {
                // 获取父元素宽度
                const parentWidth = chartContainer.parentElement.offsetWidth || 300;
                console.log('父容器宽度:', parentWidth);
                
                // 先清除旧图表
                const existingChart = echarts.getInstanceByDom(chartContainer);
                if (existingChart) {
                  existingChart.dispose();
                }
                
                // 设置固定宽度
                chartContainer.style.width = parentWidth + 'px';
                chartContainer.style.height = '300px';
                
                // 创建新图表
                const chart = echarts.init(chartContainer, null, {
                  width: parentWidth,
                  height: 300
                });
                
                const series = this.currentReport.chartData.behaviorChanges.datasets.map(dataset => {
                  return {
                    name: dataset.name,
                    type: 'line',
                    data: dataset.values,
                    smooth: true,
                    symbolSize: 6,
                    symbol: 'circle'
                  };
                });
                
                const option = {
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data: this.currentReport.chartData.behaviorChanges.datasets.map(dataset => dataset.name),
                    bottom: 10,
                    textStyle: {
                      fontSize: 12
                    }
                  },
                  grid: {
                    left: 50,
                    right: 20,
                    bottom: 60,
                    top: 30,
                    containLabel: true
                  },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.currentReport.chartData.behaviorChanges.weeks,
                    axisLabel: {
                      interval: 0,
                      fontSize: 12
                    }
                  },
                  yAxis: {
                    type: 'value',
                    name: '活动量(分钟)',
                    axisLabel: {
                      formatter: '{value}',
                      fontSize: 12
                    },
                    nameTextStyle: {
                      fontSize: 12
                    }
                  },
                  series: series,
                  color: ['#5470c6', '#91cc75', '#fac858', '#ee6666']
                };
                
                chart.setOption(option);
                
                // 额外加一次resize以确保尺寸正确
                setTimeout(() => {
                  console.log('再次调整大小');
                  chart.resize({width: parentWidth});
                }, 300);
              }
            }
          }, 100);
        }
      });
    },
    
    // 将群聊排序到最后的方法
    loadData() {
      console.log('加载数据...');
      // 设置静态数据
      this.allPetsData = allPetsData;
      this.environmentData = getEnvironmentData();
      
      // 初始化消息数据
      this.initializeMessages();
      
      // 为导航和其他元素设置初始参数
      this.currentPage = 'chatList';
      this.currentChatType = null;
      this.activeReportTab = 'health';
      
      // 绑定全局实例以便HTML元素可以访问
      window.appData = this;
      
      // 初始化语音录制
      this.initializeVoiceRecording();
      
      // 加载ECharts库，用于图表渲染
      if (!window.echarts) {
        // 加载ECharts库
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js';
        script.onload = () => {
          console.log('ECharts库加载成功');
        };
        script.onerror = (error) => {
          console.error('ECharts库加载失败:', error);
        };
        document.head.appendChild(script);
      }
      
      // 延迟执行，确保DOM已完全加载
      setTimeout(() => {
        this.reorderChatList();
      }, 100);
    },
    
    // 重新排序聊天列表，将群聊移到最后
    reorderChatList() {
      console.log('重新排序聊天列表...');
      // 获取聊天列表容器
      const chatListContainer = document.querySelector('.overflow-y-auto.h-\\[calc\\(100\\%-104px\\)\\]');
      if (!chatListContainer) {
        console.warn('未找到聊天列表容器');
        return;
      }
      
      // 获取所有聊天项目
      const chatItems = chatListContainer.querySelectorAll('.p-4.border-b');
      if (!chatItems || chatItems.length === 0) {
        console.warn('未找到聊天项目');
        return;
      }
      
      // 获取第一个聊天项目（群聊）
      const groupChatItem = chatItems[0];
      if (!groupChatItem) {
        console.warn('未找到群聊项目');
        return;
      }
      
      // 检查是否确实是群聊项目（可以通过内容确认）
      const title = groupChatItem.querySelector('h3');
      if (title && title.textContent.includes('宠物家族群')) {
        console.log('找到群聊，将其移动到最后');
        // 将群聊项目移动到最后
        chatListContainer.appendChild(groupChatItem);
        // 添加标识，以便将来识别
        groupChatItem.setAttribute('data-chat-type', 'group');
      } else {
        console.warn('第一个项目不是群聊');
      }
    },
    
    // 初始化所有消息数据
    initializeMessages() {
      console.log('初始化消息...');
      
      // 确保每个宠物都有对应的消息数组
      this.petSpecificMessages = {};
      
      // 仓鼠消息
      this.petSpecificMessages['pet-001'] = messageData.filter(msg => !msg.petId || msg.petId === 'pet-001');
      
      // 猫咪消息
      this.petSpecificMessages['pet-002'] = catMessages;
      
      // 狗狗消息
      this.petSpecificMessages['pet-003'] = dogMessages;
      
      // 豚鼠消息
      this.petSpecificMessages['pet-004'] = guineaPigMessages;
      
      // 添加智能管家与用户的对话
      this.systemMessages = [
        {
          id: 'system-msg-1',
          type: 'system',
          contentType: 'text',
          content: '欢迎使用宠聊智能管家！我会为您提供所有宠物的健康报告和实时状态。如需查看详细报告，请点击相应的报告卡片。',
          timestamp: Date.now() - 86400000 * 4, // 4天前
          read: true,
          category: 'chat',
          urgent: 0,
        },
        {
          id: 'user-msg-1',
          type: 'user',
          contentType: 'text',
          content: '我的宠物今天状态怎么样？',
          timestamp: Date.now() - 86400000 * 4 + 1000 * 60 * 10, // 4天前+10分钟
          read: true,
          category: 'chat',
          urgent: 0,
        },
        {
          id: 'system-msg-2',
          type: 'system',
          contentType: 'text',
          content: '根据最新监测数据，您的所有宠物今天状态良好：豆豆活动量增加20%，咪咪的睡眠质量优，旺财进食正常，球球的体重略有增加但在健康范围内。',
          timestamp: Date.now() - 86400000 * 4 + 1000 * 60 * 12, // 4天前+12分钟
          read: true,
          category: 'chat',
          urgent: 0,
        },
        {
          id: 'user-msg-2',
          type: 'user',
          contentType: 'text',
          content: '球球最近吃什么食物好？',
          timestamp: Date.now() - 86400000 * 3, // 3天前
          read: true,
          category: 'chat',
          urgent: 0,
        },
        {
          id: 'system-msg-3',
          type: 'system',
          contentType: 'text',
          content: '根据球球的健康数据和饮食习惯，建议提供高纤维蔬菜（如胡萝卜、黄瓜）和适量的荷兰猪专用主粮。最近一周的健康监测显示，球球对甜椒反应良好，可以作为零食适量添加。同时，请确保提供充足的新鲜牧草。',
          timestamp: Date.now() - 86400000 * 3 + 1000 * 60 * 2, // 3天前+2分钟
          read: true,
          category: 'chat',
          urgent: 0,
        },
        // 添加月报信息的文本形式
        {
          id: 'system-msg-4',
          type: 'system',
          contentType: 'text',
          content: '【10月宠物健康月报】所有宠物本月健康评分均在85分以上，球球体重有轻微增加。详细数据请查看月报卡片。',
          timestamp: Date.now() - 86400000 * 2, // 2天前
          read: true,
          category: 'chat',
          urgent: 0,
        },
        // 周报信息文本形式
        {
          id: 'system-msg-5',
          type: 'system',
          contentType: 'text',
          content: '【本周宠物健康周报】您所有的宠物本周健康状况优良，豆豆运动量较上周增加15%。详细数据请查看周报卡片。',
          timestamp: Date.now() - 86400000 * 1, // 1天前
          read: true,
          category: 'chat',
          urgent: 0,
        },
        {
          id: 'user-msg-3',
          type: 'user',
          contentType: 'text',
          content: '咪咪最近有什么异常表现吗？',
          timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3小时前
          read: true,
          category: 'chat',
          urgent: 0,
        },
        {
          id: 'system-msg-6',
          type: 'system',
          contentType: 'text',
          content: '咪咪最近总体状态良好，没有明显异常。监测到的小变化有：昨晚睡眠时间比平均水平少约30分钟；饮水量比平时略少10%，但仍在正常范围内。建议在白天增加一些互动玩耍时间，并确保水盆始终有清水。',
          timestamp: Date.now() - 1000 * 60 * 60 * 3 + 1000 * 60 * 2, // 3小时前+2分钟
          read: true,
          category: 'chat',
          urgent: 0,
        },
        // 今日健康报告文本形式
        {
          id: 'system-msg-7',
          type: 'system',
          contentType: 'text',
          content: '【今日宠物健康日报】您的宠物们今天整体状态良好，活动量有所提高。详细信息请查看日报卡片。',
          timestamp: Date.now() - 1000 * 60 * 30, // 30分钟前
          read: true,
          category: 'chat',
          urgent: 0,
        },
        {
          id: 'user-msg-4',
          type: 'user',
          contentType: 'text',
          content: '帮我分析一下豆豆最近的活动规律',
          timestamp: Date.now() - 1000 * 60 * 10, // 10分钟前
          read: true, 
          category: 'chat',
          urgent: 0,
        },
        {
          id: 'system-msg-8',
          type: 'system',
          contentType: 'text',
          content: '豆豆的活动规律分析：\n1. 活动高峰期：每天傍晚18:00-21:00，比一个月前增加25分钟\n2. 跑轮使用：平均每天63分钟，大多集中在夜间\n3. 觅食行为：最活跃时段在投喂后30分钟内\n4. 休息模式：白天以短睡为主，平均每次休息45分钟\n\n总体来说，豆豆的活动规律符合健康仓鼠的标准，夜间活动比例增加是积极变化。',
          timestamp: Date.now() - 1000 * 60 * 8, // 8分钟前
          read: true,
          category: 'chat',
          urgent: 0,
        }
      ];
      
      // 将原来的系统消息卡片也添加到消息列表中
      this.systemMessages = [...this.systemMessages, ...systemMessagesV2];
      
      // 确保所有报告卡片和提醒都包含在系统消息中
      // 每个卡片都添加data-report-id属性以便于点击处理
      console.log('群组消息数量:', groupMessages.length);
      console.log('系统消息数量:', this.systemMessages.length);
      
      // 预处理所有消息
      this.preprocessMessages();
    },
    
    // 预处理消息，修复可能的问题
    preprocessMessages() {
      // 确保所有媒体消息的contentType是正确的
      this.allMessages.forEach(msg => {
        if (msg.mediaUrl && !msg.contentType) {
          // 根据文件扩展名推断内容类型
          if (msg.mediaUrl.endsWith('.mp3') || msg.mediaUrl.endsWith('.wav')) {
            msg.contentType = 'voice';
          } else if (msg.mediaUrl.endsWith('.jpg') || msg.mediaUrl.endsWith('.png') || msg.mediaUrl.endsWith('.gif') || msg.mediaUrl.endsWith('.jpeg')) {
            msg.contentType = 'image';
          } else if (msg.mediaUrl.endsWith('.mp4') || msg.mediaUrl.endsWith('.webm')) {
            msg.contentType = 'video';
          }
        }
        
        // 为语音消息添加默认时长
        if (msg.contentType === 'voice' && !msg.duration) {
          msg.duration = 3;
        }
      });
    },
    
    // 打开指定类型的聊天
    openChat(type, petId) {
      console.log('尝试打开聊天:', type, '宠物ID:', petId);
      this.currentChatType = type;
      
      if (type === 'pet') {
        // 设置当前宠物ID
        this.currentPetId = petId || 'pet-001';
        
        // 获取当前宠物信息
        const currentPet = this.allPetsData.find(pet => pet.id === this.currentPetId);
        if (!currentPet) {
          console.error('未找到宠物信息:', this.currentPetId);
          return;
        }
        
        // 更新当前宠物信息
        this.pet = currentPet;
        
        // 设置聊天名称
        this.currentChatName = `与${currentPet.name}聊天中`;
        
        // 获取对应宠物的消息
        this.messages = [...this.petSpecificMessages[this.currentPetId]];
        console.log('设置宠物聊天消息:', this.messages.length);
      } else if (type === 'system') {
        this.currentChatName = '智能管家';
        this.messages = [...this.systemMessages]; // 使用数组复制确保触发响应式更新
        console.log('设置系统消息:', this.messages.length);
      } else if (type === 'group') {
        this.currentChatName = '宠物家族群';
        this.messages = [...this.groupMessages]; // 使用群组消息
        console.log('设置群组消息:', this.messages.length);
      }
      
      this.currentPage = 'chat';
      
      // 确保消息按时间排序
      this.messages.sort((a, b) => a.timestamp - b.timestamp);
      
      // 打印用户消息数量进行调试
      console.log('用户消息数量:', this.messages.filter(m => m.type === 'user').length);
      console.log('宠物消息数量:', this.messages.filter(m => m.type === 'pet').length);
      
      // 使用setTimeout确保DOM已更新后再渲染消息和滚动
      setTimeout(() => {
        this.renderMessages();
        
        const container = document.getElementById('chatContainer');
        if (container) {
          console.log('滚动到底部');
          container.scrollTop = container.scrollHeight;
        } else {
          console.log('未找到聊天容器元素');
        }
      }, 100);
    },
    
    // 渲染消息到聊天容器
    renderMessages() {
      console.log('渲染消息，总数:', this.messages.length);
      
      const chatContainer = document.getElementById('chatContainer');
      if (!chatContainer) {
        console.error('未找到聊天容器元素');
        return;
      }
      
      // 清空现有内容
      chatContainer.innerHTML = '';
      
      // 如果没有消息，显示空状态
      if (!this.messages || this.messages.length === 0) {
        chatContainer.innerHTML = '<div class="flex items-center justify-center h-full text-text-secondary">暂无聊天记录</div>';
        return;
      }
      
      // 按日期分组消息
      const groupedMessages = this.getGroupedMessages();
      
      // 为每个组创建HTML
      for (const dateKey in groupedMessages) {
        // 创建日期分隔线
        const dateHeader = document.createElement('div');
        dateHeader.className = 'text-center my-3';
        dateHeader.innerHTML = `<div class="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-text-secondary">${dateKey}</div>`;
        chatContainer.appendChild(dateHeader);
        
        // 创建消息组
        const messagesGroup = document.createElement('div');
        messagesGroup.className = 'space-y-4';
        
        // 渲染该组中的每条消息
        for (const msg of groupedMessages[dateKey]) {
          // 系统卡片消息特殊处理
          if (msg.type === 'system' && (msg.contentType === 'report-card' || msg.contentType === 'alert-card')) {
            // 创建系统卡片消息，添加管家头像
            const cardElement = document.createElement('div');
            cardElement.className = 'flex items-start my-3';
            cardElement.setAttribute('data-message-id', msg.id);
            cardElement.addEventListener('click', () => this.messageClicked(msg));
            
            const cardContent = `
              <div class="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0 bg-blue-50 flex items-center justify-center">
                <img src="${butlerAvatar}" alt="管家头像" class="w-8 h-8 object-cover">
              </div>
              <div class="flex-1 max-w-[70%]">
                <div class="bg-gray-50 rounded-2xl rounded-bl-none p-3 chat-bubble-in overflow-hidden ${msg.color || ''}">
                  <div class="flex items-start">
                    <div class="w-10 h-10 rounded-full ${msg.color || 'bg-gray-100'} flex items-center justify-center mr-3">
                      <span class="material-icons ${msg.iconColor || 'text-gray-500'}">${msg.icon || 'info'}</span>
                    </div>
                    <div class="flex-1">
                      <div class="font-medium mb-1">${msg.title || '通知'}</div>
                      <div class="text-sm">${msg.summary || msg.content}</div>
                      <div class="text-xs text-text-secondary mt-1">${msg.details || ''}</div>
                      <div class="mt-2 text-xs text-primary">查看详情 ></div>
                    </div>
                  </div>
                </div>
              </div>
            `;
            
            cardElement.innerHTML = cardContent;
            messagesGroup.appendChild(cardElement);
          } 
          // 群组消息特殊处理
          else if (this.currentChatType === 'group' && msg.type === 'pet' && msg.petId) {
            const petInfo = this.allPetsData.find(pet => pet.id === msg.petId);
            if (!petInfo) continue;
            
            // 创建群组中的宠物消息
            const messageElement = document.createElement('div');
            messageElement.className = 'flex items-start my-3';
            messageElement.setAttribute('data-message-id', msg.id);
            
            // 宠物群组消息内容
            const messageContent = `
              <div class="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0" 
                  onclick="window.appData.openPetSettings('${msg.petId}')">
                <img src="${petInfo.avatar}" alt="${petInfo.name}头像" class="w-full h-full object-cover">
              </div>
              <div class="flex-1">
                <div class="flex items-center mb-1">
                  <span class="text-sm font-medium mr-1">${petInfo.name}</span>
                  <span class="text-xs text-text-secondary">${this.formatMessageTime(msg.timestamp)}</span>
                </div>
                ${msg.contentType === 'image' ? 
                  `<div class="bg-pet rounded-2xl rounded-bl-none p-2 chat-bubble-in">
                     <img src="${msg.mediaUrl}" class="rounded-lg max-w-full max-h-60" alt="${msg.content}">
                     ${msg.content ? `<div class="mt-2 text-sm text-gray-600">${msg.content}</div>` : ''}
                   </div>` : 
                  msg.contentType === 'voice' ?
                  `<div class="bg-pet rounded-2xl rounded-bl-none p-3 chat-bubble-in">
                     <div class="flex flex-col">
                       <audio src="${msg.mediaUrl}" id="audio-${msg.id}"></audio>
                       <div class="flex items-center mb-2">
                         <button onclick="document.getElementById('audio-${msg.id}').play()" class="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2 focus:outline-none">
                           <span class="material-icons text-primary text-base">play_arrow</span>
                         </button>
                         <div class="flex items-center">
                           <div class="voice-wave flex items-end h-4 space-x-0.5">
                             <span class="inline-block w-0.5 h-1 bg-black"></span>
                             <span class="inline-block w-0.5 h-2 bg-black"></span>
                             <span class="inline-block w-0.5 h-3 bg-black"></span>
                             <span class="inline-block w-0.5 h-2 bg-black"></span>
                             <span class="inline-block w-0.5 h-1 bg-black"></span>
                           </div>
                         </div>
                         <span class="ml-2 text-xs text-text-secondary">${msg.duration}"</span>
                       </div>
                       ${msg.content ? `<div class="text-sm text-gray-600">${msg.content}</div>` : ''}
                     </div>
                   </div>` :
                  msg.contentType === 'video' ?
                  `<div class="bg-pet rounded-2xl rounded-bl-none p-2 chat-bubble-in">
                     <video src="${msg.mediaUrl}" class="rounded-lg max-h-60 w-auto" controls></video>
                     ${msg.content ? `<div class="mt-2 text-sm text-gray-600">${msg.content}</div>` : ''}
                   </div>` :
                  `<div class="bg-pet rounded-2xl rounded-bl-none p-3 chat-bubble-in break-words">
                     ${msg.content}
                   </div>`
                }
              </div>
            `;
            
            messageElement.innerHTML = messageContent;
            messagesGroup.appendChild(messageElement);
          }
          // 标准消息处理
          else {
            // 创建消息元素
            const messageElement = document.createElement('div');
            messageElement.setAttribute('data-message-id', msg.id);
            
            if (msg.type === 'user') {
              // 用户消息 (右对齐)
              messageElement.className = 'flex items-start my-3 justify-end';
              
              if (msg.contentType === 'text') {
                messageElement.innerHTML = `
                  <div class="flex-1 flex justify-end">
                    <div class="bg-blue-500 rounded-2xl rounded-br-none p-3 text-white chat-bubble-out break-words max-w-[70%]">${msg.content}</div>
                  </div>
                  <div class="w-10 h-10 rounded-full overflow-hidden ml-2 flex-shrink-0">
                    <img src="${userAvatar}" alt="用户头像" class="w-full h-full object-cover">
                  </div>
                `;
              } else if (msg.contentType === 'voice') {
                messageElement.innerHTML = `
                  <div class="flex-1 flex justify-end">
                    <div class="bg-blue-500 rounded-2xl rounded-br-none p-3 text-white chat-bubble-out max-w-[70%]">
                      <div class="flex flex-col">
                        <audio src="${msg.mediaUrl}" id="audio-${msg.id}"></audio>
                        <div class="flex items-center mb-2">
                          <button onclick="document.getElementById('audio-${msg.id}').play()" class="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2 focus:outline-none">
                            <span class="material-icons text-blue-500 text-base">play_arrow</span>
                          </button>
                          <div class="flex items-center">
                            <div class="voice-wave flex items-end h-4 space-x-0.5">
                              <span class="inline-block w-0.5 h-1 bg-white"></span>
                              <span class="inline-block w-0.5 h-2 bg-white"></span>
                              <span class="inline-block w-0.5 h-3 bg-white"></span>
                              <span class="inline-block w-0.5 h-2 bg-white"></span>
                              <span class="inline-block w-0.5 h-1 bg-white"></span>
                            </div>
                          </div>
                          <span class="ml-2 text-xs text-blue-100">${msg.duration}"</span>
                        </div>
                        ${msg.content ? `<div class="text-sm text-blue-100">${msg.content}</div>` : ''}
                      </div>
                    </div>
                  </div>
                  <div class="w-10 h-10 rounded-full overflow-hidden ml-2 flex-shrink-0">
                    <img src="${userAvatar}" alt="用户头像" class="w-full h-full object-cover">
                  </div>
                `;
              } else if (msg.contentType === 'image') {
                messageElement.innerHTML = `
                  <div class="flex-1 flex justify-end">
                    <div class="bg-blue-500 rounded-2xl rounded-br-none p-2 text-white chat-bubble-out max-w-[70%]">
                      <img src="${msg.mediaUrl}" class="rounded-lg max-h-60 max-w-full">
                      ${msg.content ? `<div class="mt-2 text-sm text-blue-100">${msg.content}</div>` : ''}
                    </div>
                  </div>
                  <div class="w-10 h-10 rounded-full overflow-hidden ml-2 flex-shrink-0">
                    <img src="${userAvatar}" alt="用户头像" class="w-full h-full object-cover">
                  </div>
                `;
              } else if (msg.contentType === 'video') {
                messageElement.innerHTML = `
                  <div class="flex-1 flex justify-end">
                    <div class="bg-blue-500 rounded-2xl rounded-br-none p-2 text-white chat-bubble-out max-w-[70%]">
                      <video src="${msg.mediaUrl}" class="rounded-lg max-h-60 w-auto" controls></video>
                      ${msg.content ? `<div class="mt-2 text-sm text-blue-100">${msg.content}</div>` : ''}
                    </div>
                  </div>
                  <div class="w-10 h-10 rounded-full overflow-hidden ml-2 flex-shrink-0">
                    <img src="${userAvatar}" alt="用户头像" class="w-full h-full object-cover">
                  </div>
                `;
              }
            } else if (msg.type === 'pet' && this.currentChatType === 'pet') {
              // 宠物消息 (左对齐)
              messageElement.className = 'flex items-start my-3';
              
              if (msg.contentType === 'text') {
                messageElement.innerHTML = `
                  <div class="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0" 
                      onclick="window.appData.openPetSettings(${JSON.stringify(this.currentPetId)})">
                    <img src="${this.pet.avatar}" alt="宠物头像" class="w-full h-full object-cover">
                  </div>
                  <div class="flex flex-col max-w-[70%]">
                    <div class="bg-pet rounded-2xl rounded-bl-none p-3 chat-bubble-in break-words">${msg.content}</div>
                  </div>
                `;
              } else if (msg.contentType === 'voice') {
                messageElement.innerHTML = `
                  <div class="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0" 
                      onclick="window.appData.openPetSettings(${JSON.stringify(this.currentPetId)})">
                    <img src="${this.pet.avatar}" alt="宠物头像" class="w-full h-full object-cover">
                  </div>
                  <div class="flex flex-col max-w-[70%]">
                    <div class="bg-pet rounded-2xl rounded-bl-none p-3 chat-bubble-in">
                      <div class="flex flex-col">
                        <audio src="${msg.mediaUrl}" id="audio-${msg.id}"></audio>
                        <div class="flex items-center mb-2">
                          <button onclick="document.getElementById('audio-${msg.id}').play()" class="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2 focus:outline-none">
                            <span class="material-icons text-primary text-base">play_arrow</span>
                          </button>
                          <div class="flex items-center">
                            <div class="voice-wave flex items-end h-4 space-x-0.5">
                              <span class="inline-block w-0.5 h-1 bg-black"></span>
                              <span class="inline-block w-0.5 h-2 bg-black"></span>
                              <span class="inline-block w-0.5 h-3 bg-black"></span>
                              <span class="inline-block w-0.5 h-2 bg-black"></span>
                              <span class="inline-block w-0.5 h-1 bg-black"></span>
                            </div>
                          </div>
                          <span class="ml-2 text-xs text-text-secondary">${msg.duration}"</span>
                        </div>
                        ${msg.content ? `<div class="text-sm text-gray-600">${msg.content}</div>` : ''}
                      </div>
                    </div>
                  </div>
                `;
              } else if (msg.contentType === 'image') {
                messageElement.innerHTML = `
                  <div class="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0" 
                      onclick="window.appData.openPetSettings(${JSON.stringify(this.currentPetId)})">
                    <img src="${this.pet.avatar}" alt="宠物头像" class="w-full h-full object-cover">
                  </div>
                  <div class="flex flex-col max-w-[70%]">
                    <div class="bg-pet rounded-2xl rounded-bl-none p-2 chat-bubble-in">
                      <img src="${msg.mediaUrl}" class="rounded-lg max-h-60 max-w-full">
                      ${msg.content ? `<div class="mt-2 text-sm text-gray-600">${msg.content}</div>` : ''}
                    </div>
                  </div>
                `;
              } else if (msg.contentType === 'video') {
                messageElement.innerHTML = `
                  <div class="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0" 
                      onclick="window.appData.openPetSettings(${JSON.stringify(this.currentPetId)})">
                    <img src="${this.pet.avatar}" alt="宠物头像" class="w-full h-full object-cover">
                  </div>
                  <div class="flex flex-col max-w-[70%]">
                    <div class="bg-pet rounded-2xl rounded-bl-none p-2 chat-bubble-in">
                      <video src="${msg.mediaUrl}" class="rounded-lg max-h-60 w-auto" controls></video>
                      ${msg.content ? `<div class="mt-2 text-sm text-gray-600">${msg.content}</div>` : ''}
                    </div>
                  </div>
                `;
              }
            } else if (msg.type === 'system' && this.currentChatType === 'system') {
              // 管家/系统消息 (左对齐)
              messageElement.className = 'flex items-start my-3';
              messageElement.innerHTML = `
                <div class="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0 bg-blue-50 flex items-center justify-center">
                  <img src="${butlerAvatar}" alt="管家头像" class="w-8 h-8 object-cover">
                </div>
                <div class="flex flex-col max-w-[70%]">
                  <div class="bg-gray-100 rounded-2xl rounded-bl-none p-3 chat-bubble-in break-words">
                    ${msg.content}
                  </div>
                </div>
              `;
            } else if (msg.type === 'system' && this.currentChatType === 'group') {
              // 群组中的系统消息 (居中通知)
              messageElement.className = 'flex justify-center my-3';
              messageElement.innerHTML = `
                <div class="bg-gray-100 px-3 py-1 rounded-full text-xs text-text-secondary">
                  ${msg.content}
                </div>
              `;
            }
            
            // 添加消息到组
            messagesGroup.appendChild(messageElement);
          }
        }
        
        // 添加消息组到容器
        chatContainer.appendChild(messagesGroup);
      }
      
      // 为语音消息添加播放事件
      document.querySelectorAll('audio').forEach(audio => {
        const playButton = audio.parentElement.querySelector('button');
        if (playButton) {
          playButton.addEventListener('click', function(event) {
            event.preventDefault();
            audio.play();
          });
        }
      });
    },
    
    // 返回聊天列表
    goBackToList() {
      this.currentPage = 'chatList';
      this.currentChatType = null;
    },
    
    // 初始化报告详情和图表
    initReportDetails(reportMessage) {
      if (this.currentPage === 'report-detail' && reportMessage) {
        const chartData = reportMessage.chartData;
        if (!chartData) {
          console.error('报告数据为空');
          return;
        }
        
        this.$nextTick(() => {
          // 根据报告类型渲染不同的图表
          switch(reportMessage.reportType) {
            case 'daily':
              this.renderDailyReportCharts(chartData);
              break;
            case 'weekly':
              this.renderWeeklyReportCharts(chartData);
              break;
            case 'monthly':
              this.renderMonthlyReportCharts(chartData);
              break;
          }
          
          // 监听窗口大小变化，重新调整图表
          window.addEventListener('resize', this.resizeAllCharts);
          
          // 初始调整一次以确保显示正确
          this.resizeAllCharts();
        });
      }
    },
    
    // 添加调整所有图表尺寸的方法
    resizeAllCharts() {
      const charts = document.querySelectorAll('[id$="Chart"]');
      charts.forEach(chart => {
        // 确保容器宽度正确
        chart.style.width = '100%';
        
        // 当容器可见时才调整大小
        if (chart.offsetParent !== null) {
          const instance = echarts.getInstanceByDom(chart);
          if (instance) {
            // 先清除尺寸限制
            chart.style.width = '100%';
            chart.style.height = chart.style.height || '300px';
            
            // 延迟执行resize确保DOM已更新
            setTimeout(() => {
              instance.resize({
                width: 'auto',
                height: 'auto'
              });
            }, 50);
          } else {
            console.warn('未找到图表实例:', chart.id);
          }
        }
      });
    },
    
    // 格式化方法
    formatMessageDate(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return '今天';
      } else if (diffDays === 1) {
        return '昨天';
      } else if (diffDays === 2) {
        return '前天';
      } else if (diffDays < 7) {
        return `${diffDays}天前`;
      } else {
        return dayjs(date).format('MM月DD日');
      }
    },
    
    formatMessageTime(timestamp) {
      return dayjs(timestamp).format('HH:mm');
    },
    
    // 消息处理
    sortMessages() {
      this.allMessages.sort((a, b) => a.timestamp - b.timestamp);
      this.systemMessages.sort((a, b) => a.timestamp - b.timestamp);
      this.petMessages.sort((a, b) => a.timestamp - b.timestamp);
      if (this.messages.length > 0) {
        this.messages.sort((a, b) => a.timestamp - b.timestamp);
      }
    },
    
    getGroupedMessages() {
      const grouped = {};
      
      if (!this.messages || this.messages.length === 0) {
        console.log('没有消息可分组');
        return {};
      }
      
      console.log('开始消息分组, 消息总数:', this.messages.length);
      
      this.messages.forEach(message => {
        const dateStr = this.formatMessageDate(message.timestamp);
        if (!grouped[dateStr]) {
          grouped[dateStr] = [];
        }
        grouped[dateStr].push(message);
      });
      
      // 打印每个日期分组的消息数量
      Object.keys(grouped).forEach(date => {
        console.log(`日期 ${date}: ${grouped[date].length}条消息`);
      });
      
      console.log('分组后的消息日期:', Object.keys(grouped));
      return grouped;
    },
    
    // 消息点击处理，特别是报告卡片
    messageClicked(message) {
      console.log('消息被点击:', message);
      
      // 如果是报告卡片，打开报告详情
      if (message.contentType === 'report-card' && message.reportType) {
        console.log('打开报告详情:', message.reportType);
        this.openReportDetail(message);
      }
      // 如果是提醒卡片，可以执行其他操作
      else if (message.contentType === 'alert-card') {
        // 处理提醒卡片点击
        alert(`提示: ${message.title} - ${message.details}`);
      }
    },
    
    sendTextMessage() {
      if (this.newMessage.trim() === '') return;
      
      const newMsg = {
        id: `msg-${Date.now()}`,
        type: 'user',
        contentType: 'text',
        content: this.newMessage,
        timestamp: Date.now(),
        read: true,
        category: 'chat',
        urgent: 0,
      };
      
      // 添加消息到当前聊天
      this.messages.push(newMsg);
      
      // 根据不同聊天类型保存消息到对应数组
      if (this.currentChatType === 'pet' && this.currentPetId) {
        this.petSpecificMessages[this.currentPetId].push(newMsg);
      } else if (this.currentChatType === 'system') {
        this.systemMessages.push(newMsg);
      } else if (this.currentChatType === 'group') {
        this.groupMessages.push(newMsg);
      }
      
      const sentMessage = this.newMessage;
      this.newMessage = '';
      
      // 重新渲染消息以确保显示
      this.renderMessages();
      
      // 滚动到底部
      setTimeout(() => {
        const container = document.getElementById('chatContainer');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
      
      // 模拟回复（根据聊天类型）
      if (this.currentChatType === 'pet') {
        setTimeout(() => {
          this.simulatePetReply(sentMessage);
          // 重新渲染消息并滚动到底部
          this.renderMessages();
          setTimeout(() => {
            const container = document.getElementById('chatContainer');
            if (container) {
              container.scrollTop = container.scrollHeight;
            }
          }, 100);
        }, 1000 + Math.random() * 2000);
      } else if (this.currentChatType === 'system') {
        setTimeout(() => {
          this.simulateSystemReply(sentMessage);
          // 重新渲染消息并滚动到底部
          this.renderMessages();
          setTimeout(() => {
            const container = document.getElementById('chatContainer');
            if (container) {
              container.scrollTop = container.scrollHeight;
            }
          }, 100);
        }, 1000 + Math.random() * 1000);
      } else if (this.currentChatType === 'group') {
        setTimeout(() => {
          this.simulateGroupReply(sentMessage);
          // 重新渲染消息并滚动到底部
          this.renderMessages();
          setTimeout(() => {
            const container = document.getElementById('chatContainer');
            if (container) {
              container.scrollTop = container.scrollHeight;
            }
          }, 100);
        }, 1000 + Math.random() * 1000);
      }
    },
    
    // 语音消息
    initializeVoiceRecording() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            this.mediaRecorder = new MediaRecorder(stream);
            
            this.mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                this.audioChunks.push(event.data);
              }
            };
            
            this.mediaRecorder.onstop = () => {
              const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
              const audioUrl = URL.createObjectURL(audioBlob);
              
              // 为用户语音消息添加随机文本内容 - 更加俏皮的风格
              const userVoiceTexts = [
                '豆豆豆～今天过得怎么样呀？(^▽^)ノ 有没有想我啊～',
                '猜猜我给你带了什么零食回来！(*^▽^*) 是你最爱的葵花籽哦～',
                '豆豆乖不乖呀？(^ω^) 有没有好好吃饭饭呀～',
                '马上回家咯！ヾ(^▽^*)o 等我抱抱我们家的小可爱～',
                '哇～今天天气超好的 (^◡^)ﾉ 等下带你去晒太阳好不好呀？',
                '豆豆～有没有想主人我呀？(♡˙︶˙♡) 主人可是超级想你的！',
                '我家豆豆今天有没有乖乖的呀？(^ᵕ^) 有没有闹腾？',
                '你的新玩具喜欢吗？ᕙ(^‸^)ᕗ 主人我可是精挑细选的哦～',
                '豆豆，我们来玩躲猫猫吧！(^∀^) 藏起来啦～',
                '小豆豆～晚上想不想一起看电影呀？(^▽^) 主人抱着你一起看～'
              ];
              
              const randomText = userVoiceTexts[Math.floor(Math.random() * userVoiceTexts.length)];
              
              // 发送语音消息
              const newMsg = {
                id: `msg-${Date.now()}`,
                type: 'user',
                contentType: 'voice',
                content: randomText,
                timestamp: Date.now(),
                read: true,
                category: 'chat',
                urgent: 0,
                mediaUrl: audioUrl,
                duration: this.recordingDuration
              };
              
              // 添加消息到当前聊天和对应的聊天列表
              this.messages.push(newMsg);
              if (this.currentChatType === 'pet') {
                this.petMessages.push(newMsg);
                
                // 模拟宠物语音回复
                setTimeout(() => {
                  this.simulatePetVoiceReply();
                }, 1000 + Math.random() * 2000);
              } else if (this.currentChatType === 'system') {
                this.systemMessages.push(newMsg);
              }
              
              // 重新渲染消息以确保显示
              this.renderMessages();
              
              this.audioChunks = [];
            };
          })
          .catch(err => {
            console.error('无法访问麦克风:', err);
            this.isVoiceMode = false;
          });
      } else {
        console.error('浏览器不支持音频录制');
        this.isVoiceMode = false;
      }
    },
    
    toggleVoiceMode() {
      this.isVoiceMode = !this.isVoiceMode;
    },
    
    startRecording() {
      if (!this.mediaRecorder) return;
      
      this.recording = true;
      this.recordingStartTime = Date.now();
      this.recordingDuration = 0;
      this.audioChunks = [];
      
      this.mediaRecorder.start();
      
      this.recordingTimer = setInterval(() => {
        this.recordingDuration = Math.floor((Date.now() - this.recordingStartTime) / 1000);
        if (this.recordingDuration >= 60) {
          this.stopRecording();
        }
      }, 1000);
    },
    
    stopRecording() {
      if (!this.recording) return;
      
      clearInterval(this.recordingTimer);
      this.recording = false;
      this.mediaRecorder.stop();
    },
    
    // 模拟宠物回复
    simulatePetReply(userMessage) {
      console.log('模拟宠物回复，当前宠物:', this.currentPetId);
      let reply = '';
      
      // 根据宠物类型选择不同风格的回复
      if (this.currentPetId === 'pet-001') {
        // 仓鼠回复
        const hamsterReplies = [
          '吱吱！我的跑轮刚刚转了好多圈呢！(^∀^) 感觉自己跑得超快～',
          '主人主人！我刚刚把所有葵花籽都藏在小窝的角落了！(≧▽≦) 这是我的小秘密哦～',
          '吱吱吱~ 我好想你啊，什么时候回来陪我玩？(づ￣ 3￣)づ 想抱抱～',
          '我今天把垫材整理得超级舒服，你要来看看吗？(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ 超自豪的！',
          '我刚刚在跑轮上跑了好久，感觉自己超厉害的！(^‿^) 小腿都酸啦～',
          '主人，我的小脸蛋可爱吗？吱吱~ (^ω^) 想被摸摸头～',
          '我悄悄告诉你，我最喜欢吃的其实是葵花籽！(^ω^) 不过偶尔也想吃点新鲜的～',
          '吱吱吱，想知道我今天做了什么吗？(・ω・) 我偷偷藏了好多好吃的～',
          '哎呀，我的小爪子今天踩到了水，都湿了～(>_<) 好萌是不是？',
          '主人主人！我刚刚打了好大一个哈欠呢～(￣o￣) zzzzZZ 困困的～'
        ];
        
        if (userMessage.includes('吃') || userMessage.includes('饭') || userMessage.includes('食物')) {
          reply = '刚刚吃了一些葵花籽和坚果，还把一些藏起来了～ヾ(≧▽≦*)o 主人要不要也尝尝？嘻嘻～';
        } else if (userMessage.includes('玩') || userMessage.includes('无聊')) {
          reply = '我刚刚在跑轮上跑了好久，超级开心！(ﾉ≧∀≦)ﾉ 主人回来可以陪我玩迷宫吗？拜托拜托～';
        } else if (userMessage.includes('想你') || userMessage.includes('回来')) {
          reply = '吱吱吱~ 我也好想你啊！(っ´ω`c)♡ 快点回来看我的新收藏品吧！我偷偷告诉你放在哪儿了～';
        } else if (userMessage.includes('睡') || userMessage.includes('累')) {
          reply = '我刚刚在我的小窝里睡了一会儿，垫材好舒服哦～(ᴗ˳ᴗ) 做了一个有好多葵花籽的美梦～';
        } else if (userMessage.includes('水') || userMessage.includes('喝')) {
          reply = '我有乖乖喝水呢！(^o^)ﾉ 刚刚还用小爪子洗了小脸！看我水润润的毛发～';
        } else {
          // 随机回复
          reply = hamsterReplies[Math.floor(Math.random() * hamsterReplies.length)];
        }
      } else if (this.currentPetId === 'pet-002') {
        // 猫咪回复 - 美少女战士风格
        const catReplies = [
          '以月亮的名义，我要惩罚你的迟到喵！我的晚饭呢？',
          '哼～作为一只月亮战士，我有责任守护这个家的和平喵！',
          '邪恶势力休想得逞！我咪咪，代表爱与正义，消灭你喵！',
          '主人，我今天守护了窗台，保护花盆不被邪恶势力入侵喵～',
          '看招！猫猫拳！喵喵喵～',
          '爱就是力量的源泉喵～主人，你就是我的月亮呢！',
          '今天也要努力成为一只优雅的公主猫喵～',
          '月光之下，我是守护和平的战士喵！白天，我只是一只普通的小猫咪～'
        ];
        
        if (userMessage.includes('吃') || userMessage.includes('饭') || userMessage.includes('食物')) {
          reply = '月光战士需要补充能量喵！罐头才是最强的能量来源！立刻给我准备好，否则我要代表月亮惩罚你喵！';
        } else if (userMessage.includes('玩') || userMessage.includes('无聊')) {
          reply = '我的逗猫棒呢？勇士需要训练身体应对邪恶势力喵！快拿来，这是主人的使命！';
        } else if (userMessage.includes('想你') || userMessage.includes('回来')) {
          reply = '哼～你终于想起我了吗？作为月亮战士，我可是很忙的喵！不过...我也有一点点想你啦...';
        } else if (userMessage.includes('睡') || userMessage.includes('累')) {
          reply = '即使是最强的战士也需要休息喵～今天我要在月光下做个美梦，梦里打败所有邪恶势力！';
        } else if (userMessage.includes('水') || userMessage.includes('喝')) {
          reply = '月亮战士只喝最纯净的水喵！当然，如果有鲜奶，我会更有力量战斗～';
        } else {
          // 随机回复
          reply = catReplies[Math.floor(Math.random() * catReplies.length)];
        }
      } else if (this.currentPetId === 'pet-003') {
        // 狗狗回复 - 郭德纲相声风格
        const dogReplies = [
          '各位观众，各位听众！今儿个又是崭新的一天！您瞧瞧我这生活，旺财在此有礼了！',
          '哎呦喂，这日子没法过了！主人一天天的，狗粮也不给我加量，这叫什么事儿啊！',
          '我这辈子就干仨事儿：吃饭，睡觉，看家！那都是敬业！专业！不含糊！',
          '您瞧我这狗生，起早贪黑，风里来，雨里去，就为了这一口狗粮！',
          '隔壁二狗子，那叫一个得意啊，天天吃肉！我呢？就啃个骨头，还是昨天剩的！',
          '主人，您可是我的衣食父母啊！没有您，我旺财今天还不知道在哪个犄角旮旯混饭吃呢！',
          '这年头，做狗不容易啊！看门还得卖萌，多才多艺的！',
          '我说您听着，这人啊，养狗就跟攒钱一样，得每天都稀罕才行！'
        ];
        
        if (userMessage.includes('吃') || userMessage.includes('饭') || userMessage.includes('食物')) {
          reply = '哎呦我的老天爷！终于想起我肚子饿了？我这都快饿出肋骨了！您瞧瞧，这骨头渣子有啥营养啊！您再不来，我就该唱"小白菜"了！';
        } else if (userMessage.includes('玩') || userMessage.includes('无聊')) {
          reply = '乐意奉陪！这遛弯儿的事儿，我旺财最在行！走街串巷，那是我的强项！不过您可得跟上，我这腿脚利索着呢！';
        } else if (userMessage.includes('想你') || userMessage.includes('回来')) {
          reply = '哎呦我的亲主人！您可回来了！我这一天眼巴巴地望着门口，生怕您把我忘了！这没您的日子，跟个寡妇守灶似的！';
        } else if (userMessage.includes('睡') || userMessage.includes('累')) {
          reply = '睡觉？那是我的专业！睡觉我能睡出花儿来！不过睡觉之前得先吃饱，您说是不？空肚子哪有好梦做！';
        } else if (userMessage.includes('水') || userMessage.includes('喝')) {
          reply = '喝水这事儿讲究着呢！水温不能太凉，碗得够大！您瞧我这舌头，甩起水花来那叫一个壮观！跟下雨似的！';
        } else {
          // 随机回复
          reply = dogReplies[Math.floor(Math.random() * dogReplies.length)];
        }
      } else if (this.currentPetId === 'pet-004') {
        // 荷兰猪回复 - 蠢萌风格
        const guineaPigReplies = [
          '咕噜咕噜...主人，我刚才不小心把自己卡在纸箱里了...救命...',
          '我今天吃了好多胡萝卜！好开心！不过现在我的肚子有点圆鼓鼓的...走不动了...',
          '咕噜！主人主人！我发现了一个新的睡觉的地方，是一个纸盒子！但是我进去了就出不来了...',
          '今天我试着自己洗脸...但是不知道怎么弄的...把耳朵也弄湿了...咕噜咕噜...',
          '主人，我今天尝试翻跟头！但是我太圆了，一直在滚...滚到墙角去了...',
          '咕噜咕噜...我好像弄丢了我的小胡萝卜...但其实是我自己吃掉的...对不起...',
          '今天我遇到了一个迷宫...就是我的笼子...我找不到出口...其实门一直开着...',
          '主人，我的耳朵好痒...但是我够不着...帮帮我...咕噜...'
        ];
        
        if (userMessage.includes('吃') || userMessage.includes('饭') || userMessage.includes('食物')) {
          reply = '啊！！！食物！！！咕噜咕噜咕噜！！！是胡萝卜吗？？？还是小黄瓜？？？我都喜欢！！！不过...我吃多了会变成...小胖球...咕噜...';
        } else if (userMessage.includes('玩') || userMessage.includes('无聊')) {
          reply = '我想玩！但是...我不知道怎么玩...我上次玩的时候把自己卡在管子里了...好害怕...咕噜...但是如果主人陪我的话...我就不怕了！';
        } else if (userMessage.includes('想你') || userMessage.includes('回来')) {
          reply = '主人回来啦！咕噜咕噜！！！我一直在等你！我数了数胡萝卜...数到第三个就忘记数到哪了...然后就一直在等你回来...';
        } else if (userMessage.includes('睡') || userMessage.includes('累')) {
          reply = '睡觉...我很擅长睡觉...咕噜...但是有时候我睡着睡着就滚到笼子的另一边去了...然后就不知道自己在哪里了...咕噜咕噜...';
        } else if (userMessage.includes('水') || userMessage.includes('喝')) {
          reply = '水！我爱喝水！但是有时候我会把水弄得到处都是...不是故意的...咕噜...我的小爪子不太听话...';
        } else {
          // 随机回复
          reply = guineaPigReplies[Math.floor(Math.random() * guineaPigReplies.length)];
        }
      }
      
      const newMsg = {
        id: `msg-${Date.now()}`,
        type: 'pet',
        contentType: 'text',
        content: reply,
        timestamp: Date.now(),
        read: false,
        category: 'chat',
        urgent: 0,
      };
      
      // 添加消息到当前聊天
      this.messages.push(newMsg);
      
      // 添加到对应宠物的消息列表
      if (this.currentPetId) {
        this.petSpecificMessages[this.currentPetId].push(newMsg);
      }
      
      // 重新渲染消息以确保显示
      this.renderMessages();
    },
    
    // 模拟宠物语音回复
    simulatePetVoiceReply() {
      // 模拟宠物的语音回复
      const voiceReplies = [
        'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3',
        'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3',
        'https://assets.mixkit.co/active_storage/sfx/1018/1018-preview.mp3'
      ];
      
      const randomVoice = voiceReplies[Math.floor(Math.random() * voiceReplies.length)];
      const randomDuration = Math.floor(2 + Math.random() * 3);
      
      // 根据宠物类型选择不同风格的语音回复文本
      let voiceTranslations = [];
      
      if (this.currentPetId === 'pet-001') {
        // 仓鼠语音回复
        voiceTranslations = [
          '吱吱~ 我听到你了！主人你什么时候回来陪我玩呀？(^_^) 想你啦～',
          '吱吱吱！我刚刚在小窝里藏了好多好吃的！(^o^) 是秘密宝藏哦～',
          '主人主人，我好想你啊！(>_<) 什么时候回来看我？抱抱我吧～',
          '吱吱~ 跑轮好好玩！我今天跑了好多圈！(^v^) 小短腿都酸啦～',
          '嘎吱嘎吱~ 我的小牙牙有点痒，需要啃点东西！(^_-) 有木质玩具吗？'
        ];
      } else if (this.currentPetId === 'pet-002') {
        // 猫咪语音回复 - 美少女战士风格
        voiceTranslations = [
          '以月亮的名义！我要惩罚迟到的坏人喵！主人你去哪了？',
          '邪恶势力休想得逞！我已经守护家园一整天了喵！',
          '月光下的猫咪战士，就是我！我要用爱的力量守护主人喵！',
          '喵～作为一只月亮猫咪，我的使命是传播爱与正义！',
          '主人！我需要爱的补给！赶紧回来抚摸我的头喵！'
        ];
      } else if (this.currentPetId === 'pet-003') {
        // 狗狗语音回复 - 郭德纲相声风格
        voiceTranslations = [
          '哎呦我的天！您听我说，今儿个门外来了仨推销的，都被我吓跑了！这看家功夫，没谁了！',
          '主人哎，您这一天天的，狗粮也不增量，骨头也不加餐，我这苦日子什么时候到头啊？',
          '您瞧我这口才，别提多好了！小区所有的狗，都得叫我一声"旺哥"！',
          '这大白天的，我在院子里打盹，结果那猫趁机溜了进去！您说这事闹的，我多没面子啊！',
          '主人！我这牙口好着呢！您那靴子我帮您咬松乎了，不用谢！这都是应该的！'
        ];
      } else if (this.currentPetId === 'pet-004') {
        // 荷兰猪语音回复 - 蠢萌风格
        voiceTranslations = [
          '咕噜咕噜...主人...我又把自己卡在角落里了...救命...我不知道怎么后退...',
          '我刚才看到一个胡萝卜！好大好大的胡萝卜！然后我发现...那是个橙色的球...咕噜...',
          '主人主人！我学会了一个新技能！就是...呃...我忘记是什么了...咕噜咕噜...',
          '今天我梦见自己会飞！然后我从窝里滚了出来...原来我在睡觉时翻身了...咕噜...',
          '咕噜！主人！我找不到我的小毯子了！其实...我正坐在上面...不小心...咕噜咕噜...'
        ];
      }
      
      const randomText = voiceTranslations[Math.floor(Math.random() * voiceTranslations.length)];
      
      const newMsg = {
        id: `msg-${Date.now()}`,
        type: 'pet',
        contentType: 'voice',
        content: randomText,
        timestamp: Date.now(),
        read: false,
        category: 'chat',
        urgent: 0,
        mediaUrl: randomVoice,
        duration: randomDuration
      };
      
      // 添加消息到当前聊天
      this.messages.push(newMsg);
      
      // 添加到对应宠物的消息列表
      if (this.currentPetId) {
        this.petSpecificMessages[this.currentPetId].push(newMsg);
      }
      
      // 重新渲染消息以确保显示
      this.renderMessages();
    },
    
    // 报告详情
    openReportDetail(reportMessage) {
      this.currentReport = reportMessage;
      // 移除标签页切换相关代码
      // this.activeReportTab = 'health';
      this.currentPage = 'report-detail';
      
      this.$nextTick(() => {
        this.initReportDetails(reportMessage);
      });
    },
    
    goBack() {
      if (this.currentChatType) {
        this.currentPage = 'chat';
      } else {
        this.currentPage = 'chatList';
      }
    },
    
    openMonitoring() {
      this.currentPage = 'monitoring';
    },
    
    openProfile() {
      this.currentPage = 'profile';
    },
    
    // 打开宠物设置面板
    openPetSettings(petId) {
      console.log('打开宠物设置页面:', petId);
      this.currentPetId = petId || 'pet-001';
      
      // 更新当前宠物信息
      const currentPet = this.allPetsData.find(pet => pet.id === this.currentPetId);
      if (currentPet) {
        this.pet = currentPet;
      }
      
      this.currentPage = 'petSettings';
    },
    
    // 切换性格特点
    togglePersonality(trait) {
      console.log('切换性格特点:', trait);
      if (this.pet.personality.includes(trait)) {
        this.pet.personality = this.pet.personality.filter(t => t !== trait);
      } else {
        this.pet.personality.push(trait);
      }
    },
    
    // 切换兴趣爱好
    toggleInterest(hobby) {
      console.log('切换兴趣爱好:', hobby);
      if (this.pet.interests.includes(hobby)) {
        this.pet.interests = this.pet.interests.filter(h => h !== hobby);
      } else {
        this.pet.interests.push(hobby);
      }
    },
    
    // 保存宠物设置
    savePetSettings() {
      console.log('保存宠物设置');
      // 这里可以添加保存到本地存储或发送到服务器的逻辑
      this.currentPage = 'chatList';
      
      // 显示保存成功提示
      alert('设置保存成功！');
    },
    
    // 模拟系统回复，更新以包含所有动物信息
    simulateSystemReply(userMessage) {
      let reply = '';
      
      if (userMessage.includes('报告') || userMessage.includes('数据')) {
        reply = '您可以在聊天记录中点击带有"日报"、"周报"或"月报"标签的消息查看详细报告，这些报告已整合了所有宠物的健康数据。';
      } else if (userMessage.includes('状态') || userMessage.includes('怎么样')) {
        reply = `根据最新监测数据，您的所有宠物今天状态良好：豆豆活动量增加20%，咪咪的睡眠质量优，旺财进食正常，球球的体重略有增加但在健康范围内。`;
      } else if (userMessage.includes('预警') || userMessage.includes('异常')) {
        reply = '最近24小时内，检测到豆豆有轻微的啃咬笼子行为，建议提供木质玩具；咪咪的饮水量略低于平均水平，请确保提供新鲜水源。其他宠物未发现异常。';
      } else if (userMessage.includes('环境') || userMessage.includes('温度')) {
        reply = `当前环境数据：温度${this.environmentData.temperature}°C，湿度${this.environmentData.humidity}%，光照${this.environmentData.light}lux，噪音${this.environmentData.noise}dB。环境适宜所有宠物活动，特别适合旺财的户外训练。`;
      } else {
        reply = `您好，我是智能管家。我会为您提供所有宠物的健康报告、实时状态和环境数据。目前豆豆、咪咪、旺财和球球的健康状况总体良好，有任何需要了解的特定信息，请随时告诉我。`;
      }
      
      const newMsg = {
        id: `msg-${Date.now()}`,
        type: 'system',
        contentType: 'text',
        content: reply,
        timestamp: Date.now(),
        read: false,
        category: 'chat',
        urgent: 0,
      };
      
      this.messages.push(newMsg);
      if (this.currentChatType === 'system') {
        this.systemMessages.push(newMsg);
      }
      
      // 重新渲染消息以确保显示
      this.renderMessages();
    },
    
    // 模拟群组聊天回复
    simulateGroupReply(userMessage) {
      console.log('模拟群组回复');
      
      // 随机选择一个宠物回复
      const petIds = ['pet-001', 'pet-002', 'pet-003', 'pet-004'];
      const randomPetId = petIds[Math.floor(Math.random() * petIds.length)];
      
      // 获取宠物信息
      const petInfo = this.allPetsData.find(pet => pet.id === randomPetId);
      if (!petInfo) return;
      
      let reply = '';
      let duration = 0;
      
      // 根据宠物类型生成回复
      if (randomPetId === 'pet-001') {
        // 仓鼠风格
        reply = `吱吱吱～主人说${userMessage}，好开心啊！(^∀^) 我们要一起玩游戏吗？`;
        duration = Math.floor(Math.random() * 5) + 5; // 5-10秒
      } else if (randomPetId === 'pet-002') {
        // 猫咪风格
        reply = `以月亮的名义！主人说${userMessage}，我作为家里的英雄，非常赞同喵～`;
        duration = Math.floor(Math.random() * 6) + 7; // 7-13秒
      } else if (randomPetId === 'pet-003') {
        // 狗狗风格
        reply = `哎呦我去！各位听听，主人说${userMessage}，这多有意思啊！您看旺财我今儿个就有口福了！`;
        duration = Math.floor(Math.random() * 8) + 8; // 8-16秒
      } else if (randomPetId === 'pet-004') {
        // 荷兰猪风格
        reply = `咕噜咕噜...主人说${userMessage}...我...我有点不敢回应...但是我很开心...`;
        duration = Math.floor(Math.random() * 4) + 4; // 4-8秒
      }
      
      // 决定是否发送语音消息（80%的概率为语音消息）
      const isVoiceMessage = Math.random() < 0.8;
      
      const newMsg = {
        id: `group-msg-${Date.now()}`,
        type: 'pet',
        petId: randomPetId,
        contentType: isVoiceMessage ? 'voice' : 'text',
        content: reply,
        timestamp: Date.now(),
        read: false,
        category: 'chat',
        urgent: 0,
      };
      
      // 如果是语音消息，添加相关属性
      if (isVoiceMessage) {
        // 根据宠物类型分配不同的虚拟语音URL
        const petTypeMap = {
          'pet-001': 'hamster',
          'pet-002': 'cat',
          'pet-003': 'dog',
          'pet-004': 'guineapig'
        };
        const petType = petTypeMap[randomPetId];
        const audioNum = Math.floor(Math.random() * 3) + 1; // 1-3范围内的随机数字
        
        newMsg.mediaUrl = `https://example.com/audio/${petType}${audioNum}.mp3`;
        newMsg.duration = duration;
      }
      
      // 添加消息到当前聊天
      this.messages.push(newMsg);
      
      // 添加到群组消息
      this.groupMessages.push(newMsg);
      
      // 重新渲染消息
      this.renderMessages();
    },
    
    // 渲染日报图表
    renderDailyReportCharts(chartData) {
      // 1. 渲染健康评分图表
      if (document.getElementById('healthScoreChart')) {
        const healthChart = echarts.init(document.getElementById('healthScoreChart'));
        
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: chartData.healthScores.petNames,
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            axisLabel: {
              interval: 0,
              rotate: 0
            }
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: [{
            name: '健康评分',
            type: 'bar',
            data: chartData.healthScores.scores,
            itemStyle: {
              color: function(params) {
                const score = params.value;
                if (score >= 90) return '#91cc75';
                if (score >= 80) return '#5ab55e';
                if (score >= 70) return '#fac858';
                if (score >= 60) return '#ee6666';
                return '#ee3333';
              }
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}'
            }
          }]
        };
        
        healthChart.setOption(option);
      }
      
      // 2. 渲染活动时间图表
      if (document.getElementById('activityDistributionChart')) {
        const activityChart = echarts.init(document.getElementById('activityDistributionChart'));
        
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}小时 ({d}%)'
          },
          legend: {
            orient: 'horizontal',
            bottom: 10,
            data: chartData.activityData.timeDistribution.map(item => item.name)
          },
          series: [
            {
              name: '活动时间分布',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['50%', '45%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: chartData.activityData.timeDistribution.map(item => ({
                value: item.value,
                name: item.name
              }))
            }
          ],
          color: ['#63a5ff', '#91cc75', '#fac858', '#ee6666']
        };
        
        activityChart.setOption(option);
      }
      
      // 3. 渲染宠物活动量对比图表
      if (document.getElementById('petActivityCompareChart')) {
        const compareChart = echarts.init(document.getElementById('petActivityCompareChart'));
        
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['今日', '昨日'],
            bottom: 10
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: chartData.activityData.petNames,
            axisLabel: {
              interval: 0,
              rotate: 0
            }
          },
          yAxis: {
            type: 'value',
            name: '活动量(分钟)'
          },
          series: [
            {
              name: '今日',
              type: 'bar',
              data: chartData.activityData.activityValues,
              color: '#5ab55e'
            },
            {
              name: '昨日',
              type: 'bar',
              data: chartData.activityData.previousValues,
              color: '#91cc75',
              opacity: 0.8
            }
          ]
        };
        
        compareChart.setOption(option);
      }
      
      // 4. 渲染饮水量图表
      if (document.getElementById('waterIntakeChart')) {
        const waterChart = echarts.init(document.getElementById('waterIntakeChart'));
        
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: chartData.feedingData.waterIntake.petNames,
            axisLabel: {
              interval: 0,
              rotate: 0
            }
          },
          yAxis: {
            type: 'value',
            name: `饮水量(${chartData.feedingData.waterIntake.unit})`
          },
          series: [
            {
              name: '饮水量',
              type: 'bar',
              data: chartData.feedingData.waterIntake.values,
              itemStyle: {
                color: '#63a5ff'
              },
              label: {
                show: true,
                position: 'top'
              }
            }
          ]
        };
        
        waterChart.setOption(option);
      }
      
      // 5. 显示精彩瞬间
      if (document.getElementById('momentsHighlights')) {
        const momentsContainer = document.getElementById('momentsHighlights');
        let momentsHTML = '<div class="grid grid-cols-2 gap-4">';
        
        chartData.momentHighlights.forEach(moment => {
          momentsHTML += `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
              <img src="${moment.imageUrl}" class="w-full h-32 object-cover" alt="${moment.petName}的精彩瞬间">
              <div class="p-3">
                <div class="text-sm font-medium">${moment.petName} · ${moment.time}</div>
                <div class="text-xs text-gray-500 mt-1">${moment.description}</div>
              </div>
            </div>
          `;
        });
        
        momentsHTML += '</div>';
        momentsContainer.innerHTML = momentsHTML;
      }
    },
    
    // 渲染周报图表
    renderWeeklyReportCharts(chartData) {
      // 1. 渲染周趋势图表
      if (document.getElementById('weeklyTrendChart')) {
        const trendChart = echarts.init(document.getElementById('weeklyTrendChart'));
        
        const series = chartData.weeklyTrend.datasets.map((dataset, index) => {
          return {
            name: dataset.name,
            type: 'line',
            smooth: true,
            data: dataset.values,
            symbol: 'circle',
            symbolSize: 6,
            markLine: {
              silent: true,
              lineStyle: {
                type: 'dashed',
                color: '#aaa'
              },
              data: [
                {
                  name: '上周平均',
                  yAxis: chartData.weeklyTrend.previousWeekAvg[index],
                  label: {
                    formatter: `${dataset.name}上周平均: {c}`
                  }
                }
              ]
            }
          };
        });
        
        const option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: chartData.weeklyTrend.datasets.map(dataset => dataset.name),
            bottom: 10
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chartData.weeklyTrend.days
          },
          yAxis: {
            type: 'value',
            name: '活动量',
            min: 'dataMin'
          },
          series: series,
          color: ['#5470c6', '#91cc75', '#fac858', '#ee6666']
        };
        
        trendChart.setOption(option);
      }
      
      // 2. 渲染行为模式图表
      if (document.getElementById('behaviorPatternChart')) {
        const patternChart = echarts.init(document.getElementById('behaviorPatternChart'));
        
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['睡眠质量', '活动规律性', '社交互动'],
            bottom: 10
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: chartData.behaviorPatterns.petNames
          },
          yAxis: {
            type: 'value',
            max: chartData.behaviorPatterns.maxScore,
            name: '评分(1-5)'
          },
          series: [
            {
              name: '睡眠质量',
              type: 'bar',
              stack: 'total',
              emphasis: {
                focus: 'series'
              },
              data: chartData.behaviorPatterns.sleepQuality
            },
            {
              name: '活动规律性',
              type: 'bar',
              stack: 'total',
              emphasis: {
                focus: 'series'
              },
              data: chartData.behaviorPatterns.activityRegularity
            },
            {
              name: '社交互动',
              type: 'bar',
              stack: 'total',
              emphasis: {
                focus: 'series'
              },
              data: chartData.behaviorPatterns.socialInteractions
            }
          ],
          color: ['#63a5ff', '#5ab55e', '#fac858']
        };
        
        patternChart.setOption(option);
      }
      
      // 3. 渲染健康指标雷达图
      if (document.getElementById('healthIndicatorsChart')) {
        const healthChart = echarts.init(document.getElementById('healthIndicatorsChart'));
        
        const indicators = [
          { name: '食欲', max: 100 },
          { name: '能量', max: 100 },
          { name: '水分', max: 100 },
          { name: '毛发', max: 100 }
        ];
        
        const series = [];
        for (let i = 0; i < chartData.healthIndicators.petNames.length; i++) {
          series.push({
            name: chartData.healthIndicators.petNames[i],
            value: [
              chartData.healthIndicators.appetite[i],
              chartData.healthIndicators.energy[i],
              chartData.healthIndicators.hydration[i],
              chartData.healthIndicators.grooming[i]
            ]
          });
        }
        
        const option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            data: chartData.healthIndicators.petNames,
            bottom: 10
          },
          radar: {
            indicator: indicators,
            radius: '60%',
            center: ['50%', '45%'],
            name: {
              textStyle: {
                color: '#333'
              }
            },
            splitLine: {
              lineStyle: {
                color: ['#ddd']
              }
            }
          },
          series: [
            {
              type: 'radar',
              data: series,
              symbolSize: 6,
              areaStyle: {
                opacity: 0.3
              },
              lineStyle: {
                width: 2
              }
            }
          ],
          color: ['#5470c6', '#91cc75', '#fac858', '#ee6666']
        };
        
        healthChart.setOption(option);
      }
      
      // 4. 显示周度精彩瞬间视频
      if (document.getElementById('weeklyHighlightsVideo') && chartData.weeklyHighlights) {
        const videoContainer = document.getElementById('weeklyHighlightsVideo');
        videoContainer.innerHTML = `
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <video src="${chartData.weeklyHighlights.videoUrl}" 
                   class="w-full h-auto" 
                   poster="${chartData.weeklyHighlights.thumbnail}" 
                   controls></video>
            <div class="p-4">
              <p class="text-sm text-gray-700">${chartData.weeklyHighlights.description}</p>
            </div>
          </div>
        `;
      }
    },
    
    // 渲染月报图表
    renderMonthlyReportCharts(chartData) {
      // 1. 渲染月度健康评分图表
      if (document.getElementById('monthlyHealthChart')) {
        const healthChart = echarts.init(document.getElementById('monthlyHealthChart'));
        
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['本月', '上月'],
            bottom: 10
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: chartData.monthlyHealth.petNames
          },
          yAxis: {
            type: 'value',
            min: 60,
            max: 100,
            name: '健康评分'
          },
          series: [
            {
              name: '本月',
              type: 'bar',
              data: chartData.monthlyHealth.currentScores,
              itemStyle: {
                color: '#5ab55e'
              },
              label: {
                show: true,
                position: 'top'
              }
            },
            {
              name: '上月',
              type: 'bar',
              data: chartData.monthlyHealth.previousScores,
              itemStyle: {
                color: '#91cc75',
                opacity: 0.8
              }
            }
          ]
        };
        
        healthChart.setOption(option);
      }
      
      // 2. 渲染健康分类雷达图
      if (document.getElementById('healthCategoryChart')) {
        const categoryChart = echarts.init(document.getElementById('healthCategoryChart'));
        
        const indicators = chartData.monthlyHealth.categoryScores.categories.map(category => {
          return { name: category, max: 100 };
        });
        
        const series = [];
        for (let i = 0; i < chartData.monthlyHealth.categoryScores.datasets.length; i++) {
          series.push({
            name: chartData.monthlyHealth.categoryScores.datasets[i].name,
            value: chartData.monthlyHealth.categoryScores.datasets[i].values
          });
        }
        
        const option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            data: chartData.monthlyHealth.petNames,
            bottom: 10
          },
          radar: {
            indicator: indicators,
            radius: '60%',
            center: ['50%', '45%'],
            name: {
              textStyle: {
                color: '#333'
              }
            },
            splitLine: {
              lineStyle: {
                color: ['#ddd']
              }
            }
          },
          series: [
            {
              type: 'radar',
              data: series,
              symbolSize: 6,
              areaStyle: {
                opacity: 0.3
              },
              lineStyle: {
                width: 2
              }
            }
          ],
          color: ['#5470c6', '#91cc75', '#fac858', '#ee6666']
        };
        
        categoryChart.setOption(option);
      }
      
      // 3. 渲染行为变化趋势图
      if (document.getElementById('behaviorChangeChart')) {
        // 先确保容器有明确的宽度
        const chartContainer = document.getElementById('behaviorChangeChart');
        chartContainer.style.width = '100%';
        
        // 等待容器尺寸稳定后初始化图表
        setTimeout(() => {
          const changeChart = echarts.init(chartContainer, null, {
            renderer: 'canvas',
            width: 'auto',
            height: 'auto'
          });
          
          const series = chartData.behaviorChanges.datasets.map(dataset => {
            return {
              name: dataset.name,
              type: 'line',
              data: dataset.values,
              smooth: true,
              symbolSize: 6,
              symbol: 'circle'
            };
          });
          
          const option = {
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: chartData.behaviorChanges.datasets.map(dataset => dataset.name),
              bottom: 10
            },
            grid: {
              left: '5%',
              right: '5%',
              bottom: '15%',
              top: '10%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: chartData.behaviorChanges.weeks
            },
            yAxis: {
              type: 'value',
              name: '活动量(分钟)'
            },
            series: series,
            color: ['#5470c6', '#91cc75', '#fac858', '#ee6666']
          };
          
          changeChart.setOption(option);
          // 强制更新尺寸以适应容器
          window.dispatchEvent(new Event('resize'));
        }, 100);
      }
      
      // 4. 渲染体重变化图表
      if (document.getElementById('weightChangeChart')) {
        const weightChart = echarts.init(document.getElementById('weightChangeChart'));
        
        const series = chartData.growthTracking.weights.map(weight => {
          return {
            name: weight.name,
            type: 'line',
            data: weight.values,
            smooth: true,
            symbolSize: 6,
            symbol: 'circle'
          };
        });
        
        const option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: chartData.growthTracking.weights.map(weight => weight.name),
            bottom: 10
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chartData.growthTracking.months
          },
          yAxis: {
            type: 'value',
            name: `体重(${chartData.growthTracking.units})`,
            scale: true
          },
          series: series,
          color: ['#5470c6', '#91cc75', '#fac858', '#ee6666']
        };
        
        weightChart.setOption(option);
      }
      
      // 5. 显示月度精彩瞬间合集
      if (document.getElementById('monthlyMomentsCollage') && chartData.monthlyMoments) {
        const momentsContainer = document.getElementById('monthlyMomentsCollage');
        momentsContainer.innerHTML = `
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="${chartData.monthlyMoments.collageUrl}" 
                 class="w-full h-64 object-cover" 
                 alt="月度精彩瞬间合集">
            <div class="p-4">
              <p class="text-sm text-gray-700">${chartData.monthlyMoments.description}</p>
            </div>
          </div>
        `;
      }
    }
  };
  
  // 将 Alpine 添加到窗口对象
  window.Alpine = Alpine;
  
  // 启动 Alpine.js
  Alpine.start();
});

// 组件：报告详情
document.addEventListener('DOMContentLoaded', () => {
  console.log('报告详情组件已初始化');
}); 