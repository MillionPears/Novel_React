import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface CustomModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
    isOpen,
    onRequestClose,
    title,
    onConfirm,
    onCancel,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
                <button
                    onClick={onRequestClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={20} />
                </button>
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <p className="mb-6">Bạn có chắc chắn muốn thực hiện hành động này không?</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onConfirm}
                        className="bg-sky_blue_light text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-red text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
