import React from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';

const Modal = ({ isOpen, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto scrollbar-styled scrollbar-hide">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
                {/* Overlay */}
                <motion.div

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 transition-opacity"
                >
                    <div className="absolute inset-0 bg-black/50" />
                </motion.div>

                {/* Modal Content */}
                <div className="z-[101] relative w-full">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal; 