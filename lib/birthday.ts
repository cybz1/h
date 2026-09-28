export function birthdayCountdown(now: Date) {
  const isBirthday = now.getMonth() === 9 && now.getDate() === 5;
  let target = new Date(now.getFullYear(), 9, 5);
  if (!isBirthday && now >= target) target = new Date(now.getFullYear() + 1, 9, 5);
  const remaining = isBirthday ? 0 : Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  return { isBirthday, days: Math.floor(remaining / 86400), hours: Math.floor((remaining % 86400) / 3600), minutes: Math.floor((remaining % 3600) / 60), seconds: remaining % 60 };
}
