import React from "react";

export default function DeleteToast({ message, onConfirm, onCancel }) {
  return (
    <div
       className="del-tos"
    >
      <p >{message}</p>
      <div >
        <button
          onClick={onCancel}
         className="nope"
        >
           No
        </button>
        <button className="yep"
          onClick={onConfirm}
         
        >
          Yes
        </button>
      </div>
    </div>
  );
}
