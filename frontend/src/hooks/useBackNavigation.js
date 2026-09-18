import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function useBackNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const historyIndex = window.history.state?.idx ?? 0;
  const isHome = location.pathname === "/";
  const canGoBack = !isHome && historyIndex > 0;

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [navigate, historyIndex]);

  return { goBack, canGoBack, isHome };
}
