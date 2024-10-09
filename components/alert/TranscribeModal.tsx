"use client";
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Collapse,
  Box 
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import './style.css'

const ModalComponent = (
    {
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
      handlePromptChange

    }: {
      isOpen: any,
      onClose:any,
      whisperTranscript: string,
      assemblyTranscript:string,
      clearedTranscript:string,
      loading: any,
      audioRef: any,
      audioUrl: any,
      prompt: string,
      handleRerun: any,
      handleGPTRerun: any,
      handleSavePrompt: any,
      setPlaybackRate: any,
      handlePromptChange: any
    }) => { 
    if (!isOpen) return null; // Do not render the modal if it's not open  

    
  
    return (  
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">  
        <div className="bg-white p-8 rounded-lg shadow-xl w-3/4" style={{maxHeight: "100vh", overflow: "auto"}}>  
          <h2 className="text-2xl font-bold">Transcript from various models</h2>  
          
          <div className="flex gap-4 mb-2">  
            <div className="flex-1 text-center w-64">
              <h1 style={{fontSize: '20px', fontWeight: "bold"}}>Whisper</h1>
              <div className="p-4 border border-gray-300 rounded max-h-[50vh] min-h-[50vh] overflow-y-auto text-left">  
                <pre style={{textWrap: "wrap"}}>{whisperTranscript}</pre>
              </div>
              <LoadingButton
                sx={{
                  [`&:hover`]: { background: "rgba(30, 41, 59, 0.8)" },
                  background: "rgb(59, 130, 246)",
                  padding: "5px 10px",
                  marginTop: "1.4rem",
                  color: "white"
                }}
                loading={loading}
                onClick={(e) => handleRerun(e, "whisper")}
              >
                rerun
              </LoadingButton>
            </div>  
            <div className="flex-1 text-center w-64"> 
              <h1 style={{fontSize: '20px', fontWeight: "bold"}}>Assembly</h1>

              <div className="p-4 border border-gray-300 rounded text-left max-h-[50vh] min-h-[50vh] overflow-y-auto">  
                <pre style={{textWrap: "wrap"}}>{assemblyTranscript}</pre>  
              </div>  
              <LoadingButton
                sx={{
                  [`&:hover`]: { background: "rgba(30, 41, 59, 0.8)" },
                  background: "rgb(59, 130, 246)",
                  padding: "5px 10px",
                  marginTop: "1.4rem",
                  color: "white"
                }}
                loading={loading}
                onClick={(e) => handleRerun(e, "assembly")}
              >
                rerun
              </LoadingButton>
            </div>  
            <div className="flex-1 text-center w-64"> 
              <h1 style={{fontSize: '20px', fontWeight: "bold"}}>ChatGPT</h1>

              <div className="p-4 border border-gray-300 rounded text-left max-h-[50vh] min-h-[50vh] overflow-y-auto">  
                <pre style={{textWrap: "wrap"}}>{clearedTranscript || ""}</pre>  
              </div>  
              <LoadingButton
                sx={{
                  [`&:hover`]: { background: "rgba(30, 41, 59, 0.8)" },
                  background: "rgb(59, 130, 246)",
                  padding: "5px 10px",
                  marginTop: "1.4rem",
                  color: "white"
                }}
                loading={loading}
                onClick={handleGPTRerun}
              >
                rerun
              </LoadingButton>
            </div>  
          </div>

          <div className="flex mb-2">
            <audio
              ref={audioRef}
              controls
              onLoadedData={() => console.log("Audio loaded")}
            >
              {audioUrl && <source src={audioUrl} type="audio/mpeg" />}
            </audio>
            <div className="flex space-x-2">
              <button
                onClick={() => setPlaybackRate(0.25)}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                style={{marginTop: "auto", marginBottom: "auto"}}
              >
                1/4
              </button>
              <button
                onClick={() => setPlaybackRate(0.5)}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                style={{marginTop: "auto", marginBottom: "auto"}}
              >
                1/2
              </button>
              <button
                onClick={() => setPlaybackRate(1)}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                style={{marginTop: "auto", marginBottom: "auto"}}
              >
                Normal
              </button>
            </div>
          </div>
  
          <textarea  
            className="w-full p-3 border border-gray-300 rounded mb-1"  
            placeholder="Input prompt"
            rows={6}
            value={prompt}  
            onChange={handlePromptChange}  
          />  
  
          <div className="flex justify-end">  
            <LoadingButton
              sx={{
                [`&:hover`]: { background: "rgba(30, 41, 59, 0.8)" },
                background: "rgb(59, 130, 246)",
                padding: "5px 10px",
                marginTop: "5px",
                marginRight: "10px",
                color: "white"
              }}
              loading={loading} 
              onClick={handleSavePrompt}  
            >  
              Save
            </LoadingButton>  
            <LoadingButton
              sx={{
                [`&:hover`]: { background: "rgba(30, 41, 59, 0.8)" },
                background: "rgb(59, 130, 246)",
                padding: "5px 10px",
                marginTop: "5px",
                color: "white"
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