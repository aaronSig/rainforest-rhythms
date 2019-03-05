import { getTimeSegment } from "../dates";

describe("Creating TimeSegments from time", () => {
  test("Create time segment", () => {
    const segment = getTimeSegment("10:00:30");
    expect(segment).toBe("10:00");
  });

  test("Will round up", () => {
    const segment = getTimeSegment("10:31:00");
    expect(segment).toBe("11:00");
  });

  test("Will round down", () => {
    const segment = getTimeSegment("10:29:59");
    expect(segment).toBe("10:00");
  });

  test("Works across days", () => {
    const segment = getTimeSegment("23:59:59");
    expect(segment).toBe("00:00");
  });

  test("Correctly pads", () => {
    const segment = getTimeSegment("03:01:01");
    expect(segment).toBe("03:00");
  });
});
