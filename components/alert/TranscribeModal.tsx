"use client";
import React from "react";
import { LoadingButton } from "@mui/lab";
import './style.css';
import { Box, Button } from "@mui/material";

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  whisperTranscript: string;
  assemblyTranscript: string;
  clearedTranscript: string;
  loading: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  audioUrl: string;
  prompt: string;
  handleRerun: (
    e: React.MouseEvent<HTMLButtonElement>,
    model: string
  ) => void;
  handleGPTRerun: () => void;
  handleSavePrompt: () => void;
  setPlaybackRate: (rate: number) => void;
  handlePromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  playbackRates: ({rate: number; label: string;}[])
}


const ModalComponent: React.FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  whisperTranscript,
  assemblyTranscript,
  clearedTranscript,
  loading,
  audioRef,
  audioUrl,
  prompt,
  handleRerun,
  handleGPTRerun,
  handleSavePrompt,
  setPlaybackRate,
  handlePromptChange,
  playbackRates
}) => {
  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
      <div
        className="bg-white p-4 md:p-8 rounded-lg shadow-xl w-full max-w-screen-2xl"
        style={{ maxHeight: "100vh", overflow: "auto" }}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Transcript from various models
        </h2>

        {/* Transcripts Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Whisper Transcript */}
          <div className="flex-1 text-center">
            <h1 className="text-lg md:text-xl font-bold mb-2">Whisper</h1>
            <div className="p-2 md:p-4 border border-gray-300 rounded max-h-80 min-h-80 overflow-y-auto text-left">
              <pre style={{ whiteSpace: "pre-wrap" }}>{whisperTranscript}</pre>
            </div>
            <LoadingButton
              sx={{
                [`&:hover`]: { background: "rgba(30, 41, 59, 0.8)" },
                backgroundColor: "rgb(59, 130, 246)",
                padding: "5px 10px",
                marginTop: "1rem",
                color: "white",
              }}
              loading={loading}
              onClick={(e) => handleRerun(e, "whisper")}
            >
              rerun
            </LoadingButton>
          </div>

          {/* Assembly Transcript */}
          <div className="flex-1 text-center">
            <h1 className="text-lg md:text-xl font-bold mb-2">Assembly</h1>
            <div className="p-2 md:p-4 border border-gray-300 rounded text-left max-h-80 min-h-80 overflow-y-auto">
              <pre style={{ whiteSpace: "pre-wrap" }}>{assemblyTranscript}</pre>
            </div>
            <LoadingButton
              sx={{
                [`&:hover`]: { background: "rgba(30, 41, 59, 0.8)" },
                backgroundColor: "rgb(59, 130, 246)",
                padding: "5px 10px",
                marginTop: "1rem",
                color: "white",
              }}
              loading={loading}
              onClick={(e) => handleRerun(e, "assembly")}
            >
              rerun
            </LoadingButton>
          </div>

          {/* ChatGPT Transcript */}
          <div className="flex-1 text-center">
            <h1 className="text-lg md:text-xl font-bold mb-2">ChatGPT</h1>
            <div className="p-2 md:p-4 border border-gray-300 rounded text-left max-h-80 min-h-80 overflow-y-auto">
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {clearedTranscript || ""}
              </pre>
            </div>
            <LoadingButton
              sx={{
                [`&:hover`]: { background: "rgba(30, 41, 59, 0.8)" },
                backgroundColor: "rgb(59, 130, 246)",
                padding: "5px 10px",
                marginTop: "1rem",
                color: "white",
              }}
              loading={loading}
              onClick={handleGPTRerun}
            >
              rerun
            </LoadingButton>
          </div>
        </div>

        {/* Audio Player and Controls */}
        <div className="flex flex-col md:flex-row items-center mb-4">
          <audio  
            ref={audioRef}  
            controls
            style={{marginBottom: "8px"}} // Adjust the numeric value, default uses 'spacing' unit  
            onLoadedData={() => console.log('Audio loaded')}  
          >  
            {audioUrl && <source src={audioUrl} type="audio/mpeg" />}  
          </audio>
          <Box display="flex" justifyContent="space-between" marginTop={0}>  
            {playbackRates.map(({ rate, label }) => (  
              <Button  
                key={rate}  
                variant="contained"  
                color="primary"  
                onClick={() => setPlaybackRate(rate)}  
                size="small"  
                sx={{ minWidth: "50px", padding: "unset", margin: "4px"}}  
              >  
                {label}  
              </Button>  
            ))}  
          </Box>
        </div>

        {/* Prompt Textarea */}
        <textarea
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="Input prompt"
          rows={6}
          value={prompt}
          onChange={handlePromptChange}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <LoadingButton
            sx={{
              [`&:hover`]: { background: "rgba(30, 41, 59, 0.8)" },
              backgroundColor: "rgb(59, 130, 246)",
              padding: "5px 10px",
              color: "white",
            }}
            loading={loading}
            onClick={handleSavePrompt}
          >
            Save
          </LoadingButton>
          <LoadingButton
            sx={{
              [`&:hover`]: { background: "rgba(30, 41, 59, 0.8)" },
              backgroundColor: "rgb(59, 130, 246)",
              padding: "5px 10px",
              color: "white",
            }}
            loading={loading}
            onClick={onClose}
          >
            Close
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
