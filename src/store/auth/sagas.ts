import { call, put, takeLatest } from "redux-saga/effects";

import {AuthService, UserProfile} from "../../utility/AuthService";

import { AuthUser, AuthActions } from "./_types";
import * as Actions from "./actions";

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

function* handleLogin() {
  try {
    yield AuthService.login();
  } catch (err) {
    if (err instanceof Error) {
      yield put(Actions.authError(err.stack!));
    } else {
      yield put(Actions.authError("An unknown error occured."));
    }
  }
}

function* handleRefreshSession() {
  try {
    const res = yield call(AuthService.getUserData);
    if(!res) {
      return;
    } else if (!res.error) {
      const profile = res as UserProfile;
      const user = MapProfileToUser(profile);
      yield put(Actions.setUser(user));
    } else {
      yield put(Actions.authError(res.error));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(Actions.authError(err.stack!));
    } else {
      yield put(Actions.authError("An unknown error occured."));
    }
  }
}

function* handleAuthentication() {
  try {
    const res = yield call(AuthService.handleAuthentication);

    if (!res.error) {
      const profile = res as UserProfile;
      const user = MapProfileToUser(profile);
      yield put(Actions.setUser(user));
    } else {
      yield put(Actions.authError(res.error));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(Actions.authError(err.stack!));
    } else {
      yield put(Actions.authError("An unknown error occured."));
    }
  }
}
function MapProfileToUser(profile: UserProfile) : AuthUser {
  let roles: string[] = [];
  if(profile.app_metadata) {
    const r = profile.app_metadata.roles || [];
    const t = profile.app_metadata.authorization.roles || [];
    roles = [...r, ...t];
  }
  const isAdmin = roles.indexOf("Admin") !== -1;

  const user: AuthUser = {
    isAuthenticated: true,
    userId: profile.sub,
    firstName: profile.given_name,
    lastName: profile.family_name,
    email: profile.email,
    accessToken: profile.accessToken,
    expiresAt: profile.expiresAt,
    roles,
    isAdmin
  };

  return user;
}

function* handleLogOut() {
  try {
    AuthService.logout();
    yield put(Actions.setUser({...anonymousUser}));
  } catch (err) {
    if (err instanceof Error) {
      yield put(Actions.authError(err.stack!));
    } else {
      yield put(Actions.authError("An unknown error occured."));
    }
  }
}

export const sagas = [
  takeLatest(AuthActions.REFRESH_SESSION, handleRefreshSession),
  takeLatest(AuthActions.LOGIN_USER, handleLogin),
  takeLatest(AuthActions.AUTHENTICATE_USER, handleAuthentication),
  takeLatest(AuthActions.LOGOUT_USER, handleLogOut)
];
