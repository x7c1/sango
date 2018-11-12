import { expect } from "chai"
import { hello } from "./"

describe("hello", () => {
  it("should return hello", () => {
    const message = hello("moccasin")
    expect(message).to.eq("hello, moccasin!")
  })
})
