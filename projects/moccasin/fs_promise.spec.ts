import { expect } from "chai"
import { readdir, readFile } from "./fs_promise"

describe("readdir", () => {
  it("should return file names", async () => {
    return readdir(__dirname).then(files => {
      expect(files).to.include("fs_promise.spec.ts")
    })
  })
})

describe("readFile", () => {
  it("should return contents", async () => {
    return readFile(__filename).then(file => {
      expect(file).to.include('describe("readFile"')
    })
  })
})
