export class CreateCategoryDto {
  title: string;
  imageUrl?: string;
  slug: string;
  parent?: string;
  children?: string[];
}
