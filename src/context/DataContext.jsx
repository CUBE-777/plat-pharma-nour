import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import * as api from '../services/api'

const DataContext = createContext(null)

const EMPTY_DATA = {
  pharmacyInfo: null,
  categories: [],
  medicines: [],
  services: [],
  staff: [],
  announcements: [],
  guideCategories: [],
  healthGuides: [],
}

// جلب كل بيانات الموقع دفعة واحدة، عبر طبقة api.js المركزية (services/api.js)
// بدل استدعاء supabase مباشرة هنا. النتيجة والسلوك مطابقان 100% للنسخة السابقة.
async function fetchAll() {
  const [
    pharmacyInfoRes,
    categoriesRes,
    medicinesRes,
    servicesRes,
    staffRes,
    announcementsRes,
    guideCategoriesRes,
    healthGuidesRes,
  ] = await Promise.all([
    api.getPharmacyInfo(),
    api.getCategories(),
    api.getMedicines(),
    api.getServices(),
    api.getStaff(),
    api.getAnnouncements(),
    api.getGuideCategories(),
    api.getHealthGuides(),
  ])

  const firstError = [
    pharmacyInfoRes,
    categoriesRes,
    medicinesRes,
    servicesRes,
    staffRes,
    announcementsRes,
    guideCategoriesRes,
    healthGuidesRes,
  ].find((r) => r.error)

  if (firstError) throw firstError.error

  return {
    pharmacyInfo: pharmacyInfoRes.data,
    categories: categoriesRes.data || [],
    medicines: medicinesRes.data || [],
    services: servicesRes.data || [],
    staff: staffRes.data || [],
    announcements: announcementsRes.data || [],
    guideCategories: guideCategoriesRes.data || [],
    healthGuides: healthGuidesRes.data || [],
  }
}

export function DataProvider({ children }) {
  const [data, setData] = useState(EMPTY_DATA)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dataRef = useRef(data)
  useEffect(() => {
    dataRef.current = data
  }, [data])

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const fresh = await fetchAll()
      setData(fresh)
    } catch (e) {
      console.error(e)
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // كل عمليات الإضافة/التعديل/الحذف تكتب مباشرة فـ Supabase،
  // ثم تحدّث الحالة المحلية بنفس النتيجة اللي رجعها السيرفر.
  const makeCrud = useCallback(
    (table, key) => ({
      add: async (item) => {
        const { data: inserted, error: err } = await supabase
          .from(table)
          .insert(item)
          .select()
          .single()
        if (err) throw err
        setData((prev) => ({ ...prev, [key]: [inserted, ...prev[key]] }))
        return inserted
      },
      update: async (id, patch) => {
        const { data: updated, error: err } = await supabase
          .from(table)
          .update(patch)
          .eq('id', id)
          .select()
          .single()
        if (err) throw err
        setData((prev) => ({
          ...prev,
          [key]: prev[key].map((it) => (it.id === id ? updated : it)),
        }))
        return updated
      },
      remove: async (id) => {
        const { error: err } = await supabase.from(table).delete().eq('id', id)
        if (err) throw err
        setData((prev) => ({ ...prev, [key]: prev[key].filter((it) => it.id !== id) }))
      },
      toggleActive: async (id) => {
        const current = dataRef.current[key].find((it) => it.id === id)
        if (!current) return
        const { data: updated, error: err } = await supabase
          .from(table)
          .update({ active: !current.active })
          .eq('id', id)
          .select()
          .single()
        if (err) {
          console.error(err)
          return
        }
        setData((prev) => ({
          ...prev,
          [key]: prev[key].map((it) => (it.id === id ? updated : it)),
        }))
      },
    }),
    []
  )

  const medicinesCrud = useMemo(() => makeCrud('medicines', 'medicines'), [makeCrud])
  const servicesCrud = useMemo(() => makeCrud('services', 'services'), [makeCrud])
  const staffCrud = useMemo(() => makeCrud('staff', 'staff'), [makeCrud])
  const announcementsCrud = useMemo(() => makeCrud('announcements', 'announcements'), [makeCrud])
  const healthGuidesCrud = useMemo(() => makeCrud('health_guides', 'healthGuides'), [makeCrud])

  const updatePharmacyInfo = useCallback(async (patch) => {
    const { data: updated, error: err } = await supabase
      .from('pharmacy_info')
      .update(patch)
      .eq('id', 1)
      .select()
      .single()
    if (err) throw err
    setData((prev) => ({ ...prev, pharmacyInfo: updated }))
    return updated
  }, [])

  // بدون useMemo هنا، كان يُعاد إنشاء كائن value جديد بمرجع مختلف في كل render
  // للـ DataProvider، مما يجبر React على إعادة تصيير كل مكون يستهلك useData()
  // حتى لو لم تتغير أي بيانات فعلية (Unnecessary Re-renders). الآن value يبقى
  // بنفس المرجع طالما لم تتغير أي من هذه القيم تحديدًا.
  const value = useMemo(
    () => ({
      ...data,
      loading,
      error,
      refresh,
      medicinesCrud,
      servicesCrud,
      staffCrud,
      announcementsCrud,
      healthGuidesCrud,
      updatePharmacyInfo,
    }),
    [
      data,
      loading,
      error,
      refresh,
      medicinesCrud,
      servicesCrud,
      staffCrud,
      announcementsCrud,
      healthGuidesCrud,
      updatePharmacyInfo,
    ]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
