import { Toast, ToastType } from "@/components/ui/toast";
import React, { useCallback, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({
    visible: false,
    message: "",
    type: "info",
  });

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({
      visible: true,
      message,
      type,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const showSuccess = useCallback(
    (message: string) => showToast(message, "success"),
    [showToast]
  );

  const showError = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast]
  );

  const showWarning = useCallback(
    (message: string) => showToast(message, "warning"),
    [showToast]
  );

  const showInfo = useCallback(
    (message: string) => showToast(message, "info"),
    [showToast]
  );

  const ToastComponent = () => (
    <Toast
      visible={toast.visible}
      message={toast.message}
      type={toast.type}
      onHide={hideToast}
    />
  );

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
    ToastComponent,
  };
}
