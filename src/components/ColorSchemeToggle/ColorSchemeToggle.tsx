import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSunHigh } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
      size="lg"
      style={(theme) => ({
        backgroundColor: 'transparent',
        color: colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
      })}
    >
      {colorScheme !== 'dark' ? <IconSunHigh /> : <IconMoon />}
    </ActionIcon>
  );
}
