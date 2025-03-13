import { useEffect, useLayoutEffect, useState, useRef } from "react";
import styles from "./index.module.less";

interface SvgCircleProps {
  percent: number;
}

export function SvgCircle({ percent = 0 }: SvgCircleProps) {
  const [strokeDasharray, setStrokeDasharray] = useState(0);
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const circle = useRef<SVGCircleElement>(null);

  const handleSize = () => {
    if (ref.current) {
      const { width } = ref.current.getBoundingClientRect();
      const r = width * 0.44;
      const c = Math.PI * r * 2;
      const offset = strokeDasharray - (strokeDasharray * percent) / 100;

      return { c, offset };
    }
    return { c: 0, offset: 0 };
  };

  useLayoutEffect(() => {
    if (ref.current) {
      const { c } = handleSize();
      setStrokeDasharray(c);
      setStrokeDashoffset(c);
    }
  }, []);

  useEffect(() => {
    if (strokeDashoffset) {
      setTimeout(() => {
        const offset = strokeDasharray - (strokeDasharray * percent) / 100;
        setStrokeDashoffset(() => {
          return offset;
        });
      }, 600);
    }
  }, [strokeDashoffset, percent, strokeDasharray]);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      {strokeDashoffset == 0 ? (
        ""
      ) : (
        <svg
          className={styles.svg}
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50%"
            cy="50%"
            r="44%"
            fill="none"
            stroke="rgba(246, 246, 246, 1)"
            strokeWidth="12%"
          ></circle>

          <circle
            cx="50%"
            cy="50%"
            r="44%"
            style={{
              transition: "stroke-dashoffset 1.5s",
            }}
            fill="none"
            ref={circle}
            strokeLinecap="round"
            strokeWidth="12%"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          ></circle>
        </svg>
      )}
    </div>
  );
}
