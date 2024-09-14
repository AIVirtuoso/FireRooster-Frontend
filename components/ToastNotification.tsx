import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = () => (
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
);

export default ToastNotification;