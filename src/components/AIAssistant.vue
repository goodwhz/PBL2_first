<template>
  <!-- AI助手悬浮按钮 -->
  <div class="ai-assistant-container">
    <!-- 聊天窗口 -->
    <div v-if="isOpen" class="ai-chat-window">
      <div class="ai-chat-header">
        <h3>诗歌AI助手</h3>
        <button @click="toggleChat" class="close-btn">×</button>
      </div>
      
      <div class="ai-chat-messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" 
             :class="['message', message.type]">
          <div class="message-content">
            {{ message.content }}
          </div>
          <div class="message-time">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
        
        <div v-if="isLoading" class="message ai">
          <div class="message-content typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
      
      <div class="ai-chat-input">
        <input 
          v-model="userInput" 
          @keyup.enter="sendMessage"
          placeholder="问我关于诗歌的问题..."
          :disabled="isLoading"
        />
        <button @click="sendMessage" :disabled="isLoading || !userInput.trim()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
      
      <!-- 快捷问题 -->
      <div class="quick-questions">
        <button 
          v-for="(question, index) in quickQuestions" 
          :key="index"
          @click="selectQuickQuestion(question)"
          class="quick-question-btn"
        >
          {{ question }}
        </button>
      </div>
    </div>
    
    <!-- 悬浮按钮 -->
    <button @click="toggleChat" class="ai-assistant-btn">
      <svg v-if="!isOpen" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
      <span v-else>×</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'

const isOpen = ref(false)
const userInput = ref('')
const messages = ref([])
const isLoading = ref(false)
const messagesContainer = ref(null)

// 快捷问题示例
const quickQuestions = ref([
  '推荐一首李白的诗',
  '唐诗的特点是什么？',
  '如何欣赏古诗？',
  '宋词和唐诗的区别'
])

// 初始化欢迎消息
onMounted(() => {
  // 延迟添加欢迎消息，确保DOM已完全渲染
  setTimeout(() => {
    addMessage('ai', '您好！我是诗歌AI助手，可以帮您解答关于诗歌的问题。')
  }, 100)
})

// 切换聊天窗口
const toggleChat = () => {
  isOpen.value = !isOpen.value
}

// 添加消息
const addMessage = (type, content) => {
  messages.value.push({
    type,
    content,
    timestamp: new Date()
  })
  scrollToBottom()
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value && messagesContainer.value.getBoundingClientRect) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 发送消息到N8N工作流
const sendMessage = async () => {
  const input = userInput.value.trim()
  if (!input) return
  
  // 添加用户消息
  addMessage('user', input)
  userInput.value = ''
  isLoading.value = true
  
  try {
    // 调用N8N工作流API
    const response = await fetchN8NWorkflow(input)
    addMessage('ai', response)
  } catch (error) {
    console.error('AI助手请求失败:', error)
    addMessage('ai', '抱歉，暂时无法处理您的请求。请稍后重试。')
  } finally {
    isLoading.value = false
  }
}

// 调用N8N工作流
const fetchN8NWorkflow = async (message) => {
  // 这里替换为您的N8N工作流Webhook URL
  const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/poetry-assistant'
  
  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        timestamp: new Date().toISOString(),
        context: 'poetry-platform'
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.response || '我收到了您的消息，但暂时无法提供具体回答。'
    
  } catch (error) {
    // 降级处理：如果N8N不可用，使用本地回复
    return getFallbackResponse(message)
  }
}

// 降级回复逻辑
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('李白') || lowerMessage.includes('诗仙')) {
    return '李白是唐代伟大的浪漫主义诗人，被誉为"诗仙"。他的《静夜思》非常经典："床前明月光，疑是地上霜。举头望明月，低头思故乡。"'
  }
  
  if (lowerMessage.includes('唐诗') || lowerMessage.includes('唐代')) {
    return '唐诗是中国古典诗歌的巅峰，特点是格律严谨、意境深远。代表诗人有李白、杜甫、白居易等。'
  }
  
  if (lowerMessage.includes('宋词')) {
    return '宋词是宋代流行的诗歌形式，比唐诗更注重音乐性和抒情性。代表词人有苏轼、李清照、辛弃疾等。'
  }
  
  if (lowerMessage.includes('欣赏') || lowerMessage.includes('理解')) {
    return '欣赏古诗可以从以下几个方面入手：1) 理解诗歌背景 2) 分析意象和意境 3) 体会情感表达 4) 欣赏语言艺术'
  }
  
  return '感谢您的提问！我是诗歌AI助手，可以帮您解答关于古诗词的问题。您可以问我关于特定诗人、诗歌赏析或文学知识的问题。'
}

// 选择快捷问题
const selectQuickQuestion = (question) => {
  userInput.value = question
  sendMessage()
}

// 格式化时间
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.ai-assistant-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.ai-assistant-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s ease;
}

.ai-assistant-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
}

.ai-chat-window {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.ai-chat-header {
  padding: 15px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-chat-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
}

.ai-chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #f8f9fa;
}

.message {
  margin-bottom: 15px;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.ai {
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  word-wrap: break-word;
}

.message.user .message-content {
  background: #667eea;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.ai .message-content {
  background: white;
  color: #333;
  border: 1px solid #e1e5e9;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 5px;
  text-align: right;
}

.message.ai .message-time {
  text-align: left;
}

.typing-indicator {
  display: flex;
  align-items: center;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  background: #999;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-5px); }
}

.ai-chat-input {
  padding: 15px;
  border-top: 1px solid #e1e5e9;
  display: flex;
  gap: 10px;
  background: white;
}

.ai-chat-input input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #e1e5e9;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.ai-chat-input input:focus {
  border-color: #667eea;
}

.ai-chat-input button {
  background: #667eea;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-chat-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.quick-questions {
  padding: 10px 15px;
  border-top: 1px solid #e1e5e9;
  background: #f8f9fa;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-question-btn {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 15px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-question-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .ai-chat-window {
    width: calc(100vw - 40px);
    height: 70vh;
    right: 20px;
    bottom: 80px;
  }
  
  .ai-assistant-btn {
    width: 50px;
    height: 50px;
    bottom: 20px;
    right: 20px;
  }
}
</style>