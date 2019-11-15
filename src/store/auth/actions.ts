import { action } from "typesafe-actions";

import { AuthUser, AuthActions } from "./_types";

export const refreshSession = () => action(AuthActions.REFRESH_SESSION);
export const loginUser = () => action(AuthActions.LOGIN_USER);
export const authenticateUser = () => action(AuthActions.AUTHENTICATE_USER);
export const logOutUser = () => action(AuthActions.LOGOUT_USER);

export const setUser = (user: AuthUser) => action(AuthActions.SET_USER, user);
export const authError = (message: string) => action(AuthActions.AUTH_ERROR, message);
