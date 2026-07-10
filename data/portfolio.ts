export type NullableLink = string | null;

export type ContentTodo = {
  readonly field: string;
  readonly note: string;
};

export type ProjectArchitectureItem = {
  readonly title: string;
  readonly description: string;
};

export type ProjectVisual = {
  readonly tone: "mint" | "ink" | "teal" | "stone" | "sand";
  readonly label: string;
};

export type ProjectGalleryItem = {
  readonly src: string;
  readonly alt: string;
  readonly caption: string | null;
};

export type PortfolioProject = {
  readonly slug: string;
  readonly index: string;
  readonly title: string;
  readonly category: string;
  readonly summary: string;
  readonly problem: string | null;
  readonly approach: string | null;
  readonly role: string | null;
  readonly period: string | null;
  readonly year: string | null;
  readonly technologies: readonly string[];
  readonly technicalFocus: string | null;
  readonly architecture: readonly ProjectArchitectureItem[];
  readonly features: readonly string[];
  readonly outcome: string | null;
  readonly links: {
    readonly demo: NullableLink;
    readonly github: NullableLink;
  };
  readonly visual: ProjectVisual;
  readonly gallery: readonly ProjectGalleryItem[];
  /** Editorial gaps live here so the public UI never needs fake copy. */
  readonly contentTodos: readonly ContentTodo[];
};

export type StackGroup = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly technologies: readonly string[];
};

export type Experience = {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly description: string | null;
  readonly contentTodos: readonly ContentTodo[];
};

export type Education = {
  readonly institution: string;
  readonly degree: string;
  readonly graduation: string;
  readonly gpa: string;
};

export type ProcessStep = {
  readonly index: string;
  readonly title: string;
  readonly description: string;
};

export type NowItem = {
  readonly title: string;
  readonly description: string;
};

export const profile = {
  name: "Yunus Emre Koyun",
  shortName: "Yunus Emre",
  role: "Full-stack Developer",
  location: "Kütahya, Türkiye",
  education: "Bilgisayar Mühendisliği mezunu",
  availability: "Yeni projelere ve iş fırsatlarına açık",
  intro:
    "Arayüzden veritabanına, sunucudan canlı ortama kadar ürünün tamamıyla ilgileniyorum.",
  about: [
    "İş süreçlerini yalnızca çalışan ekranlara değil, sürdürülebilir ürünlere dönüştürüyorum.",
    "Full-stack ürün geliştirme, backend mimarisi, veritabanı tasarımı ve deployment süreçlerine birlikte bakıyorum.",
    "Web ürünlerinin yanında native macOS araçları ve oyun geliştirme çalışmalarına da alan açıyorum.",
  ],
  email: "yunusemrekoyun26@gmail.com",
  githubUsername: "yunusemrekoyun",
  links: {
    email: "mailto:yunusemrekoyun26@gmail.com",
    github: "https://github.com/yunusemrekoyun",
    linkedin: null,
    cv: null,
  },
} as const;

export const projects = [
  {
    slug: "disksync",
    index: "01",
    title: "DiskSync",
    category: "Native macOS utility",
    summary:
      "MacBook çentiğini yedekleme, medya kontrolleri ve sistem araçları için küçük bir kontrol merkezine dönüştüren native macOS ürünü.",
    problem:
      "Gün içinde sık kullanılan dosya, medya ve sistem araçları farklı yüzeylere dağılıyor. Harici diske güvenli yedek alma süreci de bu dağınık akışın ayrı bir parçası olarak kalıyor.",
    approach:
      "DiskSync, tek yönlü ve dosya silmeyen klasör eşitlemesini MacBook çentiğine yerleşen kompakt bir araç setiyle bir araya getiriyor. Ürün, yedeklemeyi tek işlev olarak değil macOS içindeki günlük akışın bir parçası olarak ele alıyor.",
    role: null,
    period: null,
    year: null,
    technologies: [],
    technicalFocus:
      "Güvenli tek yönlü eşitleme ile sistem araçlarını aynı native yüzeyde toplamak.",
    architecture: [
      {
        title: "Safe sync",
        description:
          "Harici diske tek yönlü, mirror benzeri fakat kaynakta bulunmayan dosyaları silmeyen eşitleme akışı.",
      },
      {
        title: "System surface",
        description:
          "Now Playing, pil ve CPU/GPU/RAM bilgilerini çentik çevresinde erişilebilir tutan native arayüz.",
      },
      {
        title: "Daily utilities",
        description:
          "Uygulama başlatıcı, clipboard, file shelf ve AirDrop işlemlerini aynı ürün dili içinde birleştiren araç seti.",
      },
    ],
    features: [
      "Harici diske tek yönlü klasör yedekleme",
      "Dosya silmeden güvenli eşitleme",
      "Now Playing kontrolleri ve pil detayları",
      "Uygulama başlatıcı, clipboard ve file shelf",
      "AirDrop işlemleri",
      "CPU, GPU ve RAM görünümü",
    ],
    outcome: null,
    links: {
      demo: null,
      github: null,
    },
    visual: {
      tone: "mint",
      label: "Notch / Sync / System",
    },
    gallery: [],
    contentTodos: [
      { field: "role", note: "Projede üstlenilen rolü doğrula." },
      { field: "technologies", note: "Kesin native teknoloji setini doğrula." },
      { field: "period", note: "Geliştirme tarihini doğrula." },
      { field: "links", note: "Yayın veya repository bağlantısı varsa ekle." },
      { field: "gallery", note: "Gerçek uygulama ekranlarını ekle." },
      { field: "outcome", note: "Doğrulanabilir sonuç veya yayın durumunu ekle." },
    ],
  },
  {
    slug: "hotel-operations",
    index: "02",
    title: "Otel Operasyon Sistemi",
    category: "Operations platform",
    summary:
      "Rezervasyondan muhasebeye, oda operasyonundan KBS süreçlerine kadar gerçek otel işleyişini tek sistemde buluşturan kapsamlı platform.",
    problem:
      "Otel operasyonları müşteri rezervasyonu, personel rolleri, oda durumu, ödeme ve resmi bildirim süreçleri arasında kesintisiz veri akışı gerektiriyor.",
    approach:
      "Sistem, müşteri tarafındaki rezervasyon akışı ile yönetim ve saha operasyonlarını rol bazlı ekranlar üzerinden aynı ürün mimarisinde bir araya getiriyor.",
    role: null,
    period: null,
    year: null,
    technologies: ["Docker"],
    technicalFocus:
      "Birbirine bağlı rezervasyon, oda, ödeme ve personel süreçlerini operasyonel bir bütün olarak modellemek.",
    architecture: [
      {
        title: "Guest flow",
        description:
          "Müşteri rezervasyon akışı, oda seçimi ve ödeme adımlarının aynı süreç içinde yönetilmesi.",
      },
      {
        title: "Role-based operations",
        description:
          "Yönetim, personel ve oda görevlisi ekranlarının görev alanlarına göre ayrılması.",
      },
      {
        title: "Deployment",
        description: "Uygulama bileşenlerinin Docker tabanlı canlı ortam yapısında çalıştırılması.",
      },
    ],
    features: [
      "Yönetim paneli ve personel rolleri",
      "Müşteri rezervasyon akışı",
      "Oda ve rezervasyon yönetimi",
      "Muhasebe işlemleri",
      "Oda görevlisi ekranları",
      "KBS süreçleri ve ödeme entegrasyonu",
      "Docker tabanlı deployment",
    ],
    outcome: null,
    links: {
      demo: null,
      github: null,
    },
    visual: {
      tone: "ink",
      label: "Booking / Roles / Operations",
    },
    gallery: [],
    contentTodos: [
      { field: "role", note: "Projede üstlenilen rolü doğrula." },
      { field: "period", note: "Proje tarihini doğrula." },
      { field: "technologies", note: "Docker dışındaki kesin teknoloji setini ekle." },
      { field: "links", note: "Paylaşılabilir demo veya repository bağlantısını ekle." },
      { field: "gallery", note: "Gerçek yönetim ve operasyon ekranlarını ekle." },
      { field: "outcome", note: "Doğrulanabilir operasyonel sonucu ekle." },
    ],
  },
  {
    slug: "zumra-akademi",
    index: "03",
    title: "Zümra Akademi",
    category: "Education CRM",
    summary:
      "Adaydan kayda, ödeme planından güvenlik altyapısına kadar bir eğitim kurumunun öğrenci yaşam döngüsünü yöneten CRM ürünü.",
    problem:
      "Aday, randevu, kayıt, danışmanlık ve finans süreçleri ayrı araçlarda yürüdüğünde öğrenci yolculuğunun takibi ve yetki kontrolü zorlaşıyor.",
    approach:
      "Aday yönetiminden öğrenci kaydına uzanan akış; rol bazlı yetkilendirme, audit log, ödeme ve medya süreçleriyle tek bir yönetim sistemi içinde modelleniyor.",
    role: null,
    period: null,
    year: null,
    technologies: [
      "Next.js",
      "PostgreSQL",
      "Drizzle ORM",
      "Better Auth",
      "Redis",
      "BullMQ",
      "FFmpeg",
      "Docker",
      "Nginx",
    ],
    technicalFocus:
      "Kurumun kayıt ve finans süreçlerini kuyruk, medya işleme, audit ve yedekleme katmanlarıyla birlikte tasarlamak.",
    architecture: [
      {
        title: "Core data",
        description:
          "Aday, başvuru, randevu, danışman, öğrenci ve ödeme verilerinin PostgreSQL ve Drizzle ORM üzerinde modellenmesi.",
      },
      {
        title: "Background work",
        description:
          "Redis ve BullMQ ile arka plan işlerinin; FFmpeg ile medya işleme süreçlerinin ayrıştırılması.",
      },
      {
        title: "Access & operations",
        description:
          "Better Auth, rol bazlı yetkilendirme ve audit log ile izlenebilir erişim; Docker ve Nginx ile canlı ortam yapısı.",
      },
    ],
    features: [
      "Aday, başvuru ve randevu yönetimi",
      "Danışman atama ve öğrenci kayıt süreçleri",
      "Ödeme planı ve senet yönetimi",
      "Rol bazlı yetkilendirme ve audit log",
      "Medya işleme",
      "Yedekleme ve güvenlik altyapısı",
    ],
    outcome: null,
    links: {
      demo: null,
      github: null,
    },
    visual: {
      tone: "teal",
      label: "CRM / Queue / Media",
    },
    gallery: [],
    contentTodos: [
      { field: "role", note: "Projede üstlenilen rolü doğrula." },
      { field: "period", note: "Proje tarihini doğrula." },
      { field: "links", note: "Paylaşılabilir demo veya repository bağlantısını ekle." },
      { field: "gallery", note: "Gerçek CRM ekranlarını ekle." },
      { field: "outcome", note: "Doğrulanabilir ürün sonucunu ekle." },
    ],
  },
  {
    slug: "kutahya-satilik",
    index: "04",
    title: "Kütahya Satılık",
    category: "Real-estate platform",
    summary:
      "Arama, filtreleme ve ilan keşfini mobil uyumlu; SEO ve performans odaklı bir yapıda sunan modern emlak platformu.",
    problem:
      "İlan sayısı büyüdükçe kullanıcıların doğru mülke ulaşması, filtrelerini paylaşabilmesi ve detay sayfalarını arama motorlarından keşfedebilmesi kritik hâle geliyor.",
    approach:
      "Filtre durumu URL üzerinde taşınarak aranabilir ve paylaşılabilir keşif akışları oluşturuluyor; ilan detayları mobil kullanım ve organik erişim odağında düzenleniyor.",
    role: null,
    period: null,
    year: null,
    technologies: [],
    technicalFocus:
      "URL tabanlı filtreleme ile SEO, performans ve mobil ilan keşfini aynı ürün akışında buluşturmak.",
    architecture: [
      {
        title: "Search state",
        description:
          "Arama ve filtre tercihlerinin URL ile temsil edilerek sonuçların paylaşılabilir ve geri dönülebilir tutulması.",
      },
      {
        title: "Listing detail",
        description:
          "İlan bilgilerinin mobil uyumlu detay sayfalarında açık bir içerik hiyerarşisiyle sunulması.",
      },
      {
        title: "Manageable inventory",
        description: "İlanların yönetilebilir bir sistem üzerinden güncel tutulması.",
      },
    ],
    features: [
      "Gelişmiş arama ve filtreleme",
      "URL tabanlı filtre sistemi",
      "İlan detay sayfaları",
      "Mobil uyumlu kullanım",
      "SEO ve performans odaklı yapı",
      "Yönetilebilir ilan sistemi",
    ],
    outcome: null,
    links: {
      demo: null,
      github: null,
    },
    visual: {
      tone: "stone",
      label: "Search / URL / Listings",
    },
    gallery: [],
    contentTodos: [
      { field: "role", note: "Projede üstlenilen rolü doğrula." },
      { field: "period", note: "Proje tarihini doğrula." },
      { field: "technologies", note: "Kesin teknoloji setini ekle." },
      { field: "links", note: "Canlı site veya repository bağlantısını doğrula." },
      { field: "gallery", note: "Gerçek liste ve detay ekranlarını ekle." },
      { field: "outcome", note: "Doğrulanabilir performans veya ürün sonucunu ekle." },
    ],
  },
  {
    slug: "fitness-panel",
    index: "05",
    title: "Fitness Paneli",
    category: "Tracking dashboard",
    summary:
      "Kullanıcıların antrenman ve fitness süreçlerini düzenli bir web arayüzü üzerinden takip etmesi için geliştirilen panel.",
    problem: null,
    approach: null,
    role: null,
    period: null,
    year: null,
    technologies: [],
    technicalFocus: null,
    architecture: [],
    features: [],
    outcome: null,
    links: {
      demo: null,
      github: null,
    },
    visual: {
      tone: "sand",
      label: "Training / Progress / Routine",
    },
    gallery: [],
    contentTodos: [
      { field: "role", note: "Projede üstlenilen rolü doğrula." },
      { field: "problem", note: "Çözülen problemi doğrulanmış içerikle ekle." },
      { field: "approach", note: "Yaklaşım ve kullanıcı akışını doğrulanmış içerikle ekle." },
      { field: "technicalFocus", note: "Teknik odağı doğrulanmış içerikle ekle." },
      { field: "period", note: "Proje tarihini doğrula." },
      { field: "technologies", note: "Kesin teknoloji setini ekle." },
      { field: "architecture", note: "Doğrulanmış teknik mimari notlarını ekle." },
      { field: "features", note: "Doğrulanmış özellik listesini ekle." },
      { field: "links", note: "Demo veya repository bağlantısını doğrula." },
      { field: "gallery", note: "Gerçek panel ekranlarını ekle." },
      { field: "outcome", note: "Doğrulanabilir ürün sonucunu ekle." },
    ],
  },
] as const satisfies readonly PortfolioProject[];

export type ProjectSlug = (typeof projects)[number]["slug"];

export const projectBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
) as Readonly<Record<ProjectSlug, (typeof projects)[number]>>;

export const stackGroups = [
  {
    id: "frontend",
    title: "Frontend",
    description:
      "Ürün akışlarını erişilebilir, hızlı ve farklı ekranlarda doğal çalışan arayüzlere dönüştürüyorum.",
    technologies: ["React.js", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS"],
  },
  {
    id: "backend",
    title: "Backend",
    description:
      "API geliştirme, iş kuralları, arka plan işleri ve gerçek dünya süreçlerinin modellenmesine odaklanıyorum.",
    technologies: ["Node.js", "Express.js", ".NET 8 Web API", "Redis", "BullMQ"],
  },
  {
    id: "databases",
    title: "Databases",
    description:
      "İlişkisel ve doküman tabanlı veriyi sorgu ihtiyaçları, tutarlılık ve sürdürülebilir şema yapısıyla ele alıyorum.",
    technologies: ["PostgreSQL", "MSSQL", "MongoDB", "Supabase", "Drizzle ORM"],
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    description:
      "Uygulamayı geliştirme ortamından canlıya taşıyan container, proxy ve deployment katmanlarını kuruyorum.",
    technologies: ["Docker", "Nginx"],
  },
  {
    id: "native-game",
    title: "Native & Game Development",
    description:
      "Web dışındaki ürün fikirlerini native macOS arayüzleri ve oyun prototipleri üzerinden araştırıyorum.",
    technologies: ["SwiftUI", "Unity"],
  },
  {
    id: "tools",
    title: "Tools",
    description:
      "Kod geçmişini, ekip içi akışı ve farklı geliştirme ihtiyaçlarını izlenebilir tutan araçları kullanıyorum.",
    technologies: ["Git", "GitHub", "Python (temel)"],
  },
] as const satisfies readonly StackGroup[];

export const experiences = [
  {
    company: "Ziraat Teknoloji",
    role: "Stajyer Yazılım Geliştirici",
    period: "Eylül 2024 — Ocak 2025",
    description: null,
    contentTodos: [
      {
        field: "description",
        note: "Üstlenilen görevleri ve kullanılan teknolojileri doğrulanmış bilgilerle ekle.",
      },
    ],
  },
  {
    company: "Belsis Yazılım",
    role: "Stajyer Yazılım Geliştirici",
    period: "Temmuz 2022 — Eylül 2022",
    description: null,
    contentTodos: [
      {
        field: "description",
        note: "Üstlenilen görevleri ve kullanılan teknolojileri doğrulanmış bilgilerle ekle.",
      },
    ],
  },
] as const satisfies readonly Experience[];

export const education = [
  {
    institution: "Amasya Üniversitesi",
    degree: "Bilgisayar Mühendisliği",
    graduation: "Ocak 2025",
    gpa: "3.08 / 4.00",
  },
] as const satisfies readonly Education[];

export const processSteps = [
  {
    index: "01",
    title: "Problemi anlama",
    description: "İş sürecini, kullanıcıları ve ürünün gerçekten çözmesi gereken noktayı netleştiririm.",
  },
  {
    index: "02",
    title: "Sistem kurgusu",
    description: "Ürün akışını, veri modelini ve sistem sınırlarını geliştirmeye başlamadan önce kurarım.",
  },
  {
    index: "03",
    title: "Arayüz ve akış",
    description: "Karmaşık süreçleri kullanıcı için açık, erişilebilir ve tutarlı etkileşimlere dönüştürürüm.",
  },
  {
    index: "04",
    title: "Backend ve veri",
    description: "İş kurallarını API, veritabanı ve gereken arka plan süreçleriyle güvenilir hâle getiririm.",
  },
  {
    index: "05",
    title: "Kalite katmanı",
    description: "Test, güvenlik ve performansı son kontrol değil geliştirme sürecinin bir parçası olarak ele alırım.",
  },
  {
    index: "06",
    title: "Canlı ortam",
    description: "Container, proxy ve deployment yapılarını kurar; ürünün canlıdaki davranışını takip ederim.",
  },
] as const satisfies readonly ProcessStep[];

export const nowItems = [
  {
    title: "Native macOS araçları",
    description: "Masaüstündeki günlük işleri daha kısa akışlara dönüştüren küçük, odaklı ürünler.",
  },
  {
    title: "İşletme yönetim panelleri",
    description: "Gerçek operasyonları rol, veri ve görev akışlarıyla bir araya getiren sistemler.",
  },
  {
    title: "Ölçeklenebilir backend mimarileri",
    description: "API, queue, cache ve veri katmanlarının birlikte güvenilir çalıştığı yapılar.",
  },
  {
    title: "Ürünleştirme ve deployment",
    description: "Fikirden çalışan ürüne ve canlı ortam takibine uzanan uçtan uca geliştirme süreci.",
  },
] as const satisfies readonly NowItem[];
