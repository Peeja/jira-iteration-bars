import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 5px;
  gap: 1px;
`;

const Card = styled.div`
  background-color: black;
  width: 100%;
  height: 5px;
`;

const RandomColumn = () => (
  <Column>
    {Array<JSX.Element>(Math.floor(Math.random() * 6)).fill(<Card></Card>)}
  </Column>
);

export const Sparkboard = () => (
  <>
    <Container>
      {Array<JSX.Element>(6).fill(<RandomColumn></RandomColumn>)}
    </Container>
  </>
);
