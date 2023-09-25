import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forwardRef, useRef, useImperativeHandle } from "react";

const Toast = (props, ref) => {
  const ToastRef = useRef();

  useImperativeHandle(ref, () => {
    return {
      showToast() {
        switch (props.type) {
          case "success":
            toast.success(props.message);
            break;
          case "error":
            toast.error(props.message);
            break;
          case "info":
            toast.info(props.message);
            break;
          case "warning":
            toast.warning(props.message);
            break;
          default:
            toast(props.message);
            break;
        }
      }
    };
  });

  return (
    <div>
      {/* <button onClick={showToast}>Show Toast</button> */}
      <ToastContainer ref={ToastRef} position="top-right" autoClose={3000} />
    </div>
  );
};

export default forwardRef(Toast);
