import { expect } from "chai"
import { readdir } from "./fs_promise"

describe("readdir", () => {
  it("should return file names", async () => {
    return readdir(__dirname).then(files => {
      expect(files).to.include("fs_promise.ts")
    })
  })
})
