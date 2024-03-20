import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Transition,
  useMantineTheme,
} from '@mantine/core';
import { useShallowEffect } from '@mantine/hooks';
import { differenceInMinutes, format, isWithinInterval } from 'date-fns';
import { ScheduleCardProps } from '@/types';
import { formatDay, remainingTime, removeProvince, toTitleCase } from '@/utils';

const ScheduleCardProgess = ({ value }: { value: number }) => {
  const [progressValue, setProgressValue] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setProgressValue(value);
    }, 100);
    return () => {
      setProgressValue(0);
    };
  }, []);

  return (
    <Transition
      mounted={progressValue !== 0}
      transition="scale-x"
      duration={700}
      timingFunction="ease"
    >
      {(transitionStyle) => (
        <Progress
          value={progressValue}
          pos="absolute"
          h={7}
          bottom={0}
          left={0}
          right={0}
          color="red"
          style={{ ...transitionStyle, backgroundColor: 'inherit', zIndex: 1 }}
        />
      )}
    </Transition>
  );
};

const remainingTimePercent = (startDate: Date, endDate: Date) => {
  const totalTimeDiff = differenceInMinutes(endDate, startDate);
  const timeDiffToEnd = differenceInMinutes(endDate, new Date());
  const timeDiffPercent = Number(((totalTimeDiff - timeDiffToEnd) / totalTimeDiff) * 100);
  return timeDiffPercent;
};
const ScheduleCard = ({ data, province }: ScheduleCardProps) => {
  const theme = useMantineTheme();
  const currentDate = new Date();
  const scheduleStartDate = new Date(data?.startDate);
  const scheduleEndDate = new Date(data?.endDate);

  const isCurrentlyShedding = isWithinInterval(currentDate, {
    start: scheduleStartDate,
    end: scheduleEndDate,
  });

  const timeToGo = remainingTime(scheduleStartDate, currentDate);
  const progressValue = remainingTimePercent(scheduleStartDate, scheduleEndDate);

  return (
    <Card shadow="sm" padding="lg" radius="md" mb={10}>
      <Group style={{ marginBottom: 10, marginTop: theme.spacing.sm }}>
        <Text data-testid="area-province">
          {`${toTitleCase(data?.area)} - ${removeProvince(province)}`}
        </Text>
        <Badge
          color={isCurrentlyShedding ? 'red' : timeToGo.color}
          variant="light"
          data-testid="schedule-date"
          size="lg"
        >
          {formatDay(scheduleStartDate)}
        </Badge>
      </Group>
      <Stack gap="xs">
        <Text size="sm" style={{ marginBottom: 1 }} data-testid="start-time">
          Start Time: {format(scheduleStartDate, 'HH:mm')}
        </Text>
        <Text size="sm" style={{ marginBottom: 1 }}>
          End Time: {format(scheduleEndDate, 'HH:mm')}
        </Text>
        <Badge
          color={isCurrentlyShedding ? 'red' : timeToGo.color}
          variant="light"
          size="lg"
          fullWidth
        >
          {isCurrentlyShedding ? 'Load Shedding In Progress' : timeToGo.text}
        </Badge>
      </Stack>
      {isCurrentlyShedding && <ScheduleCardProgess value={progressValue} />}
    </Card>
  );
};

export default ScheduleCard;
