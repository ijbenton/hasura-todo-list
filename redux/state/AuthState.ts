export interface AuthState {
  user?: {
    email: string;
    id: string;
    displayName: string;
    accessToken: string;
  };
}
