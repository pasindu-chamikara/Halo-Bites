"use client";

import ProductCard, {
  ProductCard as ItemCardComponent,
  ProductItem,
  ProductCardProps
} from './ProductCard';

export type ItemCardProps = ProductCardProps;
export { type ProductItem, type ProductCardProps, ProductCard };
export const ItemCard = ItemCardComponent;
export default ItemCardComponent;

