import columnsOfIssues from "./columnsOfIssues";

describe("columnsOfIssues", () => {
  it("should sort into 0 columns", () => {
    const columnConfigs = [] as const;
    const issues = [] as const;
    expect(columnsOfIssues(columnConfigs, issues)).toStrictEqual([]);
  });

  it("should sort 1 issue into 1 column", () => {
    const columnConfigs = [{ statusIds: ["1"] }] as const;
    const issues = [
      { key: "CARD-1", fields: { status: { id: "1" } } },
    ] as const;
    expect(columnsOfIssues(columnConfigs, issues)).toMatchObject([
      [{ key: "CARD-1" }],
    ]);
  });

  it("should sort multiple issues into multiple columns", () => {
    const columnConfigs = [{ statusIds: ["1"] }, { statusIds: ["2"] }] as const;
    const issues = [
      { key: "CARD-1", fields: { status: { id: "1" } } },
      { key: "CARD-2", fields: { status: { id: "2" } } },
      { key: "CARD-3", fields: { status: { id: "2" } } },
    ] as const;
    expect(columnsOfIssues(columnConfigs, issues)).toMatchObject([
      [{ key: "CARD-1" }],
      [{ key: "CARD-2" }, { key: "CARD-3" }],
    ]);
  });

  it("should ignore issues not mapped to any column", () => {
    const columnConfigs = [{ statusIds: ["1"] }, { statusIds: ["2"] }] as const;
    const issues = [
      { key: "CARD-1", fields: { status: { id: "2" } } },
      { key: "CARD-2", fields: { status: { id: "3" } } },
      { key: "CARD-3", fields: { status: { id: "4" } } },
    ] as const;
    expect(columnsOfIssues(columnConfigs, issues)).toMatchObject([
      [],
      [{ key: "CARD-1" }],
    ]);
  });
});
