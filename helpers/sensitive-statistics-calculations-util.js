function normalize(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function flattenKeysAndValues(obj, result = []) {
  if (obj === null || obj === undefined) return result;

  if (typeof obj !== "object") {
    result.push(normalize(obj));
    return result;
  }

  for (const key of Object.keys(obj)) {
    result.push(normalize(key));
    flattenKeysAndValues(obj[key], result);
  }

  return result;
}

function handleContainsData(state, parsedObject, fieldKey, requiredGroups) {
  const section = state.sensitiveDate[fieldKey];
  const { requiredValues, parsedJSON } = section;

  if ((parsedJSON?.length || 0) >= 50) {
    return state;
  }

  const allNormalized = flattenKeysAndValues(parsedObject);

  const matchesAllGroups = requiredGroups.every((groupName) => {
    const groupValues = (requiredValues[groupName] || [])
      .map(normalize)
      .filter(Boolean);

    if (groupValues.length === 0) return false;

    return allNormalized.some((val) => groupValues.includes(val));
  });

  if (!matchesAllGroups) {
    return state;
  }

  return {
    ...state,
    sensitiveDate: {
      ...state.sensitiveDate,
      [fieldKey]: {
        ...section,
        parsedJSON: [...parsedJSON, parsedObject],
      },
    },
  };
}

export function handleContainsPersonalData(state, parsedObject) {
  return handleContainsData(state, parsedObject, "containsPersonalData", [
    "name",
    "surname",
  ]);
}

export function handleContainsEmailData(state, parsedObject) {
  return handleContainsData(state, parsedObject, "containsEmailData", [
    "name",
    "email",
  ]);
}

export function handleContainsTelephoneData(state, parsedObject) {
  return handleContainsData(state, parsedObject, "containsTelephoneData", [
    "name",
    "telephone",
  ]);
}

export function handleContainsLocalizationData(state, parsedObject) {
  return handleContainsData(state, parsedObject, "containsLocalizationData", [
    "localization",
    "name",
  ]);
}

export function handleContainsBankingData(state, parsedObject) {
  return handleContainsData(state, parsedObject, "containsBankingData", [
    "name",
    "bank",
  ]);
}

export function handleContainsPassData(state, parsedObject) {
  return handleContainsData(state, parsedObject, "containsPassData", ["pass"]);
}
