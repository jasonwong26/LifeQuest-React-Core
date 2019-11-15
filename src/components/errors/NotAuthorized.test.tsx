import * as React from "react";
import { create, ReactTestRenderer } from "react-test-renderer";

import {NotAuthorized} from "./NotAuthorized";

let snapshot: ReactTestRenderer;

beforeEach(() => {
  const component = (
    <NotAuthorized />
  );

  snapshot = create(component);
});

describe("<NotAuthorized />", () => {
  test("it matches the snapshot", () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
