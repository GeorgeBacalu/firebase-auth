import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Modal({ isOpen, onClose }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema), defaultValues: values, mode: "all" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Text in a modal</h2>
        <p className="mb-4">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
        <div className="flex justify-end">
          <button className="bg-purple-600 text-white py-2 px-4 rounded-lg flex items-center" onClick={onClose}>Cancel</button>
          <button className="bg-purple-600 text-white py-2 px-4 rounded-lg flex items-center ml-3" onClick={onClose}>Save</button>
        </div>
      </div>
    </div>
  )
}