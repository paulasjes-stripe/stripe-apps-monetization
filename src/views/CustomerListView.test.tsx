import {render, getMockContextProps} from "@stripe/ui-extension-sdk/testing";
import {ContextView} from "@stripe/ui-extension-sdk/ui";

import CustomerListView from "./CustomerListView";

describe("CustomerListView", () => {
  it("renders ContextView", () => {
    const {wrapper} = render(<CustomerListView {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)).toContainText("save to reload this view");
  });
});
