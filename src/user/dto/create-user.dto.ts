import { Prop } from "@nestjs/mongoose";

export class CreateUserDto {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  photo?: string;
  phone?: string;
  address?: string;
  city?: string;
  geoLat?: string;
  geoLon?: string;
  status?: string;
  confirmToken?: string;
}
