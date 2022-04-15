import { useState } from "react";

const CountingButton = () => {
  const [count, setCount] = useState(0);
  return (
    <button
      onClick={() => {
        setCount((previous) => previous + 1);
      }}
    >
      {count}
    </button>
  );
};

export const Component = () => (
  <>
    <span style={{ color: "red" }}>Hello</span>, world! <CountingButton />
  </>
);
