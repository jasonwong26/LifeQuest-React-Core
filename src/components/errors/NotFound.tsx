import * as React from "react";
import {AlertType, Alert} from "@developermouse/ui-react-core";

export const NotFound: React.SFC = () => (
  <Alert type={AlertType.Danger}>
    <h1>Error</h1>
    <p>Sorry, but we were not able to find the page you requested.</p>
  </Alert>
);
