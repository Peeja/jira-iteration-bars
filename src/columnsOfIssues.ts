interface ColumnConfig {
  statusIds: readonly string[];
}

interface Issue {
  fields: {
    status: {
      id: string;
    };
  };
}

export default <C extends ColumnConfig, I extends Issue>(
  columnConfigs: readonly C[],
  issues: readonly I[],
) =>
  columnConfigs.map((column) =>
    issues.filter((i) => column.statusIds.includes(i.fields.status.id)),
  );
