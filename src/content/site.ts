// Business details shown across the page. Replace the placeholders marked TODO
// with the client's real details before going live.

export const site = {
  name: "Mobileri Dushku",
  tagline: "Mobilojmë sipas dëshirës dhe ëndrrave tuaja.",
  description:
    "Mobileri Dushku: mobilje me porosi të projektuara dhe të prodhuara me masë, si dhe montim i kujdesshëm i mobiljeve.",

  // TODO: real phone number, shown as written and dialled as the digits in `phone`
  phoneDisplay: "+355 6X XXX XXXX",
  phone: "+355000000000",
  // TODO: WhatsApp number in international format, digits only
  whatsapp: "355000000000",
  // TODO: city / area they serve
  location: "Shqipëri",
};

export const telHref = `tel:${site.phone}`;

export function whatsappHref(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const nav = [
  { href: "#sherbimet", label: "Shërbimet" },
  { href: "#montimi", label: "Montimi" },
  { href: "#procesi", label: "Si punojmë" },
  { href: "#materialet", label: "Materialet" },
  { href: "#kontakt", label: "Kontakt" },
];
