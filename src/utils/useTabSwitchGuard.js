import { useEffect, useRef } from "react";

export function useTabSwitchGuard({ maxAttempts = 3, onReset, onWarning }) {
  const attempts = useRef(0);
  const triggered = useRef(false);
  const isOutOfFocus = useRef(false);

  useEffect(() => {
    function handleTabSwitch() {
      if (triggered.current || attempts.current >= maxAttempts || isOutOfFocus.current) return;
      
      isOutOfFocus.current = true;
      attempts.current += 1;

      if (attempts.current >= maxAttempts) {
        triggered.current = true;
        onReset(attempts.current);
      } else {
        onWarning(attempts.current, maxAttempts - attempts.current);
      }
    }

    function onVisibilityChange() {
      if (document.hidden) handleTabSwitch();
    }

    function onBlur() {
      setTimeout(() => {
        if (!document.hasFocus()) handleTabSwitch();
      }, 100);
    }

    function onFocus() {
      isOutOfFocus.current = false;
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return () => {
    attempts.current = 0;
    triggered.current = false;
    isOutOfFocus.current = false;
  };
}