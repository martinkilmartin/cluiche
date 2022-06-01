import { Button, useColorMode } from "@chakra-ui/react";

export function ColorModeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={toggleColorMode}>
      {colorMode === "light" ? "🌑" : "🌞"}
    </Button>
  );
}
