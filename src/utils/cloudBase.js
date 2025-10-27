import cloudbase from "@cloudbase/js-sdk";

/**
 * 初始化 CloudBase
 * 
 * 使用说明：
 * 1. 将 "your-client-id" 替换为你在 CloudBase 控制台获取的 clientId
 * 2. 确保 env 环境ID正确
 * 3. 在 CloudBase 控制台配置安全域名
 * 4. 复制 env.example 为 .env 并填写实际配置
 */
export const app = cloudbase.init({
  env: import.meta.env.VITE_CLOUDBASE_ENV || "test-1g19jum707b00d3f",
  accessKey: import.meta.env.VITE_CLOUDBASE_CLIENT_ID || "your-client-id"
});
console.log(import.meta.env.VITE_CLOUDBASE_CLIENT_ID)
// 导出 auth 实例，方便使用
export const auth = app.auth();

/**
 * 获取当前登录用户
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * 检查是否已登录
 */
export const isLogin = () => {
  return !!auth.currentUser;
};

/**
 * 退出登录
 */
export const logout = async () => {
  await auth.signOut();
};