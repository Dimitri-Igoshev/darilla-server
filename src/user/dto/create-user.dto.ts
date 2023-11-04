export class CreateUserDto {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  photo?: string;
  phone?: string;
  acceptingOrders?: string;
  address?: string;
  city?: string;
  geoLat?: string;
  geoLon?: string;
  status?: string;
  confirmToken?: string;
}
