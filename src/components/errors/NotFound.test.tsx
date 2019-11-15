import * as React from "react";
import { create, ReactTestRenderer } from "react-test-renderer";

import {NotFound} from "./NotFound";

let snapshot: ReactTestRenderer;

beforeEach(() => {
  const component = (
    <NotFound />
  );

  snapshot = create(component);
});

describe("<NotFound />", () => {
  test("it matches the snapshot", () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
