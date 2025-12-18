# Supabase 配置指南

## 获取项目 URL 与匿名 Key
- 登录 Supabase 项目控制台
- 进入 `Project Settings` → `API`
- 复制 `Project URL` 至 `.env` 的 `VITE_SUPABASE_URL`
- 复制 `anon public key` 至 `.env` 的 `VITE_SUPABASE_ANON_KEY`

## 创建数据表与策略
- 打开 SQL Editor，执行 `docs/supabase.sql`
- 创建 `public.rsvps` 表并启用 RLS，允许匿名插入与读取

## 本地生效
- 保存 `.env`
- 重启开发服务器：`npm run dev`
