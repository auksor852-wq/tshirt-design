import { useState } from "react";
import { ShoppingCart, Check, Loader2, Sparkles, ChevronRight, RotateCcw, ArrowUpRight } from "lucide-react";

type Page = "home" | "gallery" | "ai-studio";
type Category = "all" | "typography" | "graphic" | "minimal" | "streetwear";

interface ShirtVariant {
  id: string;
  label: string;
  photoUrl: string;
  isDark: boolean;
  photoFilter?: string;
}

interface Design {
  id: string;
  name: string;
  category: Category;
  price: number;
}

// ─── Shirt Variants ───────────────────────────────────────────────────────────
// Product shots: Mediamodifier ghost mannequin (white) + Ryan Hoffman (black)
const SHIRT_VARIANTS: ShirtVariant[] = [
  {
    id: "white",
    label: "White",
    photoUrl: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600&h=680&fit=crop&auto=format",
    isDark: false,
  },
  {
    id: "black",
    label: "Black",
    photoUrl: "https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?w=600&h=680&fit=crop&auto=format",
    isDark: true,
  },
  {
    id: "wheat",
    label: "Wheat",
    photoUrl: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600&h=680&fit=crop&auto=format",
    isDark: false,
    photoFilter: "sepia(0.4) brightness(0.88) saturate(0.55)",
  },
];

// ─── Designs ──────────────────────────────────────────────────────────────────
const DESIGNS: Design[] = [
  { id: "form",        name: "Form / Function", category: "minimal",     price: 249000 },
  { id: "tokyo",       name: "Tokyo",           category: "typography",  price: 299000 },
  { id: "peak",        name: "Peak",            category: "graphic",     price: 269000 },
  { id: "quiet",       name: "Quiet",           category: "minimal",     price: 239000 },
  { id: "coordinates", name: "10°44′N",         category: "typography",  price: 259000 },
  { id: "wave",        name: "Surf",            category: "graphic",     price: 279000 },
  { id: "no-limit",    name: "No Limit",        category: "streetwear",  price: 299000 },
  { id: "horizon",     name: "Horizon",         category: "graphic",     price: 269000 },
];

const SIZES = ["XS", "S", "M", "L", "XL", "2XL"];

// ─── Design SVG renderers ─────────────────────────────────────────────────────
// viewBox: "-50 -50 100 100" — coordinates are relative to center (0,0)
function renderDesign(id: string, isDark: boolean): React.ReactNode {
  const ink  = isDark ? "#F7F5F0" : "#0E0D0C";   // main ink color
  const fade = isDark ? "rgba(247,245,240,0.4)" : "rgba(14,13,12,0.3)";

  switch (id) {
    case "form":
      return (
        <g textAnchor="middle" fontFamily="'Be Vietnam', sans-serif">
          <text y="-10" fontSize="18" fill={ink} letterSpacing="5" fontStyle="italic">Form</text>
          <line x1="-22" y1="-3" x2="22" y2="-3" stroke={ink} strokeWidth="0.6" />
          <text y="10" fontSize="6.5" fill={ink} letterSpacing="8" fontFamily="'Be Vietnam', sans-serif" fontWeight="300">FUNCTION</text>
        </g>
      );
    case "tokyo":
      return (
        <g textAnchor="middle">
          <text y="-8" fontSize="22" fill={ink} fontFamily="serif" fontWeight="400">東京</text>
          <line x1="-18" y1="-1" x2="18" y2="-1" stroke={fade} strokeWidth="0.6" />
          <text y="11" fontSize="7" fill={ink} letterSpacing="7" fontFamily="'Be Vietnam', sans-serif" fontWeight="300">TOKYO</text>
        </g>
      );
    case "peak":
      return (
        <g>
          <polyline points="-35,18 -8,-24 15,18"  fill="none" stroke={ink} strokeWidth="1.5" strokeLinejoin="round" />
          <polyline points="-20,18 6,-14 28,18"    fill="none" stroke={ink} strokeWidth="1"   strokeLinejoin="round" opacity="0.4" />
          <line x1="-40" y1="18" x2="40" y2="18"  stroke={ink} strokeWidth="0.6" />
          <text textAnchor="middle" y="30" fontSize="6" fill={ink} letterSpacing="5" fontFamily="'Be Vietnam', sans-serif" fontWeight="300">PEAK</text>
        </g>
      );
    case "quiet":
      return (
        <g textAnchor="middle" fontFamily="'Be Vietnam', sans-serif">
          <text y="2" fontSize="20" fill={ink} letterSpacing="10" fontStyle="italic">Quiet</text>
          <line x1="-30" y1="10" x2="30" y2="10" stroke={ink} strokeWidth="0.5" />
        </g>
      );
    case "coordinates":
      return (
        <g textAnchor="middle">
          <text y="-8" fontSize="9" fill={ink} letterSpacing="2" fontFamily="monospace">10°44′N</text>
          <line x1="-22" y1="-2" x2="22" y2="-2" stroke={fade} strokeWidth="0.5" />
          <text y="10" fontSize="9" fill={ink} letterSpacing="2" fontFamily="monospace">106°41′E</text>
          <text y="23" fontSize="5.5" fill={ink} letterSpacing="4" fontFamily="'Be Vietnam', sans-serif" fontWeight="300" opacity="0.5">HỒ CHÍ MINH</text>
        </g>
      );
    case "wave":
      return (
        <g>
          <path d="M -42 2 C -28 -18 -14 22 2 2 C 18 -18 32 14 44 2"
            fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <path d="M -42 14 C -28 -6 -14 34 2 14 C 18 -6 32 26 44 14"
            fill="none" stroke={ink} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <text textAnchor="middle" y="30" fontSize="6.5" fill={ink} letterSpacing="5" fontFamily="'Be Vietnam', sans-serif" fontWeight="300">SURF</text>
        </g>
      );
    case "no-limit":
      return (
        <g textAnchor="middle" fontFamily="'Be Vietnam', sans-serif">
          <text y="-8" fontSize="15" fill={ink} letterSpacing="4">NO LIMIT</text>
          <line x1="-34" y1="-1" x2="34" y2="-1" stroke={ink} strokeWidth="0.6" />
          <text y="11" fontSize="6" fill={ink} letterSpacing="6" fontFamily="'Be Vietnam', sans-serif" fontWeight="300">SINCE 2024</text>
        </g>
      );
    case "horizon":
      return (
        <g>
          <line x1="-42" y1="0" x2="42" y2="0" stroke={ink} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="8" fill={ink} />
          <circle cx="0" cy="0" r="14" fill="none" stroke={ink} strokeWidth="0.6" />
          <circle cx="0" cy="0" r="22" fill="none" stroke={ink} strokeWidth="0.4" opacity="0.5" />
          <text textAnchor="middle" y="38" fontSize="6" fill={ink} letterSpacing="6" fontFamily="'Be Vietnam', sans-serif" fontWeight="300">HORIZON</text>
        </g>
      );
    default:
      return null;
  }
}

// ─── AI design map ────────────────────────────────────────────────────────────
const AI_DESIGNS: { key: string; name: string; keywords: RegExp }[] = [
  { key: "peak",        name: "Peak",    keywords: /mountain|nature|núi|outdoor|peak|hill|rừng/i },
  { key: "wave",        name: "Surf",    keywords: /wave|ocean|surf|sea|biển|sóng/i },
  { key: "coordinates", name: "10°44′N", keywords: /city|coord|viet|hcm|hanoi|saigon|travel|địa/i },
  { key: "quiet",       name: "Quiet",   keywords: /quiet|calm|peace|minimal|simple|đơn|tĩnh/i },
  { key: "no-limit",    name: "No Limit",keywords: /street|bold|power|limit|hustle|fire|phong/i },
  { key: "tokyo",       name: "Tokyo",   keywords: /japan|asia|tokyo|nhật|đông/i },
  { key: "horizon",     name: "Horizon", keywords: /space|cosmos|abstract|vũ|trời|horizon/i },
  { key: "form",        name: "Form",    keywords: /.*/i },  // default
];

function matchAIDesign(prompt: string): typeof AI_DESIGNS[0] {
  return AI_DESIGNS.find(d => d.keywords.test(prompt)) ?? AI_DESIGNS[AI_DESIGNS.length - 1];
}

// ─── Shirt Photo Mockup ───────────────────────────────────────────────────────
// Real photo with SVG design overlay at the chest print zone.
// mix-blend-mode: multiply on light shirts makes ink look screen-printed.
function ShirtPhoto({
  variant,
  design,
  className = "",
}: {
  variant: ShirtVariant;
  design: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden bg-muted ${className}`} style={{ aspectRatio: "600/680" }}>
      <img
        src={variant.photoUrl}
        alt={`${variant.label} t-shirt`}
        className="w-full h-full object-cover"
        style={variant.photoFilter ? { filter: variant.photoFilter } : undefined}
      />
      {design && (
        <div
          style={{
            position: "absolute",
            top: "17%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "44%",
            mixBlendMode: variant.isDark ? "normal" : "multiply",
            pointerEvents: "none",
          }}
        >
          <svg viewBox="-50 -50 100 100" width="100%" height="auto">
            {design}
          </svg>
        </div>
      )}
    </div>
  );
}

// ─── Variant Picker ───────────────────────────────────────────────────────────
function VariantPicker({
  variants,
  selected,
  onSelect,
}: {
  variants: ShirtVariant[];
  selected: ShirtVariant;
  onSelect: (v: ShirtVariant) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {variants.map(v => (
        <button
          key={v.id}
          title={v.label}
          onClick={() => onSelect(v)}
          className={`flex items-center gap-1.5 text-xs transition-all ${
            selected.id === v.id ? "text-foreground font-medium" : "text-muted-foreground"
          }`}
        >
          <span
            className={`w-4 h-4 rounded-sm inline-block border ${
              selected.id === v.id ? "border-foreground" : "border-border"
            }`}
            style={{
              backgroundColor:
                v.id === "white" ? "#F8F8F5" :
                v.id === "black" ? "#1C1C1C" : "#D4C19A",
            }}
          />
          {v.label}
        </button>
      ))}
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const [heroVariant, setHeroVariant] = useState(SHIRT_VARIANTS[0]);
  const [heroDesign]   = useState("form");

  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-4rem)]">
        {/* Left */}
        <div className="space-y-10">
          <p className="text-xs tracking-widest text-muted-foreground uppercase">Custom Print Studio</p>

          <h1 className="font-display text-6xl lg:text-7xl leading-[1.04]">
            Thiết kế.<br />
            <em className="not-italic">In.</em><br />
            Mặc.
          </h1>

          <p className="text-muted-foreground leading-relaxed max-w-sm">
            500+ thiết kế tinh chỉnh sẵn hoặc để AI tạo mẫu riêng từ ý tưởng của bạn. Cotton cao cấp, giao trong 24 giờ.
          </p>

          <div className="flex items-center gap-8">
            <button
              onClick={() => setPage("gallery")}
              className="flex items-center gap-2 text-sm font-medium border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity"
            >
              Xem bộ sưu tập
              <ArrowUpRight size={14} />
            </button>
            <button
              onClick={() => setPage("ai-studio")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Sparkles size={13} />
              AI Studio
            </button>
          </div>

          <div className="flex gap-12 pt-4 border-t border-border">
            {[
              { val: "500+", label: "Thiết kế" },
              { val: "10k+", label: "Khách hàng" },
              { val: "24h",  label: "Giao hàng" },
            ].map(s => (
              <div key={s.label}>
                <div className="font-display text-3xl">{s.val}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: real shirt photo */}
        <div className="flex flex-col items-center gap-5">
          <ShirtPhoto
            variant={heroVariant}
            design={renderDesign(heroDesign, heroVariant.isDark)}
            className="max-w-xs w-full"
          />
          <VariantPicker
            variants={SHIRT_VARIANTS}
            selected={heroVariant}
            onSelect={setHeroVariant}
          />
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Feature strip */}
      <section className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap gap-x-12 gap-y-3">
        {[
          "In trực tiếp trên vải — không ép nhiệt",
          "Cotton combed 200g cao cấp",
          "Giao hàng trong 24h tại TP.HCM",
          "Miễn phí điều chỉnh thiết kế",
        ].map(t => (
          <span key={t} className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-foreground inline-block" />
            {t}
          </span>
        ))}
      </section>

      <div className="border-t border-border" />

      {/* Collection preview */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-4xl">Bộ sưu tập</h2>
          <button
            onClick={() => setPage("gallery")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Xem tất cả <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DESIGNS.slice(0, 4).map((d, i) => {
            const variant = i % 2 === 0 ? SHIRT_VARIANTS[0] : SHIRT_VARIANTS[1];
            return (
              <button
                key={d.id}
                onClick={() => setPage("gallery")}
                className="group text-left"
              >
                <div className="overflow-hidden">
                  <ShirtPhoto
                    variant={variant}
                    design={renderDesign(d.id, variant.isDark)}
                    className="group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm">{d.name}</span>
                  <span className="text-sm text-muted-foreground">{d.price.toLocaleString("vi-VN")}₫</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* AI Studio teaser */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Preview grid */}
        <div className="grid grid-cols-2 gap-3">
          {(["peak", "wave", "quiet", "horizon"] as const).map((id, i) => {
            const v = i % 3 === 0 ? SHIRT_VARIANTS[1] : SHIRT_VARIANTS[0];
            return (
              <ShirtPhoto
                key={id}
                variant={v}
                design={renderDesign(id, v.isDark)}
              />
            );
          })}
        </div>

        {/* Copy */}
        <div className="space-y-8">
          <span className="text-xs tracking-widest text-muted-foreground uppercase flex items-center gap-2">
            <Sparkles size={11} /> Tính năng mới
          </span>
          <h2 className="font-display text-5xl leading-tight">
            Thiết kế<br />
            cùng <em>AI</em>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Mô tả ý tưởng bằng lời — AI phân tích và tạo ra thiết kế in áo phù hợp. Không cần kỹ năng thiết kế.
          </p>
          <button
            onClick={() => setPage("ai-studio")}
            className="flex items-center gap-2 text-sm font-medium border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity"
          >
            Thử AI Studio
            <ArrowUpRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
function GalleryPage({ addToCart }: { addToCart: (n: string) => void }) {
  const [category, setCategory] = useState<Category>("all");
  const [variant,  setVariant]  = useState(SHIRT_VARIANTS[0]);
  const [selected, setSelected] = useState(DESIGNS[0]);
  const [size,     setSize]     = useState("M");

  const cats: { id: Category; label: string }[] = [
    { id: "all",        label: "Tất cả"     },
    { id: "minimal",    label: "Minimal"    },
    { id: "typography", label: "Typography" },
    { id: "graphic",    label: "Graphic"    },
    { id: "streetwear", label: "Streetwear" },
  ];
  const filtered = category === "all" ? DESIGNS : DESIGNS.filter(d => d.category === category);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <h1 className="font-display text-5xl">Bộ sưu tập</h1>
        <div className="flex gap-6">
          {cats.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`text-sm transition-colors ${
                category === c.id ? "text-foreground border-b border-foreground pb-0.5" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10 items-start">
        {/* Design grid */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map(d => (
            <button
              key={d.id}
              onClick={() => setSelected(d)}
              className="group text-left"
            >
              <div className={`overflow-hidden ${selected.id === d.id ? "outline outline-1 outline-foreground" : ""}`}>
                <ShirtPhoto
                  variant={variant}
                  design={renderDesign(d.id, variant.isDark)}
                  className="group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className={`text-sm ${selected.id === d.id ? "font-medium" : ""}`}>{d.name}</span>
                <span className="text-sm text-muted-foreground">{d.price.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 capitalize">{d.category}</div>
            </button>
          ))}
        </div>

        {/* Order panel */}
        <div className="lg:sticky lg:top-24 space-y-8">
          {/* Large preview */}
          <ShirtPhoto
            variant={variant}
            design={renderDesign(selected.id, variant.isDark)}
          />

          <div className="space-y-6">
            <div>
              <h3 className="font-display text-2xl">{selected.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">{selected.category}</p>
            </div>

            {/* Shirt variant */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Màu áo</p>
              <VariantPicker variants={SHIRT_VARIANTS} selected={variant} onSelect={setVariant} />
            </div>

            {/* Size */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Kích thước</p>
              <div className="flex gap-2 flex-wrap">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-10 h-10 text-sm border transition-colors ${
                      size === s
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price + CTA */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Giá</span>
                <span className="font-display text-3xl">{selected.price.toLocaleString("vi-VN")}₫</span>
              </div>
              <button
                onClick={() => addToCart(selected.name)}
                className="w-full py-3 border border-foreground bg-foreground text-background text-sm font-medium hover:bg-transparent hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={15} />
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Studio ────────────────────────────────────────────────────────────────
function AIStudioPage({ addToCart }: { addToCart: (n: string) => void }) {
  const [prompt,  setPrompt]  = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<{ key: string; name: string } | null>(null);
  const [variant, setVariant] = useState(SHIRT_VARIANTS[0]);
  const [size,    setSize]    = useState("M");

  const examples = [
    "Ngọn núi tuyết và rừng thông",
    "Sóng biển tầng tầng, bình yên",
    "Tọa độ thành phố Hồ Chí Minh",
    "Đơn giản — một đường chân trời",
    "Phong cách đường phố, không giới hạn",
    "Thiên văn, vũ trụ, hành tinh",
  ];

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 2600));
    setResult(matchAIDesign(prompt));
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-14 text-center space-y-3">
        <span className="text-xs tracking-widest text-muted-foreground uppercase flex items-center justify-center gap-2">
          <Sparkles size={11} /> AI Studio
        </span>
        <h1 className="font-display text-5xl lg:text-6xl">Ý tưởng của bạn,<br /><em>in ngay hôm nay.</em></h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Mô tả bằng lời — AI tạo thiết kế phù hợp. Không cần kỹ năng thiết kế.
        </p>
      </div>

      {/* Prompt */}
      <div className="space-y-4 mb-12">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generate(); }}
          placeholder="Ví dụ: Tôi muốn chiếc áo phong cách đơn giản, có hình ngọn núi tuyết và dòng chữ nhỏ phía dưới..."
          className="w-full h-28 bg-background border border-border p-4 text-sm resize-none focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground font-sans"
        />

        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {examples.map(ex => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="px-3 py-1 border border-border text-xs text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="shrink-0 ml-4 px-6 py-2.5 border border-foreground bg-foreground text-background text-sm font-medium hover:bg-transparent hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <><Loader2 size={14} className="animate-spin" /> Đang tạo...</>
            ) : (
              <><Sparkles size={14} /> Tạo thiết kế</>
            )}
          </button>
        </div>
      </div>

      {/* Result */}
      <div className="border-t border-border pt-12">
        {loading && (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border border-border rounded-full" />
              <div className="absolute inset-0 border border-foreground border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-sm">AI đang phân tích ý tưởng...</p>
              <p className="text-xs text-muted-foreground">Tạo thiết kế phù hợp với mô tả của bạn</p>
            </div>
          </div>
        )}

        {!loading && !result && (
          <div className="py-20 text-center text-muted-foreground text-sm">
            Nhập mô tả và nhấn "Tạo thiết kế" để xem kết quả
          </div>
        )}

        {!loading && result && (
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Shirt photo */}
            <div className="space-y-4">
              <ShirtPhoto
                variant={variant}
                design={renderDesign(result.key, variant.isDark)}
              />
              <VariantPicker variants={SHIRT_VARIANTS} selected={variant} onSelect={setVariant} />
            </div>

            {/* Order details */}
            <div className="space-y-8 lg:pt-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Thiết kế AI</p>
                <h2 className="font-display text-3xl">{result.name}</h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Tạo từ: <em className="text-foreground not-italic">"{prompt}"</em>
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Kích thước</p>
                <div className="flex gap-2 flex-wrap">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`w-10 h-10 text-sm border transition-colors ${
                        size === s
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Giá (AI design)</span>
                  <span className="font-display text-3xl">349.000₫</span>
                </div>
                <button
                  onClick={() => addToCart(result.name)}
                  className="w-full py-3 border border-foreground bg-foreground text-background text-sm font-medium hover:bg-transparent hover:text-foreground transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={15} />
                  Đặt in ngay
                </button>
                <button
                  onClick={() => { setPrompt(""); setResult(null); }}
                  className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw size={11} />
                  Thử lại với ý tưởng mới
                </button>
              </div>

              {/* Steps */}
              <div className="pt-4 border-t border-border space-y-3">
                {[
                  "Xác nhận đơn hàng trong 30 phút",
                  "In DTG trực tiếp trên vải — sắc nét, bền màu",
                  "Đóng gói và giao trong 24h",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-muted-foreground">
                    <span className="font-display text-foreground mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page,  setPage]  = useState<Page>("home");
  const [cart,  setCart]  = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const addToCart = (name: string) => {
    setCart(c => c + 1);
    setToast(`"${name}" đã thêm vào giỏ hàng`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-foreground text-background px-5 py-3 text-sm">
          <Check size={13} />
          {toast}
        </div>
      )}

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setPage("home")}
            className="font-display text-lg tracking-wide"
          >
            Printcraft
          </button>

          <div className="hidden md:flex items-center gap-8">
            {([
              { id: "home",      label: "Trang chủ"   },
              { id: "gallery",   label: "Bộ sưu tập"  },
              { id: "ai-studio", label: "AI Studio"    },
            ] as const).map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`text-sm transition-colors ${
                  page === item.id
                    ? "text-foreground border-b border-foreground pb-0.5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {item.id === "ai-studio" && (
                  <Sparkles size={10} className="inline ml-1 mb-0.5 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => cart > 0 && setToast(`Giỏ hàng có ${cart} sản phẩm`)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ShoppingCart size={16} />
            {cart > 0 && <span className="text-foreground font-medium">{cart}</span>}
          </button>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex border-t border-border">
          {([
            { id: "home",      label: "Trang chủ"  },
            { id: "gallery",   label: "Bộ sưu tập" },
            { id: "ai-studio", label: "AI Studio"   },
          ] as const).map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex-1 py-2.5 text-xs transition-colors ${
                page === item.id ? "text-foreground border-b border-foreground" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="pt-14">
        {page === "home"      && <HomePage      setPage={setPage} />}
        {page === "gallery"   && <GalleryPage   addToCart={addToCart} />}
        {page === "ai-studio" && <AIStudioPage  addToCart={addToCart} />}
      </div>
    </div>
  );
}
