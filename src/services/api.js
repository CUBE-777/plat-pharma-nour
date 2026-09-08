import { supabase } from '../lib/supabaseClient'

// ================================================================
// طبقة API مركزية (Service Layer)
// ================================================================
// الهدف: تجميع كل منطق التواصل مع Supabase في مكان واحد بدل تكراره داخل
// المكونات مباشرة. كل دالة هنا لا "ترمي" استثناء (لا تستخدم throw) بل
// تُرجع دائمًا شكلاً موحدًا وواضحًا: { data, error }
//   - نجاح  -> { data: <النتيجة>, error: null }
//   - فشل   -> { data: null,       error: <كائن الخطأ> }
// هذا يسمح لأي مكون واجهة باستخدامها بسهولة دون الحاجة لـ try/catch إجباري:
//   const { data, error } = await getMedicines()
//   if (error) { /* اعرض رسالة خطأ */ } else { /* استخدم data */ }
//
// ملاحظة: DataContext.jsx الحالي يستخدم دوال getX() هنا لجلب البيانات
// الأولية، لكنه ما زال يدير عمليات الإضافة/التعديل/الحذف داخليًا لضمان
// توافقها الكامل مع الحالة المحلية (setData). الدوال addMedicine/updateMedicine/
// deleteMedicine بالأسفل جاهزة للاستخدام المباشر في أي مكون مستقبلي دون
// المرور بـ DataContext إذا احتجت ذلك.
// ================================================================

async function safeQuery(promise, context) {
  try {
    const { data, error } = await promise
    if (error) {
      console.error(`[api] ${context}:`, error)
      return { data: null, error }
    }
    return { data, error: null }
  } catch (err) {
    console.error(`[api] ${context} (exception):`, err)
    return { data: null, error: err }
  }
}

// ----------------------------------------------------------------
// القراءة (Read)
// ----------------------------------------------------------------

export function getPharmacyInfo() {
  return safeQuery(
    supabase.from('pharmacy_info').select('*').eq('id', 1).maybeSingle(),
    'getPharmacyInfo'
  )
}

export function getCategories() {
  return safeQuery(supabase.from('categories').select('*'), 'getCategories')
}

export function getGuideCategories() {
  return safeQuery(supabase.from('guide_categories').select('*'), 'getGuideCategories')
}

export function getMedicines() {
  return safeQuery(
    supabase.from('medicines').select('*').order('created_at', { ascending: false }),
    'getMedicines'
  )
}

export function getMedicineById(id) {
  return safeQuery(
    supabase.from('medicines').select('*').eq('id', id).single(),
    'getMedicineById'
  )
}

export function getServices() {
  return safeQuery(
    supabase.from('services').select('*').order('created_at', { ascending: false }),
    'getServices'
  )
}

export function getStaff() {
  return safeQuery(
    supabase.from('staff').select('*').order('created_at', { ascending: false }),
    'getStaff'
  )
}

export function getAnnouncements() {
  return safeQuery(
    supabase.from('announcements').select('*').order('created_at', { ascending: false }),
    'getAnnouncements'
  )
}

export function getHealthGuides() {
  return safeQuery(
    supabase.from('health_guides').select('*').order('created_at', { ascending: false }),
    'getHealthGuides'
  )
}

export function getHealthGuideById(id) {
  return safeQuery(
    supabase.from('health_guides').select('*').eq('id', id).single(),
    'getHealthGuideById'
  )
}

// ----------------------------------------------------------------
// الكتابة (Create / Update / Delete) — جاهزة للاستخدام المباشر عند الحاجة
// ----------------------------------------------------------------

export function addMedicine(item) {
  return safeQuery(
    supabase.from('medicines').insert(item).select().single(),
    'addMedicine'
  )
}

export function updateMedicine(id, patch) {
  return safeQuery(
    supabase.from('medicines').update(patch).eq('id', id).select().single(),
    'updateMedicine'
  )
}

export function deleteMedicine(id) {
  return safeQuery(supabase.from('medicines').delete().eq('id', id), 'deleteMedicine')
}

export function addHealthGuide(item) {
  return safeQuery(
    supabase.from('health_guides').insert(item).select().single(),
    'addHealthGuide'
  )
}

export function updateHealthGuide(id, patch) {
  return safeQuery(
    supabase.from('health_guides').update(patch).eq('id', id).select().single(),
    'updateHealthGuide'
  )
}

export function deleteHealthGuide(id) {
  return safeQuery(supabase.from('health_guides').delete().eq('id', id), 'deleteHealthGuide')
}
