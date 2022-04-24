import styled from "@emotion/styled";
import { Card, StatusCategory } from "./Card";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3px;
  margin-top: 5px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 10px;
  gap: 3px;
  border-top: 1px solid #999999;
  padding-top: 3px;
`;

export type Issue = {
  fields: {
    status: {
      statusCategory: {
        id: number;
      };
    };
  };
};

const statusCategoryForId = (id: number): StatusCategory =>
  id === 3
    ? StatusCategory.Done
    : id === 4
    ? StatusCategory.InProgress
    : StatusCategory.ToDo; // (unexpected values are treated as ToDo)

export const Board = ({ columns }: { columns: Issue[][] }) => (
  <Container>
    {columns.map((columnIssues) => (
      <Column>
        {columnIssues.map((issue) => (
          <Card
            // title={issue.key}
            statusCategory={statusCategoryForId(
              issue.fields.status.statusCategory.id,
            )}
          ></Card>
        ))}
      </Column>
    ))}
  </Container>
);
