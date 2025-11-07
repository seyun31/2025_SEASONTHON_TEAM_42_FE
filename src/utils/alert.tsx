import { Bounce, toast } from 'react-toastify';

export const showError = (message: string) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 2500,
    icon: false,
    hideProgressBar: true,
    closeButton: false,
    transition: Bounce,
    style: {
      borderRadius: '32px',
      textAlign: 'center',
      backgroundColor: '#FF5555',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 20px',
      color: '#fff',
      fontSize: '18px',
      fontWeight: 600,
    },
  });
};

export const showSuccess = (message: string) => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 2500,
    icon: false,
    hideProgressBar: true,
    closeButton: false,
    transition: Bounce,
    style: {
      borderRadius: '32px',
      textAlign: 'center',
      backgroundColor: '#00AD38',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 20px',
      color: '#fff',
      fontSize: '18px',
      fontWeight: 600,
    },
  });
};

export const showWarning = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const result = window.confirm(message);
    resolve(result);
  });
};

export const showConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const result = window.confirm(message);
    resolve(result);
  });
};

export const showCustomConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col justify-center items-center gap-3">
          <div className="text-center font-medium">{message}</div>
          <div className="flex gap-2 justify-center">
            <button
              className="px-4 py-2 bg-black text-white rounded-[10px] cursor-pointer"
              onClick={() => {
                closeToast?.();
                resolve(true);
              }}
            >
              확인
            </button>
            <button
              className="px-4 py-2 bg-gray-30 text-black rounded-[10px] cursor-pointer"
              onClick={() => {
                closeToast?.();
                resolve(false);
              }}
            >
              취소
            </button>
          </div>
        </div>
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        className: 'flex justify-center items-center text-center',
      }
    );
  });
};
