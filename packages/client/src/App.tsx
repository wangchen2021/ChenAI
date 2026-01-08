import type React from "react";
import NormalizeStyles from "./styles/NormalizeStyles";
import AIChat from "./components/AIChat";

const App: React.FC = () => {
  return (
    <>
      <NormalizeStyles></NormalizeStyles>
      <AIChat></AIChat>
    </>
  );
};

export default App;
