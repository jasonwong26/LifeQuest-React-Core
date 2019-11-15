import * as React from "react";
import { Route, RouteProps } from "react-router-dom";

import * as Store from "../../store/auth";
import { NotAuthorizedPage } from "../../pages/errors";

interface PropsFromState {
  user: Store.AuthUser,
  errors?: string
}
interface PropsFromDispatch {
  refreshSession: typeof Store.refreshSession,
  authenticateUser: typeof Store.authenticateUser
}
interface PropsFromParent {
  authorizedRoles?: string | string[],
}

type AllProps = PropsFromState &
                PropsFromDispatch &
                PropsFromParent &
                RouteProps;

const hasAuthorizedRole = (pageRoles?: string[], userRoles?: string[]) : boolean => {
  const pr = pageRoles || [];
  const ur = userRoles || [];

  if (!pageRoles || pageRoles.length === 0) return true;

  return pr.filter(r => ur.indexOf(r) !== -1).length > 0;
};

const parseForAllowedRoles = (roles: string | string[] | undefined) : string[] => {
  if(!roles) {
    return [];
  } else if(typeof roles === "string") {
    return roles.split(",").map(r => r.trim());
  }
  return roles;
};

export const AuthorizedRoute: React.SFC<AllProps> = ({ user, errors, authorizedRoles, component, refreshSession, authenticateUser, ...rest }) => {
  const areRolesSpecified = !!authorizedRoles;
  const allowedRoles = parseForAllowedRoles(authorizedRoles);

  const isAuthorized = () : boolean => {
    if(!user.isAuthenticated) { return false; }
    if(!areRolesSpecified) { return true; }

    return hasAuthorizedRole(allowedRoles, user.roles);
  };

  if(!user.isAuthenticated) {
    refreshSession();
  }

  const authorized = isAuthorized();
  const toRender = authorized
    ? component
    : NotAuthorizedPage;

  return (
    <Route component={toRender} {...rest} />
  );
};

