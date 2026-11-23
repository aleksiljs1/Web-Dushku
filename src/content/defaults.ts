// The page as written. The admin panel can override any of this; with nothing
// stored, the site renders exactly these words and pictures.
// In headlines, *words between asterisks* are set in italic colour.

export const defaults = {
  brand: {
    // Spelled as on TikTok (@mobilieri.dushku); editable in /admin.
    name: "Mobilieri Dushku",
    tagline: "Mobilojmë sipas dëshirës dhe ëndrrave tuaja.",
    description:
      "Mobilieri Dushku: mobilje me porosi, të projektuara në 3D me masat tuaja, të prodhuara në punishte dhe të montuara me kujdes. Kuzhina, dollape, arredime.",
    services: "Dizenjim • Prodhim • Montim",
    categories: "Kuzhina • Dollape • Arredime",
  },

  contact: {
    phoneDisplay: "067 549 3154",
    phone: "+355675493154",
    whatsapp: "355675493154",
    location: "Shqipëri",
    tiktok: "https://www.tiktok.com/@mobilieri.dushku",
    instagram: "",
    facebook: "",
  },

  nav: {
    services: "Shërbimet",
    work: "Punimet",
    assembly: "Montimi",
    process: "Si punojmë",
    materials: "Materialet",
    contact: "Kontakt",
  },

  ui: {
    callShort: "Telefononi",
    callLong: "Na telefononi",
    whatsapp: "WhatsApp",
    menu: "Menu",
  },

  hero: {
    badge: "Dizenjim · Prodhim · Montim",
    headline: "Mobilojmë sipas *dëshirës* dhe *ëndrrave* tuaja.",
    text: "Ju na sillni idenë, ne e projektojmë në 3D me masat e sakta, e prodhojmë në punishte dhe e montojmë në shtëpinë apo biznesin tuaj, deri te vida e fundit.",
    ctaPrimary: "Kërkoni një ofertë",
    ctaCall: "Telefononi tani",
    measureNote: "çdo mobilje, me masat e hapësirës suaj",
  },

  marquee: {
    words: ["Kuzhina", "Dollape", "Arredime", "Garderoba", "Dhoma gjumi", "Sallone", "Librari", "Montim mobiljesh"],
  },

  services: {
    eyebrow: "Shërbimet",
    title: "Dy shërbime, i njëjti kujdes për çdo detaj.",
    intro: "Nga ideja e parë deri te vida e fundit, punojmë me ju hap pas hapi.",
    custom: {
      title: "Mobilim me porosi",
      kicker: "Dizenjim • Prodhim • Montim",
      text: "Ju na tregoni si e ëndërroni. Ne e projektojmë në 3D, e masim dhe e prodhojmë sipas hapësirës suaj. Asgjë e gatshme: gjithçka e menduar për ju.",
      chips: ["Kuzhina", "Dollape & garderoba", "Arredime", "Dhoma gjumi", "Sallone & librari", "Zyra & dyqane"],
      link: "Na tregoni idenë tuaj",
    },
    assembly: {
      title: "Montim mobiljesh",
      kicker: "Shpejt · Pastër · Me garanci",
      text: "Keni blerë mobilje, por s'keni kohë apo vegla? I montojmë shpejt, pastër dhe me kujdes, që gjithçka të qëndrojë drejt për vite me radhë.",
      chips: ["Mobilje të blera gati", "Kuzhina & garderoba", "Çmontim dhe rimontim", "Rregullim dyersh e sirtarësh"],
      link: "Shihni si punojmë",
    },
  },

  work: {
    eyebrow: "Punimet tona",
    title: "Jo vizatime: punë e vërtetë, *e montuar nga ne.*",
    intro: "Disa nga punimet tona, të fotografuara në vend. Kuzhina, dollape, arredime: secila e projektuar dhe e prodhuar për një hapësirë të vetme.",
    note: "Çdo punim projektohet në 3D, prodhohet në punishten tonë dhe montohet nga ekipi ynë.",
    tiktokCta: "Më shumë punime në TikTok",
    items: [
      {
        id: "mur-librarie",
        type: "image" as const,
        src: "/media/punim-mur-librarie.jpg",
        poster: "",
        caption: "Mur librarie në arrë, me kënd për TV dhe mbulesa radiatori. Ditën e montimit.",
        alt: "Mur i plotë me rafte librash në dru arre, me hapësirë për televizorin në mes, dollape poshtë dhe mbulesa radiatori me shirita druri, i sapomontuar",
        visible: true,
      },
      {
        id: "kuzhina-video",
        type: "video" as const,
        src: "/media/video-kuzhina-garderoba.mp4",
        poster: "/media/frame-kuzhina.jpg",
        caption: "Kuzhinë me kolonë furre dhe rafte të hapura, pastaj një garderobë.",
        alt: "Video: kuzhinë me porosi në ngjyrë të kuqe koral, me dollape të larta, furrë të integruar dhe rafte të hapura, pastaj montimi i një garderobe",
        visible: true,
      },
      {
        id: "ambiente-sallon",
        type: "image" as const,
        src: "/media/sallon-tavoline.jpg",
        poster: "",
        caption: "Ambiente: sallon dhe tavolinë ngrënieje.",
        alt: "Ambient sallon me divan bezhë, tavolinë ngrënieje me karrige të veshura dhe komo druri me shirita",
        visible: true,
      },
    ],
  },

  assembly: {
    eyebrow: "Montimi, pjesë pas pjese",
    title: "Nga kutia te mobilja, *pa asnjë shqetësim.*",
    steps: [
      { title: "Pjesët mbërrijnë", text: "Çdo pjesë kontrollohet dhe renditet para se të nisim." },
      { title: "Struktura", text: "Anët, kapaku dhe fundi, në vijë të drejtë dhe në nivel." },
      { title: "Raftet dhe këmbët", text: "Gjithçka e shtrënguar mirë, që të mbajë peshë për vite." },
      { title: "Dyert", text: "Të rregulluara që të mbyllen butë, drejt dhe pa zhurmë." },
      { title: "Gati!", text: "Pastrojmë vendin dhe jua lëmë gati për t’u përdorur." },
    ],
  },

  process: {
    eyebrow: "Si punojmë",
    title: "Nga ideja te shtëpia juaj, në katër hapa.",
    intro: "Ide, projekt 3D, prodhim, montim. Një person kontakti nga fillimi deri në fund: gjithmonë e dini ku jemi dhe çfarë vjen më pas.",
    steps: [
      {
        title: "Ju na sillni idenë",
        text: "Një telefonatë, një mesazh ose thjesht një foto. Edhe një screenshot nga Pinterest apo Instagram mjafton: na tregoni çfarë ju pëlqen.",
        media: {
          type: "image" as const,
          frame: "chat" as const,
          src: "/media/ide-pinterest-raft.jpg",
          poster: "",
          alt: "Screenshot nga Pinterest i një rafti librash prej druri me forma të valëzuara, dërguar si ide",
          caption: "Përshëndetje! E pashë këtë në Pinterest. A mund ta bëni për sallonin tim?",
          reply: "Sigurisht! Vijmë e masim dhe ju dërgojmë projektin 3D.",
        },
      },
      {
        title: "Projekt 3D me masa të sakta",
        text: "Masim hapësirën dhe e projektojmë mobiljen në 3D, me çdo centimetër të shënuar. E shihni si do të duket para se të presim qoftë edhe një dërrasë.",
        media: {
          type: "video" as const,
          frame: "phone" as const,
          src: "/media/video-projekt-3d.mp4",
          poster: "/media/frame-projekt-3d.jpg",
          alt: "Video: projekt 3D i një dhome me masat e shënuara, para prodhimit",
          caption: "Një projekt i vërtetë 3D, me masat e dhomës.",
          reply: "",
        },
      },
      {
        title: "Prodhim në punishte",
        text: "E prodhojmë në punishten tonë me materialet, ngjyrat dhe dorezat që zgjidhni bashkë me ne.",
        media: { type: "image" as const, frame: "plain" as const, src: "", poster: "", alt: "", caption: "", reply: "" },
      },
      {
        title: "Montim dhe dorëzim",
        text: "E sjellim, e montojmë dhe e lëmë vendin të pastër. Ju vetëm e gëzoni.",
        media: { type: "image" as const, frame: "plain" as const, src: "", poster: "", alt: "", caption: "", reply: "" },
      },
    ],
  },

  materials: {
    eyebrow: "Materialet",
    title: "Zgjidhni ngjyrën. Ne kujdesemi për pjesën tjetër.",
    text: "Provojeni vetë: prekni një ngjyrë dhe shihni si ndryshon komoja. Këto janë vetëm disa shembuj. Bashkë zgjedhim materialin, ngjyrën dhe dorezat që ju pëlqejnë.",
    finishes: [
      { name: "Arrë", note: "E ngrohtë dhe e thellë" },
      { name: "Lis", note: "Natyrale, me fije të dukshme" },
      { name: "Ah", note: "E çelur dhe e qetë" },
      { name: "E bardhë mat", note: "E pastër, moderne" },
      { name: "Antracit", note: "Elegante dhe e fortë" },
      { name: "Gjelbër ulliri", note: "Për pak guxim" },
    ],
  },

  why: {
    eyebrow: "Pse ne",
    title: "Mobilje që ndihen *si në shtëpi* që ditën e parë.",
    reasons: [
      { title: "Me masë, deri në milimetër", text: "Çdo mobilje projektohet në 3D për hapësirën tuaj, që të shfrytëzohet çdo cep." },
      { title: "Ju vendosni çdo detaj", text: "Forma, ngjyra, materiali, dorezat. Mobilja është juaja, ashtu siç e keni ëndërruar." },
      { title: "Montim i pastër", text: "Punojmë me kujdes në shtëpinë tuaj dhe largohemi duke e lënë gjithçka në rregull." },
      { title: "Fjala jonë mbahet", text: "Çmimi dhe afati bisedohen që në fillim, pa surpriza në fund." },
    ],
  },

  contactSection: {
    eyebrow: "Kontakt",
    title: "Le ta bëjmë realitet.",
    text: "Na dërgoni idenë tuaj, edhe një foto mjafton. Ju përgjigjemi me pyetjet e duhura dhe një ofertë të qartë.",
    phoneLabel: "Telefon",
    whatsappLabel: "WhatsApp",
    whatsappCta: "Na shkruani",
    tiktokLabel: "Na ndiqni në TikTok",
    formTitle: "Dërgoni një mesazh",
    formHint: "Hapet në WhatsApp me mesazhin gati. Ju vetëm shtypni “Dërgo”.",
    nameLabel: "Emri juaj",
    namePlaceholder: "p.sh. Arben",
    nameError: "Ju lutem shkruani emrin tuaj.",
    needLabel: "Çfarë ju duhet?",
    needs: ["Mobilim me porosi", "Montim mobiljesh", "Diçka tjetër"],
    messageLabel: "Mesazhi",
    messageOptional: "(opsional)",
    messagePlaceholder: "p.sh. Një garderobë 2.4 m për dhomën e gjumit, me dyer rrëshqitëse.",
    submit: "Vazhdoni në WhatsApp",
    callPrompt: "Preferoni të flisni?",
    callLink: "Na telefononi",
  },

  footer: {
    pageLabel: "Faqja",
    contactLabel: "Kontakt",
    followLabel: "Na ndiqni",
    backToTop: "Lart ↑",
  },
};
