import { toast } from 'react-toastify';

export const toastError = (error: string, autoClose = true, closeDelay = 10000) => {
  toast.error(error, {
    position: 'top-right',
    autoClose: autoClose ? closeDelay : false,
    hideProgressBar: autoClose,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    icon: true,
  });
};

export const toastSuccess = (message: string, autoClose = true, closeDelay = 10000) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: autoClose ? closeDelay : false,
    hideProgressBar: !autoClose,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    icon: true,
  });
};
