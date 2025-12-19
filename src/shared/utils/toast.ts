import { toast, ToastOptions } from 'react-toastify';

const BASE_MULTI_OPTIONS: ToastOptions = {
  containerId: 'swatch-multi-module',
};

export const showSuccessToast = (message: string) =>
  toast.success(message, BASE_MULTI_OPTIONS);

export const showErrorToast = (message: string) =>
  toast.error(message, BASE_MULTI_OPTIONS);

export const showInfoToast = (message: string) =>
  toast.info(message, BASE_MULTI_OPTIONS);
