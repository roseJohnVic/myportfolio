import { toast } from "react-toastify";
import DeleteToast from "../adminComponents/DeleteToast";

export default function DeleteConfirmToast() {
  const confirmAction = (message, onConfirm) => {
    toast(
      ({ closeToast }) => (
        <DeleteToast
          message={message}
          onConfirm={() => {
            onConfirm();
            closeToast();
          }}
          onCancel={closeToast}
        />
      ),
      { position: "top-right", autoClose: false, closeOnClick: false }
    );
  };

  return { confirmAction };
}
