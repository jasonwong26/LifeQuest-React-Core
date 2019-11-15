import * as React from "react";
import {AlertType, Alert} from "@developermouse/ui-react-core";

export const NotAuthorized: React.SFC = () => (
  <Alert type={AlertType.Danger}>
    <h1>Error</h1>
    <p>Sorry, you are not authorized to access the page you requested.</p>
  </Alert>
);
