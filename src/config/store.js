export const store = {
  name: 'Vip Phones',
  instagram: 'https://www.instagram.com/vipphonescg_/',
  whatsapp: '5583996652577',
  city: 'Campina Grande',
  state: 'PB',
  address: null,
  hours: null,
}

export function whatsappUrl(message) {
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`
}
