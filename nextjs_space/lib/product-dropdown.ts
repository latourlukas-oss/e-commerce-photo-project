/**
 * Product dropdown menu items (left sidebar).
 * Add new products here; they appear in the dropdown and link to their page.
 */
import { LucideIcon, Package, Box, Key, Magnet, Image as ImageIcon, Layers } from 'lucide-react';

export type ProductItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const PRODUCT_DROPDOWN_ITEMS: ProductItem[] = [
  { name: 'Photo Cube', href: '/photo-cube', icon: Box },
  { name: 'Transparent Prints', href: '/transparent-prints', icon: Layers },
  { name: 'Keychain', href: '/keychain', icon: Key },
  { name: 'Fridge Magnet', href: '/fridge-magnet', icon: Magnet },
  { name: 'Canvas Print', href: '/canvas-print', icon: ImageIcon },
  { name: 'All Products', href: '/products', icon: Package },
];
