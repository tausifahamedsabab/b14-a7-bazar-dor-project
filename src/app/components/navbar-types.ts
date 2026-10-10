export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export type Product = {
  id: number | string;
  nameBn: string;
  category?: string;
  categoryIcon?: string;
  unit?: string;
  today?: number | string;
  change?: {
    dir?: string;
    pct?: number | string;
  };
};
