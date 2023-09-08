export class RegisterAuthDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmToken?: string;
}
