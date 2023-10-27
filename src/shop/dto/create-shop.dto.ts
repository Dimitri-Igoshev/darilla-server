export class CreateShopDto {
  title: string;
  address: string;
  city?: string;
  geoLat?: string;
  geoLon?: string;
  website?: string;
  description?: string;
  owner: string;
  contract: string;
}
