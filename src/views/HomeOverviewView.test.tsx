import {render, getMockContextProps} from "@stripe/ui-extension-sdk/testing";
import {ContextView} from "@stripe/ui-extension-sdk/ui";

import HomeOverviewView from "./HomeOverviewView";

describe("HomeOverviewView", () => {
  it("renders ContextView", () => {
    const {wrapper} = render(<HomeOverviewView {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)).toContainText("save to reload this view");
  });
});
