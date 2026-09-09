-- ================================================================
-- Pharma+ — Security Patch (تشديد RLS: دور Admin حقيقي بدل authenticated فقط)
-- نفّذه مرة واحدة من: Supabase Dashboard -> SQL Editor -> New query
-- بعد أن يكون schema.sql منفّذًا مسبقًا. لا يحذف أي بيانات ولا يغيّر بنية الجداول.
-- ================================================================

-- ----------------------------------------------------------------
-- 1) جدول يحدد من هو "Admin" فعليًا (بدل الاعتماد على authenticated فقط)
-- ----------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- كل مستخدم يقدر يشوف فقط صفّه الخاص (للتحقق من دوره في الواجهة إذا احتجت)
drop policy if exists "self read admins" on public.admins;
create policy "self read admins" on public.admins for select
  using (auth.uid() = user_id);

-- ملاحظة: لا توجد سياسة INSERT/UPDATE/DELETE على هذا الجدول من طرف العميل عمداً.
-- إضافة/حذف مدير تتم فقط يدويًا من SQL Editor (أو عبر service_role من الخادم)، مثال:
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'admin@example.com';

-- ----------------------------------------------------------------
-- 2) دالة is_admin(): تُستخدم داخل كل سياسات الكتابة
-- ----------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- ----------------------------------------------------------------
-- 3) استبدال سياسات الكتابة القديمة (authenticated) بسياسات is_admin()
--    القراءة العمومية (select) تبقى كما هي بدون أي تغيير.
-- ----------------------------------------------------------------
drop policy if exists "admin write medicines" on public.medicines;
create policy "admin write medicines" on public.medicines for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin write services" on public.services;
create policy "admin write services" on public.services for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin write staff" on public.staff;
create policy "admin write staff" on public.staff for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin write announcements" on public.announcements;
create policy "admin write announcements" on public.announcements for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin write health_guides" on public.health_guides;
create policy "admin write health_guides" on public.health_guides for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin write pharmacy_info" on public.pharmacy_info;
create policy "admin write pharmacy_info" on public.pharmacy_info for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin write guide_categories" on public.guide_categories;
create policy "admin write guide_categories" on public.guide_categories for all
  using (public.is_admin()) with check (public.is_admin());

-- تأمين جدول الرسائل (messages): القراءة/التعديل/الحذف محصورة بـ is_admin()
drop policy if exists "admin read messages" on public.messages;
create policy "admin read messages" on public.messages for select
  using (public.is_admin());

drop policy if exists "admin update messages" on public.messages;
create policy "admin update messages" on public.messages for update
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin delete messages" on public.messages;
create policy "admin delete messages" on public.messages for delete
  using (public.is_admin());

-- ----------------------------------------------------------------
-- 4) تأمين Storage: حجم/نوع الملفات على مستوى الـ bucket + سياسات is_admin()
-- ----------------------------------------------------------------
update storage.buckets
set file_size_limit = 2097152, -- 2 ميجابايت
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'images';

drop policy if exists "admin upload images bucket" on storage.objects;
create policy "admin upload images bucket" on storage.objects for insert
  with check (bucket_id = 'images' and public.is_admin());

drop policy if exists "admin update images bucket" on storage.objects;
create policy "admin update images bucket" on storage.objects for update
  using (bucket_id = 'images' and public.is_admin());

drop policy if exists "admin delete images bucket" on storage.objects;
create policy "admin delete images bucket" on storage.objects for delete
  using (bucket_id = 'images' and public.is_admin());

-- سياسة القراءة العمومية لل bucket تبقى كما هي (public read images bucket) بدون تغيير.

-- ----------------------------------------------------------------
-- ⚠️ خطوة إلزامية بعد التنفيذ: أضف حساب المدير الحالي إلى جدول admins
-- وإلا سيفقد المدير القدرة على الإضافة/التعديل/الحذف فورًا (لأن authenticated
-- لم يعد كافيًا). استبدل البريد الإلكتروني بحساب المدير الحقيقي:
-- ----------------------------------------------------------------
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'admin@example.com'
-- on conflict (user_id) do nothing;
