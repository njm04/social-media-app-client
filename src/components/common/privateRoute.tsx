import * as React from "react";
import { Redirect, RouteComponentProps } from "@reach/router";
import auth from "../../services/authService";

export interface PrivateRouteProps extends RouteComponentProps {
  as: React.ElementType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = (
  props: PrivateRouteProps
) => {
  let { as: Comp, ...rest } = props;
  return auth.getCurrentUser() ? (
    <Comp {...rest} />
  ) : (
    <Redirect to="/" noThrow />
  );
};

export default PrivateRoute;
