export const initialCategories = [
  'Electronics',
  'Fashion',
  'Smartphones',
  'Computers',
  'Outfits',
  'Accessories',
  'Suits',
];

const categoryAttributes = {
  Smartphones: {
    ram: 'ram',
    rom: 'rom',
    camera: 'camera',
    battery: 'battery',
    condition: { options: ['New', 'Used'] },
    charging_port_type: 'charging_port_type',
    display_size: 'display_size',
    display_type: 'display_type',
    fingerprint_available: 'fringerprint_available',
    fingerprint_location: ['in_display', 'back', 'side'],
  },
  Computers: { type: {}, rom: {}, ram: {}, storage_type: {} },
};

export const newCategoriesFormat = initialCategories.map(
  (category_name: string) => {
    return {
      title: category_name,
    };
  },
);
