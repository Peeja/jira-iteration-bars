import { ComponentStory, ComponentMeta } from "@storybook/react";
import styled from "@emotion/styled";

import { Card, StatusCategory } from "./Card";

export default {
  title: "Card",
  component: Card,
} as ComponentMeta<typeof Card>;

const BoundingBox = styled.div`
  border: 3px dashed black;
`;

const Template: ComponentStory<typeof Card> = (args) => (
  <BoundingBox>
    <Card {...args} />
  </BoundingBox>
);

export const ToDo = Template.bind({});
ToDo.args = {
  statusCategory: StatusCategory.ToDo,
};

export const InProgress = Template.bind({});
InProgress.args = {
  statusCategory: StatusCategory.InProgress,
};

export const Done = Template.bind({});
Done.args = {
  statusCategory: StatusCategory.Done,
};
