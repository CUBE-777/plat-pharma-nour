-- ================================================================
-- Pharma+ — إعداد قاعدة البيانات على Supabase
-- نفّذ هذا الملف مرة واحدة فقط من: Supabase Dashboard -> SQL Editor -> New query
-- بعده نفّذ ملف seed.sql لتعبئة البيانات التجريبية (اختياري لكن مستحسن للبداية)
-- ================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------
-- الجداول (Tables)
-- ----------------------------------------------------------------

create table if not exists public.categories (
  id text primary key,
  name jsonb not null
);

create table if not exists public.guide_categories (
  id text primary key,
  icon text,
  name jsonb not null
);

create table if not exists public.medicines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  "categoryId" text references public.categories(id) on delete set null,
  "activeIngredient" jsonb,
  concentration text,
  form jsonb,
  price numeric not null default 0,
  availability text not null default 'available',
  image text,
  info jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  icon text,
  active boolean not null default true,
  name jsonb not null,
  "shortDesc" jsonb,
  details jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role jsonb,
  bio jsonb,
  image text,
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  active boolean not null default true,
  icon text,
  text jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.health_guides (
  id uuid primary key default gen_random_uuid(),
  "categoryId" text references public.guide_categories(id) on delete set null,
  active boolean not null default true,
  title jsonb not null,
  cover text,
  intro jsonb,
  "keyPoints" jsonb,
  tips jsonb,
  created_at timestamptz not null default now()
);

-- رسائل واردة من 3 نماذج فـ الموقع العمومي: تواصل معنا (Contact)،
-- استفسار عن دواء (InquiryModal)، اسأل الصيدلي (AskPharmacistModal).
-- عمود "type" كيميز مصدر الرسالة، وباقي الأعمدة اختيارية حسب النموذج.
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

-- صف واحد فقط (id ثابت = 1) لمعلومات الصيدلية العامة
create table if not exists public.pharmacy_info (
  id integer primary key default 1,
  name jsonb,
  slogan jsonb,
  description jsonb,
  address jsonb,
  city jsonb,
  phone text,
  whatsapp text,
  email text,
  "mapUrl" text,
  "mapLink" text,
  "logoInitial" text,
  "openingHours" jsonb,
  images jsonb,
  socials jsonb,
  constraint single_row check (id = 1)
);

-- صف افتراضي إجباري: بدونه الموقع العمومي (Navbar/Footer) غادي يعطي خطأ
-- لأنه كيتوقع أن معلومات الصيدلية موجودة دائمًا. عدّل القيم من لوحة Admin
-- بعد النشر، أو نفّذ seed.sql لتعبئتها ببيانات تجريبية كاملة.
insert into public.pharmacy_info (
  id, name, slogan, description, address, city, phone, whatsapp, email,
  "mapUrl", "mapLink", "logoInitial", "openingHours", images, socials
) values (
  1,
  '{"ar":"صيدليتي","fr":"Ma Pharmacie","en":"My Pharmacy"}'::jsonb,
  '{"ar":"","fr":"","en":""}'::jsonb,
  '{"ar":"","fr":"","en":""}'::jsonb,
  '{"ar":"","fr":"","en":""}'::jsonb,
  '{"ar":"","fr":"","en":""}'::jsonb,
  '',
  '',
  '',
  '',
  '',
  'ص',
  '{"mon":{"open":"08:30","close":"20:00","closed":false},"tue":{"open":"08:30","close":"20:00","closed":false},"wed":{"open":"08:30","close":"20:00","closed":false},"thu":{"open":"08:30","close":"20:00","closed":false},"fri":{"open":"08:30","close":"20:00","closed":false},"sat":{"open":"09:00","close":"18:00","closed":false},"sun":{"open":"09:00","close":"13:00","closed":true}}'::jsonb,
  '["", "", ""]'::jsonb,
  '{}'::jsonb
)
on conflict (id) do nothing;

-- ----------------------------------------------------------------
-- تفعيل Row Level Security (RLS) على كل الجداول
-- القاعدة: الجميع يقدر "يقرأ" (الموقع عمومي)، وغير المسؤول (Admin)
-- المسجّل دخوله عبر Supabase Auth هو اللي يقدر يضيف/يعدّل/يحذف.
-- ----------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.guide_categories enable row level security;
alter table public.medicines enable row level security;
alter table public.services enable row level security;
alter table public.staff enable row level security;
alter table public.announcements enable row level security;
alter table public.health_guides enable row level security;
alter table public.pharmacy_info enable row level security;
alter table public.messages enable row level security;

-- قراءة عمومية (public read) لكل الجداول
create policy "public read categories" on public.categories for select using (true);
create policy "public read guide_categories" on public.guide_categories for select using (true);
create policy "public read medicines" on public.medicines for select using (true);
create policy "public read services" on public.services for select using (true);
create policy "public read staff" on public.staff for select using (true);
create policy "public read announcements" on public.announcements for select using (true);
create policy "public read health_guides" on public.health_guides for select using (true);
create policy "public read pharmacy_info" on public.pharmacy_info for select using (true);

-- الكتابة (insert/update/delete) فقط لمستخدم مسجّل دخوله (Admin)
create policy "admin write medicines" on public.medicines for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write services" on public.services for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write staff" on public.staff for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write announcements" on public.announcements for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write health_guides" on public.health_guides for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write pharmacy_info" on public.pharmacy_info for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write categories" on public.categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write guide_categories" on public.guide_categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- messages: أي زائر (حتى غير المسجّل) يقدر "يكتب" رسالة (insert) عبر
-- نماذج الموقع، لكن القراءة/التعديل/الحذف محصورة بالإدارة فقط — حماية
-- لخصوصية بيانات الزوار (هاتف/بريد/رسالة).
create policy "public insert messages" on public.messages for insert with check (true);
create policy "admin read messages" on public.messages for select
  using (auth.role() = 'authenticated');
create policy "admin update messages" on public.messages for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin delete messages" on public.messages for delete
  using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------
-- Storage: bucket لتخزين صور الأدوية / الفريق / المقالات الصحية
-- ----------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "public read images bucket" on storage.objects for select
  using (bucket_id = 'images');

create policy "admin upload images bucket" on storage.objects for insert
  with check (bucket_id = 'images' and auth.role() = 'authenticated');

create policy "admin update images bucket" on storage.objects for update
  using (bucket_id = 'images' and auth.role() = 'authenticated');

create policy "admin delete images bucket" on storage.objects for delete
  using (bucket_id = 'images' and auth.role() = 'authenticated');
