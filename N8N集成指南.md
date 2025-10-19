# N8N工作流集成指南

## AI助手N8N工作流配置

### 1. 环境变量配置

在您的部署平台（Vercel/Netlify）中添加N8N Webhook环境变量：

```
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/poetry-assistant
```

### 2. N8N工作流设计

#### 工作流触发器
- **Webhook节点**：接收来自前端应用的请求
- **HTTP方法**：POST
- **路径**：`/webhook/poetry-assistant`

#### 工作流处理节点

##### 节点1：请求解析
```json
{
  "type": "n8n-nodes-base.set",
  "properties": {
    "options": {},
    "fields": {
      "userMessage": "={{ $json.message }}",
      "timestamp": "={{ $json.timestamp }}",
      "context": "={{ $json.context }}"
    }
  }
}
```

##### 节点2：AI处理（使用OpenAI或其他AI服务）
```json
{
  "type": "n8n-nodes-base.openAi",
  "properties": {
    "resource": "chat",
    "operation": "message",
    "model": "={{ $parameter.options.model }}",
    "prompt": "你是一个专业的诗歌鉴赏AI助手。用户问题：{{ $json.userMessage }}。请用中文回答，回答要专业、准确且友好。",
    "options": {
      "model": "gpt-3.5-turbo"
    }
  }
}
```

##### 节点3：响应格式化
```json
{
  "type": "n8n-nodes-base.set",
  "properties": {
    "options": {},
    "fields": {
      "response": "={{ $json.message }}",
      "status": "success",
      "timestamp": "={{ $json.timestamp }}"
    }
  }
}
```

### 3. 完整的N8N工作流JSON

```json
{
  "name": "诗歌AI助手工作流",
  "nodes": [
    {
      "parameters": {
        "path": "/webhook/poetry-assistant",
        "responseMode": "lastNode"
      },
      "id": "webhook-node",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "fields": {
          "userMessage": "={{ $json.message }}",
          "timestamp": "={{ $json.timestamp }}",
          "context": "={{ $json.context }}"
        }
      },
      "id": "parse-request",
      "name": "解析请求",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "model": "gpt-3.5-turbo",
        "prompt": "你是一个专业的诗歌鉴赏AI助手。用户问题：{{ $json.userMessage }}。请用中文回答，回答要专业、准确且友好。"
      },
      "id": "ai-process",
      "name": "AI处理",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "fields": {
          "response": "={{ $json.message }}",
          "status": "success"
        }
      },
      "id": "format-response",
      "name": "格式化响应",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [900, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "解析请求",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "解析请求": {
      "main": [
        [
          {
            "node": "AI处理",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI处理": {
      "main": [
        [
          {
            "node": "格式化响应",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### 4. 替代方案：使用本地AI服务

如果不想使用OpenAI，可以使用本地AI模型：

#### 使用Hugging Face节点
```json
{
  "type": "n8n-nodes-base.huggingFace",
  "properties": {
    "model": "microsoft/DialoGPT-medium",
    "inputs": "用户问题：{{ $json.userMessage }}。你是一个诗歌AI助手："
  }
}
```

#### 使用自定义代码节点
```javascript
// 在N8N中使用JavaScript代码节点
const response = await fetch('https://api.example.com/ai-chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-api-key'
  },
  body: JSON.stringify({
    message: $json.userMessage,
    context: 'poetry-assistant'
  })
});

const data = await response.json();
return { response: data.answer };
```

### 5. 测试工作流

#### 测试请求示例
```json
{
  "message": "推荐一首李白的诗",
  "timestamp": "2024-01-01T12:00:00Z",
  "context": "poetry-platform"
}
```

#### 期望响应示例
```json
{
  "response": "我推荐李白的《静夜思》：床前明月光，疑是地上霜。举头望明月，低头思故乡。这首诗语言简练，意境深远，表达了游子思乡之情。",
  "status": "success",
  "timestamp": "2024-01-01T12:00:01Z"
}
```

### 6. 安全配置

#### 添加API密钥验证
在Webhook节点后添加验证节点：
```javascript
// 验证请求签名或API密钥
if ($json.apiKey !== 'your-secret-api-key') {
  return { error: 'Unauthorized' };
}
```

#### 速率限制
在N8N中配置速率限制，防止滥用。

### 7. 监控和日志

- 启用N8N执行日志
- 设置错误警报
- 监控API使用量
- 记录用户交互统计

### 8. 部署注意事项

1. **N8N实例**：确保N8N实例可公开访问（或使用N8N Cloud）
2. **HTTPS**：生产环境必须使用HTTPS
3. **CORS**：配置适当的CORS策略
4. **备份**：定期备份工作流配置