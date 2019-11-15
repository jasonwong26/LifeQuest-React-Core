import { Reducer } from "redux";
import { AuthUser, AuthActions, AuthState } from "./_types";

const anonymousUser: AuthUser = {
  userId: undefined,
  isAuthenticated: false,
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  accessToken: undefined,
  expiresAt: undefined,
  roles: undefined,
  isAdmin: false
};
const initialState: AuthState = {
  initialized: false,
  user: anonymousUser,
  errors: undefined
};

export const reducer: Reducer<AuthState> = (state = initialState, action) => {
  switch (action.type) {
    case AuthActions.REFRESH_SESSION: {
      return { ...state, initialized: true };
    }

    case AuthActions.SET_USER: {
      return { ...state, user: action.payload, errors: undefined };
    }

    case AuthActions.AUTH_ERROR: {
      return { ...state, errors: action.payload };
    }

    default: {
      return state;
    }
  }
};
