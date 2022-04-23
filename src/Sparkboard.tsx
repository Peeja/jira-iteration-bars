import styled from "@emotion/styled";
import columnsOfIssues from "./columnsOfIssues";
import { useBoardConfigQuery, useChildIssuesQuery } from "./queries";

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
`;

const Card = styled.div<{ statusCategoryId: number }>`
  width: 100%;
  height: 10px;

  background-color: ${({ statusCategoryId }) =>
    statusCategoryId === 3
      ? // Done
        "#00875A"
      : statusCategoryId === 4
      ? // In Progress
        "#0052CC"
      : // To Do (or an unexpected value)
        "#42526E"};
`;

export const Sparkboard = ({ issueKey }: { issueKey: string }) => {
  const boardConfigQuery = useBoardConfigQuery(54);
  const childIssuesQuery = useChildIssuesQuery(issueKey);

  if (childIssuesQuery.isLoading || boardConfigQuery.isLoading)
    return <>Loading...</>;

  if (childIssuesQuery.isError || boardConfigQuery.isError) {
    console.log(childIssuesQuery.error ?? boardConfigQuery.error);
    return null;
  }

  return (
    <Container>
      {columnsOfIssues(
        boardConfigQuery.data.currentViewConfig.columns,
        childIssuesQuery.data.issues,
      ).map((columnIssues) => (
        <Column>
          {columnIssues.map((issue) => (
            <Card
              title={issue.key}
              statusCategoryId={issue.fields.status.statusCategory.id}
            ></Card>
          ))}
        </Column>
      ))}
    </Container>
  );
};
