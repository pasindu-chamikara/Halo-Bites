// Halo Bites Central Catalog
// Central single source of truth for products and categories.
// Synchronized seamlessly across both the client storefront and the admin dashboard.

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  image: string;
  status?: 'Active' | 'Draft';
  count?: number;
}

export interface ProductItem {
  id: number | string;
  name: string;
  category: string;
  price: number | string; // e.g. 35.00 or "Rs. 35.00"
  stock?: number;
  status?: 'Active' | 'Draft' | 'Low Stock' | 'Out of Stock';
  rating?: number;
  reviews?: number;
  image: string;
  description?: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: "CAT-1",
    name: "Signature Cakes",
    description: "Handcrafted artisan celebration cakes made with premium chocolate, fresh berries, and velvet cream.",
    image: "/hero1.png",
    status: "Active",
    count: 12
  },
  {
    id: "CAT-2",
    name: "Donuts",
    description: "Fluffy, golden glazed artisan donuts packed with gourmet fillings and decadent toppings.",
    image: "/hero2.png",
    status: "Active",
    count: 24
  },
  {
    id: "CAT-3",
    name: "Macarons",
    description: "Delicate Parisian macarons baked fresh with rich ganache, fruit compote, and pistachio cream.",
    image: "/hero3.png",
    status: "Active",
    count: 8
  },
  {
    id: "CAT-4",
    name: "Pastries",
    description: "Crispy layered croissants and savory flaky bites baked fresh every single morning.",
    image: "/hero4.png",
    status: "Active",
    count: 15
  },
  {
    id: "CAT-5",
    name: "Birthday Gifts",
    description: "Celebration surprise explosion boxes and festive confections guaranteed to delight.",
    image: "/hero2.png",
    status: "Active",
    count: 18
  },
  {
    id: "CAT-6",
    name: "Love Gifts",
    description: "Romantic gourmet gift sets, velvety chocolate bites, and delicate red berry surprises.",
    image: "/hero1.png",
    status: "Active",
    count: 14
  },
  {
    id: "CAT-7",
    name: "Congrats Gifts",
    description: "Golden milestone boxes and celebration treats curated for special achievements.",
    image: "/hero5.png",
    status: "Active",
    count: 10
  },
  {
    id: "CAT-8",
    name: "Mother's Day",
    description: "Heartfelt luxury dessert packages and floral-infused confections crafted with love.",
    image: "/hero6.png",
    status: "Active",
    count: 9
  }
];

export const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    name: "Strawberry Dream Box",
    price: 35.00,
    category: "Love Gifts",
    stock: 45,
    status: "Active",
    rating: 4.9,
    reviews: 128,
    image: "/hero1.png",
    description: "Velvety fresh strawberry cake bites covered in white chocolate ganache and strawberry dust."
  },
  {
    id: 2,
    name: "Classic Chocolate Explosion",
    price: 40.00,
    category: "Birthday Gifts",
    stock: 12,
    status: "Active",
    rating: 5.0,
    reviews: 245,
    image: "/hero2.png",
    description: "Triple-layer dark Belgian chocolate fudge bites that erupt with rich molten chocolate cream."
  },
  {
    id: 3,
    name: "Vanilla Funfetti Surprise",
    price: 32.00,
    category: "Birthday Gifts",
    stock: 89,
    status: "Active",
    rating: 4.8,
    reviews: 89,
    image: "/hero3.png",
    description: "Fluffy vanilla sponge bites infused with vibrant rainbow sprinkles and Madagascar vanilla bean frosting."
  },
  {
    id: 4,
    name: "Red Velvet Romance",
    price: 45.00,
    category: "Love Gifts",
    stock: 25,
    status: "Active",
    rating: 4.9,
    reviews: 156,
    image: "/hero4.png",
    description: "Traditional Southern red velvet cake bites layered with tangy cream cheese glaze."
  },
  {
    id: 5,
    name: "Golden Congrats Box",
    price: 38.00,
    category: "Congrats Gifts",
    stock: 30,
    status: "Active",
    rating: 4.7,
    reviews: 72,
    image: "/hero5.png",
    description: "Premium gold-dusted chocolate macarons and honey honeycomb celebration confection."
  },
  {
    id: 6,
    name: "Mother's Day Special",
    price: 50.00,
    category: "Mother's Day",
    stock: 15,
    status: "Active",
    rating: 5.0,
    reviews: 310,
    image: "/hero6.png",
    description: "Artisan floral rosewater sponge cake bites decorated with candied edible petals and raspberry cream."
  },
  {
    id: 7,
    name: "Matcha Magic",
    price: 36.00,
    category: "Congrats Gifts",
    stock: 22,
    status: "Active",
    rating: 4.6,
    reviews: 45,
    image: "/hero7.png",
    description: "Japanese ceremonial Uji matcha layered green tea sponge bites with white chocolate ganache."
  }
];
