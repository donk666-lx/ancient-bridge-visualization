// 统一的 API 配置管理

// API 基础配置
export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002',
  endpoints: {
    tts: import.meta.env.VITE_API_TTS_ENDPOINT || '/api/v1/tts/edge',
    chat: import.meta.env.VITE_API_CHAT_ENDPOINT || '/api/v1/chat'
  }
}

/**
 * 获取完整的 API URL
 * @param {string} endpoint - 端点名称 (tts 或 chat)
 * @returns {string} 完整的 API URL
 */
export const getApiUrl = (endpoint) => {
  const path = apiConfig.endpoints[endpoint]
  if (!path) {
    console.error(`❌ 未知的 API 端点: ${endpoint}`)
    return null
  }
  return `${apiConfig.baseURL}${path}`
}

/**
 * 发送 API 请求
 * @param {string} endpoint - 端点名称
 * @param {Object} options - fetch 选项
 * @returns {Promise<Response>} fetch 响应
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint)
  if (!url) {
    throw new Error(`无效的 API 端点: ${endpoint}`)
  }

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  }

  return fetch(url, mergedOptions)
}
