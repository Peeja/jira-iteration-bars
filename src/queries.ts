import { useQuery } from "react-query";
import axios from "axios";

interface BoardConfig {
  currentViewConfig: {
    id: number;
    name: string;
    canEdit: boolean;
    sprintSupportEnabled: boolean;
    showDaysInColumn: boolean;
    kanPlanEnabled: boolean;
    showEpicAsPanel: boolean;
    isSimpleBoard: boolean;
    jqsInJsw: boolean;
    columns: {
      id: number;
      name: string;
      statusIds: string[];
      isKanPlanColumn: boolean;
    }[];
  };
}
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
export const useChildIssuesQuery = (issueKey: string) =>
  useQuery(["childIssues", issueKey] as const, ({ queryKey: [, key] }) =>
    axios
      .get<SearchResult>(
        `/rest/api/3/search?jql=${encodeURIComponent(
          `"Epic Link" = ${key}`,
        )}&fields=status`,
      )
      .then((r) => r.data),
  );

export const useBoardConfigQuery = (boardId: number) =>
  useQuery(["boardConfig", boardId] as const, ({ queryKey: [, id] }) =>
    axios
      .get<BoardConfig>(
        `https://groundfloor.atlassian.net/rest/greenhopper/1.0/xboard/config.json?rapidViewId=${id}`,
      )
      .then((r) => r.data),
  );
