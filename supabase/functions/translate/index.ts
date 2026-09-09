// Supabase Edge Function: /translate
// ================================================================
// الهدف: ترجمة نص من لغة إلى أخرى بأمان، دون كشف أي منطق أو مفاتيح في المتصفح.
// نستخدم خدمة MyMemory المجانية (https://mymemory.translated.net) — لا تحتاج
// مفتاح API إطلاقًا، مناسبة لحجم استخدام صيدلية واحدة (حد يومي معقول للترجمات
// القصيرة). النتيجة تُستخدم في لوحة الإدارة كـ "مسودة مقترحة" يراجعها المدير
// قبل الحفظ — وليست نصًا يُنشر مباشرة للزوار بدون مراجعة بشرية.
//
// بشكل افتراضي، Supabase يتطلب توكن مصادقة صالح (verify_jwt) لاستدعاء أي
// Edge Function، أي أن زائرًا عاديًا غير مسجّل دخول لا يقدر يستدعي هذه الدالة
// مباشرة من خارج لوحة الإدارة.
// ================================================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPPORTED_LANGS = new Set(['ar', 'fr', 'en'])

Deno.serve(async (req) => {
  // طلبات Preflight الخاصة بـ CORS من المتصفح
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const { text, source, target } = await req.json()

    if (
      typeof text !== 'string' ||
      !text.trim() ||
      !SUPPORTED_LANGS.has(source) ||
      !SUPPORTED_LANGS.has(target) ||
      source === target
    ) {
      return new Response(JSON.stringify({ error: 'invalid_input' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // حماية بسيطة من نصوص طويلة جدًا (كفاءة + منع إساءة استخدام الحصة اليومية المجانية)
    const safeText = text.slice(0, 1000)

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      safeText
    )}&langpair=${source}|${target}&de=contact@alnour-pharmacy.ma`

    const res = await fetch(url)
    const data = await res.json()
    const translated = data?.responseData?.translatedText

    if (!translated || data?.responseStatus === 403) {
      return new Response(JSON.stringify({ error: 'translation_failed' }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ translatedText: translated }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'server_error', message: String(err) }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
