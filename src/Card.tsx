import styled from "@emotion/styled";

export enum StatusCategory {
  ToDo,
  InProgress,
  Done,
}

const Svg = styled.svg`
  display: block;
`;

export const Card = ({
  statusCategory,
}: {
  statusCategory: StatusCategory;
}) => (
  <Svg viewBox="0 0 100 100">
    {statusCategory === StatusCategory.Done ? (
      <polygon fill="#00875A" points="50 7, 100 93, 0 93" />
    ) : statusCategory === StatusCategory.InProgress ? (
      <circle fill="#0052CC" cx="50" cy="50" r="50" />
    ) : (
      // StatusCategory.ToDo
      <rect fill="#42526E" width="100" height="100" />
    )}
  </Svg>
);
