import { toast, Bounce } from "react-toastify";
export const toaster = (message) =>
  toast.error(message, {
    // position: "top-center",
    // autoClose: 3000,
    // hideProgressBar: false,
    // closeOnClick: true,
    // pauseOnHover: true,
    // draggable: true,
    // progress: undefined,
    // theme: "colored",
    // transition: Bounce,
    // width: "50px",
  });
