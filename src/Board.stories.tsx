import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Board, Issue } from "./Board";

export default {
  title: "Board",
  component: Board,
} as ComponentMeta<typeof Board>;

const Template: ComponentStory<typeof Board> = (args) => <Board {...args} />;

export const ToDo = Template.bind({});
ToDo.args = {
  columns: [1, 4, 3].flatMap((statusCategoryId) =>
    [0, 3, 1, 2].map((n) =>
      Array<Issue>(n).fill({
        fields: { status: { statusCategory: { id: statusCategoryId } } },
      }),
    ),
  ),
};
