export function handleMaxMessagesPerSlot(state, parsedObject) {
  const slot = state.flowStatistics.maxMessagesPerSlot;

  const seconds = slot.seconds || 5;
  const windowMs = seconds * 1000;
  const now = Date.now();

  let currentWindowStart = slot.currentWindowStart;
  let currentWindowCount = slot.currentWindowCount ?? 0;

  if (currentWindowStart == null) {
    currentWindowStart = now;
    currentWindowCount = 1;

    return {
      ...state,
      flowStatistics: {
        ...state.flowStatistics,
        maxMessagesPerSlot: {
          ...slot,
          currentWindowStart,
          currentWindowCount,
        },
      },
    };
  }

  if (now - currentWindowStart < windowMs) {
    currentWindowCount += 1;

    return {
      ...state,
      flowStatistics: {
        ...state.flowStatistics,
        maxMessagesPerSlot: {
          ...slot,
          currentWindowStart,
          currentWindowCount,
        },
      },
    };
  }

  let maxValue = slot.value;
  let maxStart = slot.start;
  let maxEnd = slot.end;

  if (currentWindowCount > maxValue) {
    maxValue = currentWindowCount;
    maxStart = new Date(currentWindowStart);
    maxEnd = new Date(currentWindowStart + windowMs);
  }

  currentWindowStart = now;
  currentWindowCount = 1;

  return {
    ...state,
    flowStatistics: {
      ...state.flowStatistics,
      maxMessagesPerSlot: {
        ...slot,
        value: maxValue,
        start: maxStart,
        end: maxEnd,
        currentWindowStart,
        currentWindowCount,
      },
    },
  };
}

export function handleAverageMessagesPerSlot(state, parsedObject) {
  const slot = state.flowStatistics.averageMessagesPerSlot;

  const seconds = slot.seconds || 5;
  const windowMs = seconds * 1000;
  const now = Date.now();

  let currentWindowStart = slot.currentWindowStart;
  let currentWindowCount = slot.currentWindowCount ?? 0;
  let slotsCount = slot.slotsCount ?? 0;
  let avgValue = slot.value ?? 0;

  if (currentWindowStart == null) {
    currentWindowStart = now;
    currentWindowCount = 1;

    return {
      ...state,
      flowStatistics: {
        ...state.flowStatistics,
        averageMessagesPerSlot: {
          ...slot,
          currentWindowStart,
          currentWindowCount,
          slotsCount,
          value: avgValue,
        },
      },
    };
  }

  if (now - currentWindowStart < windowMs) {
    currentWindowCount += 1;

    return {
      ...state,
      flowStatistics: {
        ...state.flowStatistics,
        averageMessagesPerSlot: {
          ...slot,
          currentWindowStart,
          currentWindowCount,
          slotsCount,
          value: avgValue,
        },
      },
    };
  }

  const prevAvg = avgValue;
  const prevSlots = slotsCount;

  const newSlotsCount = prevSlots + 1;

  const newAvg =
    prevSlots === 0
      ? currentWindowCount
      : (prevAvg * prevSlots + currentWindowCount) / newSlotsCount;

  currentWindowStart = now;
  currentWindowCount = 1;

  return {
    ...state,
    flowStatistics: {
      ...state.flowStatistics,
      averageMessagesPerSlot: {
        ...slot,
        value: newAvg,
        slotsCount: newSlotsCount,
        currentWindowStart,
        currentWindowCount,
      },
    },
  };
}
