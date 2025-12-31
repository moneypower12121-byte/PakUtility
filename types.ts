
export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface TaxSlab {
  min: number;
  max: number | null;
  baseTax: number;
  percentage: number;
}
