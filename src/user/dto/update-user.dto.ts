export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  photo?: string;
  phone?: string;
  acceptingOrders?: boolean;
  address?: string;
  city?: string;
  geoLat?: string;
  geoLon?: string;
  roles?: string[];
  status?: string;
  shops?: string[];
  favorites?: string[];
  feedbacks?: string[];
  refreshToken?: string;
  resetToken?: string;
  confirmToken?: string;
}
