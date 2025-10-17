// 错误处理工具类
export class ErrorHandler {
  static handle(error, context = '') {
    console.error(`${context}错误:`, error)
    
    // 根据错误类型返回用户友好的消息
    if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
      return '网络连接失败，请检查网络设置后重试'
    }
    
    if (error.message.includes('JWT')) {
      return '认证失败，请重新登录'
    }
    
    if (error.message.includes('permission')) {
      return '权限不足，无法执行此操作'
    }
    
    if (error.message.includes('unique constraint')) {
      return '数据已存在，请勿重复添加'
    }
    
    if (error.message.includes('foreign key constraint')) {
      return '关联数据不存在，请检查输入'
    }
    
    // 默认错误消息
    return error.message || '操作失败，请稍后重试'
  }
  
  // 检查是否为Supabase特定错误
  static isSupabaseError(error) {
    return error && (
      error.code?.startsWith('PGRST') ||
      error.code?.startsWith('42') ||
      error.message?.includes('Supabase')
    )
  }
  
  // 处理Supabase错误
  static handleSupabaseError(error) {
    if (!this.isSupabaseError(error)) return error.message
    
    switch (error.code) {
      case 'PGRST301':
        return '请求的资源不存在'
      case 'PGRST302':
        return '权限不足'
      case '42501':
        return '行级安全策略拒绝访问'
      case '42P01':
        return '数据库表不存在'
      case '42P02':
        return '数据库列不存在'
      default:
        return error.message || '数据库操作失败'
    }
  }
}