export class CreateUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  phone?: string;
  status?: string;
  confirmToken?: string;
}
