/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,html}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316', // 橙色，温暖亲切
        secondary: '#3B82F6', // 蓝色，用于按钮和交互元素
        background: {
          light: '#FFFFFF', // 白色，主背景
          dark: '#F3F4F6'   // 浅灰，次要背景
        },
        text: {
          primary: '#1F2937', // 深灰，主文本
          secondary: '#6B7280' // 中灰，次要文本
        },
        success: '#10B981', // 绿色，成功
        warning: '#EF4444', // 红色，警告
        system: '#9CA3AF', // 系统消息背景
        pet: '#FEF3C7'    // 宠物消息背景
      }
    },
  },
  plugins: [],
} 