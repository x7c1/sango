import { expect } from "chai"
import { greeting } from "./index"

describe("greeting", () => {
  it("should have greeting", () => {
    expect(greeting).to.eq("hello, sample!")
  })
})
