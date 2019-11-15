import * as auth0 from "auth0-js";
import jwtDecode from "jwt-decode";

export interface UserProfile extends auth0.Auth0UserProfile {
  app_metadata?: AppMetaData,
  accessToken: string,
  expiresAt: string
}
interface AppMetaData {
  authorization: {
    groups?: string[],
    permissions?: string[],
    roles?: string[]
  },
  roles?: string[]
}

enum LocalStoreKeys {
  AccessToken = "access_token",
  IdToken = "id_token",
  ExpiresAt = "expires_at"
}

const AUTH_DOMAIN = process.env.REACT_APP_AUTH_DOMAIN || "";
const AUTH_CLIENTID = process.env.REACT_APP_AUTH_CLIENTID || "";
const AUTH_REDIRECT = process.env.REACT_APP_AUTH_REDIRECT || "";
const AUTH_AUDIENCE = process.env.REACT_APP_AUTH_AUDIENCE || "";

const settings = {
  domain: AUTH_DOMAIN,
  clientID: AUTH_CLIENTID,
  redirectUri: AUTH_REDIRECT,
  audience: AUTH_AUDIENCE,
  responseType: "token id_token",
  scope: "openid profile email app_metadata"
};

class AuthService {
  auth0: auth0.WebAuth;

  constructor() {
    this.auth0 = new auth0.WebAuth({ ...settings });
  }

  public isAuthenticated = () : boolean => {
    // Check whether the current time is past the access token's expire time

    const expireTime = localStorage.getItem(LocalStoreKeys.ExpiresAt);
    if(!expireTime) return false;

    const now = new Date().getTime();
    const expiresAt = JSON.parse(expireTime);

    return now < expiresAt;
  }

  public handleAuthentication = () : Promise<UserProfile | null> => {
    const me = this;

    return new Promise((resolve, reject) => {
      me.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);

        if (authResult && authResult.accessToken && authResult.idToken) {
          me.setSession(authResult);
        }

        me.getUserData()
          .then(user => resolve(user));
      });
    });
  }
  private setSession = (authResult: auth0.Auth0DecodedHash) : void => {
    const now = new Date().getTime();
    const expiresIn = (authResult.expiresIn || 0) * 1000;
    const expiresAt = JSON.stringify(now + expiresIn);

    const accessToken = authResult.accessToken || "";
    const idToken = authResult.idToken || "";

    localStorage.setItem(LocalStoreKeys.AccessToken, accessToken);
    localStorage.setItem(LocalStoreKeys.IdToken, idToken);
    localStorage.setItem(LocalStoreKeys.ExpiresAt, expiresAt);
  }

  public getUserData = async () : Promise<UserProfile | null> => {
    try {
      if(!this.isAuthenticated()) {
        return null;
      }

      const idToken = localStorage.getItem(LocalStoreKeys.IdToken);
      const accessToken = localStorage.getItem(LocalStoreKeys.AccessToken);
      const expiresAt = localStorage.getItem(LocalStoreKeys.ExpiresAt);

      if (!idToken || !accessToken || !expiresAt) {
        throw new Error("session information missing!");
      }

      const identity = jwtDecode<auth0.Auth0UserProfile>(idToken);
      const userProfile = {...identity, accessToken, expiresAt } as UserProfile;

      return userProfile;

    } catch (err) {
      return err;
    }
  }

  public login = () : void => {
    this.auth0.authorize();
  }
  public logout = () : void => {
    localStorage.removeItem(LocalStoreKeys.AccessToken);
    localStorage.removeItem(LocalStoreKeys.IdToken);
    localStorage.removeItem(LocalStoreKeys.ExpiresAt);
  }
}

const instance = new AuthService();
export {
  instance as AuthService
};
