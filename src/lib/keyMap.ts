export const supportedControlKeys = new Set(["Backspace", "Tab", "Enter", "Shift", " "]);

export function isSupportedTypingKey(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }

  if (event.key.length === 1) {
    return true;
  }

  return supportedControlKeys.has(event.key);
}

export function normalizeKey(key: string) {
  if (key === " ") {
    return "Space";
  }

  if (key === "Backspace") {
    return "Delete";
  }

  if (key === "Enter") {
    return "Return";
  }

  return key;
}
