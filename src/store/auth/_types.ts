
export interface AuthUser {
  isAuthenticated: boolean,
  userId: string | undefined,
  firstName: string | undefined,
  lastName: string | undefined,
  email: string | undefined,
  accessToken: string | undefined,
  expiresAt: string | undefined,
  roles: string[] | undefined,
  isAdmin: boolean
}

export enum AuthActions {
  INITIALIZE_USER = "@@user/INITIALIZE_USER",
  LOGIN_USER = "@@user/LOGIN_USER",
  LOGOUT_USER = "@@user/LOGOUT_USER",
  AUTHENTICATE_USER = "@@user/AUTHENTICATE_USER",

  REFRESH_SESSION = "@@user/REFRESH_SESSION",
  SET_USER = "@@user/SET_USER",
  AUTH_ERROR = "@@user/AUTH_ERROR"
}

export interface AuthState {
  readonly initialized: boolean,
  readonly user: AuthUser,
  readonly errors?: string
}
