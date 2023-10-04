export class CreateCategoryDto {
  title: string;
  imageUrl?: string;
  parent?: string;
  children?: string[];
}
