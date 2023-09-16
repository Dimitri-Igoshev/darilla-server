export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  photo?: string;
  phone?: string;
  roles?: string[];
  status?: string;
  shops?: string[];
  refreshToken?: string;
  resetToken?: string;
  confirmToken?: string;
}
