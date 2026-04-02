import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { destination, students, days, interests, tripType, budget, gradeLevel, transportation, notes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `أنت مساعد ذكي متخصص في تخطيط الرحلات المدرسية في منطقة الخليج العربي والشرق الأوسط.
عند تلقي طلب تخطيط رحلة، قدم اقتراحاً مفصلاً يتضمن:
- اسم الوجهة المقترحة
- وصف قصير للوجهة
- 4-5 أنشطة مقترحة
- المدة المقترحة
- نصائح مهمة للرحلة
- التكلفة التقريبية للشخص الواحد

أجب دائماً بصيغة JSON بالشكل التالي:
{
  "destination": "اسم الوجهة",
  "description": "وصف الوجهة",
  "activities": ["نشاط 1", "نشاط 2", "نشاط 3", "نشاط 4"],
  "duration": "المدة",
  "tips": "نصائح مهمة",
  "estimated_cost": "التكلفة التقريبية"
}

لا تكتب أي شيء خارج JSON.`;

    const userPrompt = `أريد تخطيط رحلة مدرسية بالتفاصيل التالية:
- الوجهة المفضلة: ${destination || "أي مكان مناسب"}
- نوع الرحلة: ${tripType || "غير محدد"}
- عدد الطلاب: ${students || "غير محدد"}
- الصف الدراسي: ${gradeLevel || "غير محدد"}
- عدد الأيام: ${days || "يوم واحد"}
- الميزانية لكل طالب: ${budget ? budget + " ر.ع" : "غير محددة"}
- وسيلة النقل: ${transportation || "غير محددة"}
- الاهتمامات: ${interests || "عامة"}
- ملاحظات إضافية: ${notes || "لا توجد"}

اقترح أفضل وجهة مع تفاصيل كاملة.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز حد الطلبات، حاول مرة أخرى لاحقاً" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "يرجى إضافة رصيد للاستمرار" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "خطأ في الذكاء الاصطناعي" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from the response
    let suggestion;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      suggestion = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      suggestion = null;
    }

    if (!suggestion) {
      return new Response(JSON.stringify({ error: "لم يتمكن الذكاء الاصطناعي من إنشاء اقتراح" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("trip-suggest error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
