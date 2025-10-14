<template>
  <footer class="bg-white/80 border-t border-gray-100 mt-16">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 品牌信息 -->
        <div class="col-span-1">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span class="text-white font-title text-sm">诗</span>
            </div>
            <span class="text-lg font-title text-primary">诗词赏析</span>
          </div>
          <p class="text-gray-600 text-sm">
            传承中华诗词文化，弘扬古典美学精神
          </p>
        </div>

        <!-- 快速链接 -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">快速导航</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><router-link to="/" class="hover:text-primary transition-colors">首页</router-link></li>
            <li><router-link to="/authors" class="hover:text-primary transition-colors">诗人名录</router-link></li>
            <li><router-link to="/dynasties" class="hover:text-primary transition-colors">朝代分类</router-link></li>
            <li><router-link to="/tags" class="hover:text-primary transition-colors">标签分类</router-link></li>
          </ul>
        </div>

        <!-- 关于我们 -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">关于我们</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-primary transition-colors">项目介绍</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">开发团队</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">联系我们</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">帮助文档</a></li>
          </ul>
        </div>

        <!-- 社交媒体 -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">关注我们</h3>
          <div class="flex space-x-4">
            <a href="#" class="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" class="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.094.113.108.212.08.325-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.84-.282 1.236-1.064 2.785-1.549 3.724.819.252 1.688.378 2.595.378 6.627 0 11.987-5.365 11.987-11.987C24.003 5.367 18.636.001 12.017.001z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="border-t border-gray-200 mt-8 pt-8 text-center">
        <p class="text-sm text-gray-600">
          © 2025 诗词赏析平台. 保留所有权利. | 传承中华优秀传统文化
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
</style>