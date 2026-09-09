-- ================================================================
-- Migration: إضافة جدول الرسائل الواردة (messages)
-- نفّذ هذا الملف مرة واحدة فقط إذا كان مشروع Supabase ديالك تم إنشاؤه
-- قبل إضافة هذه الميزة (أي أن جدول messages غير موجود عندك بعد).
-- إذا كنت بصدد إنشاء مشروع جديد من الصفر، schema.sql الحالي يتضمن هذا
-- الجدول تلقائيًا ولا حاجة لتنفيذ هذا الملف بشكل منفصل.
-- ================================================================

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('contact', 'inquiry', 'ask_pharmacist')),
  status text not null default 'new' check (status in ('new', 'read')),
  name text,
  email text,
  phone text,
  medicine_name text,
  quantity integer,
  message text,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'messages' and policyname = 'public insert messages') then
    create policy "public insert messages" on public.messages for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'messages' and policyname = 'admin read messages') then
    create policy "admin read messages" on public.messages for select
      using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'messages' and policyname = 'admin update messages') then
    create policy "admin update messages" on public.messages for update
      using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'messages' and policyname = 'admin delete messages') then
    create policy "admin delete messages" on public.messages for delete
      using (auth.role() = 'authenticated');
  end if;
end $$;
