import styled from "@emotion/styled";
import { groupBy, map } from "lodash-es";
import { useQuery } from "react-query";

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

interface SearchResult {
  startAt: number;
  maxResults: number;
  total: number;
  issues: {
    expand: string;
    id: string;
    self: string;
    key: string;
    fields: {
      status: {
        self: string;
        description: string;
        iconUrl: string;
        name: string;
        id: string;
        statusCategory: {
          self: string;
          id: number;
          key: string;
          colorName: string;
          name: string;
        };
      };
    };
  }[];
}

export const Sparkboard = ({ issueKey }: { issueKey: string }) => {
  const { isLoading, error, data } = useQuery<SearchResult>(
    ["childIssues", issueKey],
    () =>
      fetch(
        `/rest/api/3/search?jql=${encodeURIComponent(
          `"Epic Link" = ${issueKey}`,
        )}&fields=status`,
      ).then((res) => res.json()),
  );

  if (isLoading) return <>Loading...</>;

  if (error) {
    console.log(error);
    return null;
  }

  const issuesByStatus = groupBy(
    data?.issues,
    (issue) => issue.fields.status.id,
  );

  return (
    <Container>
      {map(issuesByStatus, (issues) => (
        <Column>
          {issues.map((issue) => (
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
