import { useEffect, useState } from "react";

export function useDate() {
  const [day, setDay] = useState<number[]>([]);
  const DAY = 2025;
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const days = [];
    for (let i = DAY; i <= year + 1; i++) {
      days.push(i);
    }
    setDay(days)
  }, []);

  return day;
}

