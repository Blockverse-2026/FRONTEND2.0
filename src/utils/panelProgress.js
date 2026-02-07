export const hasSeenPanel = (key) =>
  localStorage.getItem(`panel_${key}`) === "true";

export const markPanelSeen = (key) =>
  localStorage.setItem(`panel_${key}`, "true");
