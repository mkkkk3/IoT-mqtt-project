export function incrementMessagesReceived(state) {
  return {
    ...state,
    dataStatistics: {
      ...state.dataStatistics,
      messagesRecieved: {
        ...state.dataStatistics.messagesRecieved,
        value: state.dataStatistics.messagesRecieved.value + 1,
      },
    },
  };
}

export function handleValidJsonStats(state) {
  const prevValid = state.dataStatistics.validJsonCount.value;
  const newValid = prevValid + 1;

  return {
    ...state,
    dataStatistics: {
      ...state.dataStatistics,
      validJsonCount: {
        ...state.dataStatistics.validJsonCount,
        value: newValid,
      },
    },
  };
}

export function incrementInvalidJsonCount(state) {
  return {
    ...state,
    dataStatistics: {
      ...state.dataStatistics,
      invalidJsonCount: {
        ...state.dataStatistics.invalidJsonCount,
        value: state.dataStatistics.invalidJsonCount.value + 1,
      },
    },
  };
}

export function handleEmptyMessagesStats(state, parsedObject) {
  function flatten(value, result = []) {
    if (value === null || value === undefined) {
      result.push(value);
      return result;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        result.push(value);
      } else {
        value.forEach((v) => flatten(v, result));
      }
      return result;
    }

    if (typeof value === "object") {
      const keys = Object.keys(value);

      if (keys.length === 0) {
        result.push(value);
        return result;
      }

      keys.forEach((k) => flatten(value[k], result));
      return result;
    }

    result.push(value);
    return result;
  }

  const flattenedValues = flatten(parsedObject);

  const hasTruthy = flattenedValues.some((v) => Boolean(v));

  if (hasTruthy) return state;

  return {
    ...state,
    dataStatistics: {
      ...state.dataStatistics,
      emptyMessages: {
        ...state.dataStatistics.emptyMessages,
        value: state.dataStatistics.emptyMessages.value + 1,
      },
    },
  };
}

export function handleAverageMessageLines(state, parsedObject) {
  function flattenKeys(obj, result = []) {
    if (obj === null || obj === undefined) return result;

    if (typeof obj !== "object") return result;

    for (const key of Object.keys(obj)) {
      result.push(key);
      flattenKeys(obj[key], result);
    }

    return result;
  }

  const allKeys = flattenKeys(parsedObject);
  const newCount = allKeys.length;

  const prevAvg = state.dataStatistics.averageMessageLines.value;
  const prevMsgs = state.dataStatistics.messagesRecieved.value;

  const newAvg =
    prevMsgs === 0
      ? newCount
      : (prevAvg * prevMsgs + newCount) / (prevMsgs + 1);

  return {
    ...state,
    dataStatistics: {
      ...state.dataStatistics,
      averageMessageLines: {
        ...state.dataStatistics.averageMessageLines,
        value: newAvg,
      },
    },
  };
}

export function handleAverageMessageLengthChars(state, parsedObject) {
  function flattenKeys(obj, result = []) {
    if (obj === null || obj === undefined) return result;

    if (typeof obj !== "object") return result;

    for (const key of Object.keys(obj)) {
      result.push(key);
      flattenKeys(obj[key], result);
    }

    return result;
  }

  const allKeys = flattenKeys(parsedObject);
  const keysCountThisMessage = allKeys.length;

  if (keysCountThisMessage === 0) {
    return state;
  }

  const totalLengthThisMessage = allKeys.reduce(
    (sum, key) => sum + String(key).length,
    0
  );

  const prevAvg = state.dataStatistics.averageMessageLengthChars.value ?? 0;
  const prevCount =
    state.dataStatistics.averageMessageLengthChars.keysCount ?? 0;

  const newTotalCount = prevCount + keysCountThisMessage;

  const newAvg =
    prevCount === 0
      ? totalLengthThisMessage / keysCountThisMessage
      : (prevAvg * prevCount + totalLengthThisMessage) / newTotalCount;

  return {
    ...state,
    dataStatistics: {
      ...state.dataStatistics,
      averageMessageLengthChars: {
        ...state.dataStatistics.averageMessageLengthChars,
        value: newAvg,
        keysCount: newTotalCount,
      },
    },
  };
}

export function handleNumberOfEntriesAboutHumidity(state, parsedObject) {
  const testedValues =
    state.dataStatistics.numberOfEntriesAboutHumidity.testedValues || [];

  const testedLower = testedValues.map((v) => String(v).toLowerCase());

  function flattenKeys(obj, result = []) {
    if (obj === null || obj === undefined) return result;
    if (typeof obj !== "object") return result;

    for (const key of Object.keys(obj)) {
      result.push(key);
      flattenKeys(obj[key], result);
    }

    return result;
  }

  const allKeys = flattenKeys(parsedObject);

  const hasHumidityKey = allKeys.some((key) =>
    testedLower.includes(String(key).toLowerCase())
  );

  if (!hasHumidityKey) {
    return state;
  }

  return {
    ...state,
    dataStatistics: {
      ...state.dataStatistics,
      numberOfEntriesAboutHumidity: {
        ...state.dataStatistics.numberOfEntriesAboutHumidity,
        value: state.dataStatistics.numberOfEntriesAboutHumidity.value + 1,
      },
    },
  };
}

export function handleNumberOfEntriesAboutTemperature(state, parsedObject) {
  const testedValues =
    state.dataStatistics.numberOfEntriesAboutTemperature.testedValues || [];

  const testedLower = testedValues.map((v) => String(v).toLowerCase());

  function flattenKeys(obj, result = []) {
    if (obj === null || obj === undefined) return result;
    if (typeof obj !== "object") return result;

    for (const key of Object.keys(obj)) {
      result.push(key);
      flattenKeys(obj[key], result);
    }

    return result;
  }

  const allKeys = flattenKeys(parsedObject);

  const hasTemperatureKey = allKeys.some((key) =>
    testedLower.includes(String(key).toLowerCase())
  );

  if (!hasTemperatureKey) {
    return state;
  }

  return {
    ...state,
    dataStatistics: {
      ...state.dataStatistics,
      numberOfEntriesAboutTemperature: {
        ...state.dataStatistics.numberOfEntriesAboutTemperature,
        value: state.dataStatistics.numberOfEntriesAboutTemperature.value + 1,
      },
    },
  };
}