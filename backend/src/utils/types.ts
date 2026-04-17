export interface LoginDTO {
  email: string;
  password: Buffer | string; // Type-safe for common auth scenarios
}
