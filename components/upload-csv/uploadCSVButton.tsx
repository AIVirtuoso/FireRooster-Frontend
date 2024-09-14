import React, { useState, ChangeEvent } from 'react';
import { profileService } from "@/services/profile";
import ToastNotification from "@/components/ToastNotification"
import { toast } from "react-toastify"

interface UploadCSVButtonProps {
    disabled: boolean;
    state: string | "";
    county: string;
}

const UploadCSVButton: React.FC<UploadCSVButtonProps> = ({ disabled, state, county }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setSelectedFile(file);
        if (file) {
            console.log('Selected file:', file.name);
            await handleUpload(file);
        }
    };

    const handleUpload = async (file: File) => {
        try {
            const formData = new FormData();

            formData.append('file', file);
            formData.append('state', state);
            formData.append('county', county);
            const response = await profileService.uploadCSVFile(formData);
            if (response?.status === 200) {
                toast.success(response.message);
                console.log('CSV inserted successfully!');
            } else if (response?.status === 422) {
                toast.error(response.message);
                console.log('Failed to upload file');
            } else {
                toast.error('Invalid CSV format');
                console.log('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="flex items-center">
            <input
                type="file"
                accept=".csv"
                onChange={(e) => handleFileChange(e)}
                className="hidden"
                id="csvUpload"
                disabled={disabled}
            />
            <label
                htmlFor="csvUpload"
                className={`bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                Upload CSV File
            </label>
            <ToastNotification />
        </div>
    );
};

export default UploadCSVButton;
