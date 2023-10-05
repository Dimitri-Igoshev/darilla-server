export class CreateCategoryDto {
  title: string;
  slug: string;
  imageUrl?: string;
  parent?: string;
  children?: string[];
}
