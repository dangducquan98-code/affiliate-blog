export const PRODUCT_CATEGORIES = [
  { value: 'mic', label: 'Mic' },
  { value: 'den', label: 'Đèn' },
  { value: 'gimbal-tripod', label: 'Gimbal / Tripod' },
  { value: 'phu-kien-quay', label: 'Phụ kiện quay' },
  { value: 'sac-cap', label: 'Sạc / Cáp' },
  { value: 'hub', label: 'Hub' },
  { value: 'audio', label: 'Audio' },
  { value: 'phu-kien', label: 'Phụ kiện' },
  { value: 'khac', label: 'Khác' },
] as const;

export function productCategoryOptions(): { value: string; label: string }[] {
  return PRODUCT_CATEGORIES.map((c) => ({ value: c.value, label: c.label }));
}
