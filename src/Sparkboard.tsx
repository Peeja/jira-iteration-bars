import { Board } from "./Board";
import columnsOfIssues from "./columnsOfIssues";
import { useBoardConfigQuery, useChildIssuesQuery } from "./queries";

export const Sparkboard = ({ issueKey }: { issueKey: string }) => {
  const boardConfigQuery = useBoardConfigQuery(54);
  const childIssuesQuery = useChildIssuesQuery(issueKey);

  if (childIssuesQuery.isLoading || boardConfigQuery.isLoading)
    return <>Loading...</>;

  if (childIssuesQuery.isError || boardConfigQuery.isError) {
    console.error(childIssuesQuery.error ?? boardConfigQuery.error);
    return null;
  }

  return (
    <Board
      columns={columnsOfIssues(
        boardConfigQuery.data.currentViewConfig.columns,
        childIssuesQuery.data.issues,
      )}
    />
  );
};
