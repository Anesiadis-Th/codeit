export function getXPForLevel(level) {
  return 20 + (level - 1) * 30;
}

export function computeLevel(totalXP) {
  let level = 1;
  let remaining = totalXP ?? 0;
  let xpNeeded = getXPForLevel(level);

  while (remaining >= xpNeeded) {
    remaining -= xpNeeded;
    level += 1;
    xpNeeded = getXPForLevel(level);
  }

  return {
    level,
    xpToNext: xpNeeded - remaining,
    percentToNextLevel: (remaining / xpNeeded) * 100,
  };
}
