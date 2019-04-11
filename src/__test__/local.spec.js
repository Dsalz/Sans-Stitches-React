import {
  addDetailsToLocalStorage,
  checkLocalStorage,
  removeDetailsFromLocalStorage,
  getDetailsFromLocalStorage
} from "../local";

describe("checking local storage", () => {
  const mockLocalStorage = {};
  it("should return false when no platform data is stored there and true when there is", () => {
    expect(checkLocalStorage(mockLocalStorage)).toEqual(false);
    addDetailsToLocalStorage({ key: "value" }, mockLocalStorage);
    expect(checkLocalStorage(mockLocalStorage)).toEqual(true);
  });
});

describe("adding details to local storage", () => {
  it("should create new object with platform data when there is none", () => {
    const mockEmptyLocalStorage = {};
    addDetailsToLocalStorage({ key: "value" }, mockEmptyLocalStorage);
    expect(mockEmptyLocalStorage.sansStitches).toEqual(
      JSON.stringify({ key: "value" })
    );
  });
  it("should modify object with platform data when there is one", () => {
    const mockLocalStorage = {
      sansStitches: JSON.stringify({ key: "value1", key2: "value2" })
    };
    addDetailsToLocalStorage({ key: "value" }, mockLocalStorage);
    expect(mockLocalStorage.sansStitches).toEqual(
      JSON.stringify({ key: "value", key2: "value2" })
    );
  });
});

describe("getting details from local storage", () => {
  it("should return detail", () => {
    const mockLocalStorage = {
      sansStitches: JSON.stringify({ key: "value" })
    };
    expect(getDetailsFromLocalStorage("key", mockLocalStorage)).toEqual(
      "value"
    );
  });
});

describe("deleting details from local storage", () => {
  it("should delete all platform data stored in local storage", () => {
    const mockLocalStorage = {
      sansStitches: JSON.stringify({ key: "value" })
    };
    removeDetailsFromLocalStorage(mockLocalStorage);
    expect(mockLocalStorage.sansStitches).not.toBeDefined();
  });
});
