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
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { alertService } from "@/services/alerts";
import OpenMapButton from "@/components/googlemap/openMapButton";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material"; // Import the icon
import { transcriptService } from "@/services/transcript";
import { LoadingButton } from "@mui/lab";
import ModalComponent from "@/components/alert/TranscribeModal";

interface ContactInfo {
  past_info: ResidentInfo[];
  owner_info: (ResidentInfo | null)[];
  current_info: ResidentInfo[];
}

interface AddressData {
  address: string;
  score: number;
  type: string | null;
  dateTime: string | null;
  id: number;
  alert_id: number;
  scanner_id: number | null;
  contact_info: ContactInfo;
  spokeo_status: number;
}

interface ResidentInfo {
  name: string;
  past_address: string;
  phone_number: string;
  email_address: string;
  current_address: string;
}

const starCount = 5;  
const stars = Array(starCount).fill(0); 

export default function Page() {
  const { id, aid } = useParams();

  const [alert, setAlert] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [scanner, setScanner] = useState<any>();
  const [audio, setAudio] = useState<any>({});
  const [audioUrl, setAudioUrl] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);  
  const [whisperTranscript, setWhisperTranscript] = useState("");  
  const [assemblyTranscript, setAssemblyTranscript] = useState("");  
  const [clearedTranscript, setClearedTranscript] = useState("");  
  const [prompt, setPrompt] = useState('');  

  const handleOpenModal = () => {  
    setModalOpen(true);  
  };  

  const handleCloseModal = () => {  
    setModalOpen(false);  
  };  

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRowClick = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const unlockContactInfo = async (address_id: number) => {
    setLoading(true);
    const res = await alertService.unlockContactInfo({address_id: address_id});
    await fetchAlertsData();
    setLoading(false);
  }

  useEffect(() => {
    fetchAlertsData();
    fetchPrompt();
  }, [id, aid]);

  useEffect(() => {
    if (audio?.file_name) {
      setAudioUrl(
        `${process.env.NEXT_PUBLIC_Audio_Base_URL}${audio.file_name}`
      );
    }
  }, [audio]);

  const fetchAlertsData = async () => {
    const res = await alertService.getAlertsById({
      alert_id: Number(aid),
      scanner_id: Number(id),
    });
    setAlert(res.alert);
    setAddresses(res.addresses);
    setScanner(res.scanner);

    // const junkRegex = /Speaker [A-Z]:\s*Silence of\.*\s*(Speaker [A-Z]:\s*)?(More than \d+ minute|Than \d+ minute|[0-9]+ seconds|xx seconds)\.?\n?|Speaker [A-Z]:\s*Silence of more\.?\s*(Speaker [A-Z]:\s*)?(Than \d+ minute|More than \d+ minute|[0-9]+ seconds|xx seconds)\.?\n?|Speaker [A-Z]:\s*Silence\.*\s*(more than \d+ minute)?\.?\n?/gi;
    // let transcript = res.audio.context.replace(junkRegex, '');
    // transcript = transcript.replace(/(Speaker [A-Z]:)/g, '<br>$1');
    // transcript = transcript.replace(/\s+/g, ' ').replace(/\n\s+/g, '\n').trim();

    // res.audio.context = transcript;
    setAudio(res.audio);

    setWhisperTranscript(res.audio.context)
    setAssemblyTranscript(res.audio.assembly_transcript)
    setClearedTranscript(res.audio.cleared_context)
  };

  const fetchPrompt = async () => {
    setLoading(true)
    const data = await transcriptService.getTranscriptPrompt();
    setPrompt(data);
    setLoading(false)
  }

  const setPlaybackRate = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleRerun = async (event: any, model: string) => {
    setLoading(true)
    const formData = new FormData();

    formData.append('model', model);
    formData.append('file_name', audio.file_name);
    const data = await transcriptService.getTranscriptByModels(formData);
    console.log(data)
    if(model == 'whisper') setWhisperTranscript(data);
    else setAssemblyTranscript(data);
    setLoading(false)
  }

  const handleGPTRerun = async() => {
    setLoading(true)
    const formData = new FormData();
    formData.append('file_name', audio.file_name);
    formData.append('whisper_transcript', whisperTranscript);
    formData.append('assembly_transcript', assemblyTranscript);
    formData.append('prompt', prompt);

    const data = await transcriptService.getTranscriptByGPT(formData);
    setClearedTranscript(data)
    setLoading(false)
  }

  const handleSavePrompt = async () => {
    const formData = new FormData();
    formData.append('prompt', prompt);
    await transcriptService.setTranscriptPrompt(formData)
  }

  const handlePromptChange = (e: any) => {
    setPrompt(e.target.value);
  }

  
  return (
    <>
      <div>
        <p className="text-xl font-semibold">Alert #{aid}</p>
        <p className="text-gray-700 text-[13px]">
          {scanner &&
            `${scanner.county_name}, ${scanner.state_name} (${scanner.scanner_title})`}
        </p>
        <div className="mt-7 grid grid-cols-3 gap-10">
          <div className="col-span-1">
            <div className="tooltip-container">  
              <p className="text-xl font-bold mb-[2px]" style={{ marginRight: '10px' }}>  
                Dispatch Website  
              </p>  
              {stars.map((_, index) => (  
                index < alert?.rating ? (  
                  <img key={index} src={'/star-yellow.png'} alt="Star" className="w-6 h-6" style={{ marginBottom: '5px' }} />  
                ) : (  
                  <img key={index} src={'/star-gray.png'} alt="Star" className="w-6 h-6" style={{ marginBottom: '5px', opacity: 0.5 }} />  
                )  
              ))}  
              <span className="tooltip-text"> 
                {alert?.rating_title}
                <hr />
                {alert?.rating_criteria}
              </span>  
            </div>
            <Divider />

            <div className="mt-3 bg-white rounded-md px-4 py-7 shadow-md">

              <p className="text-sm text-gray-600 mt-2">
                <span className="font-bold mt-2">Headline: </span>
                {alert?.headline}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                <span className="font-bold">Desc: </span>
                {alert?.description}
              </p>

              <Divider sx={{ margin: "18px 0px" }} />

              <p
                className="text-[13px] text-gray-700"
                style={{ maxHeight: "200px", overflow: "auto"}}
              >
                <span className="font-bold">Transcript: </span>
                <button  
                  onClick={handleOpenModal}  
                  className="p-1 bg-blue-500 text-white rounded ml-4"  
                >  
                  <span role="img" aria-label="open modal">  
                    🔍
                  </span>  
                </button>  

                <ModalComponent
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  whisperTranscript={whisperTranscript}
                  assemblyTranscript={assemblyTranscript}
                  clearedTranscript={clearedTranscript}
                  loading={loading}
                  audioRef={audioRef}
                  audioUrl={audioUrl}
                  prompt={prompt}
                  handleRerun={handleRerun}
                  handleGPTRerun={handleGPTRerun}
                  handleSavePrompt={handleSavePrompt}
                  setPlaybackRate={setPlaybackRate}
                  handlePromptChange={handlePromptChange}
                />
                {isMounted ? (
                  <pre style={{"textWrap": "wrap"}}>
                    {clearedTranscript || whisperTranscript}
                  </pre>
                ) : (
                  <pre>Loading...</pre> // Fallback content during server-side rendering
                )}
              </p>

              <Divider sx={{ margin: "18px 0px" }} />

              <div>
                <audio
                  ref={audioRef}
                  controls
                  onLoadedData={() => console.log("Audio loaded")}
                >
                  {audioUrl && <source src={audioUrl} type="audio/mpeg" />}
                </audio>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setPlaybackRate(0.25)}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                  >
                    1/4
                  </button>
                  <button
                    onClick={() => setPlaybackRate(0.5)}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                  >
                    1/2
                  </button>
                  <button
                    onClick={() => setPlaybackRate(1)}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                  >
                    Normal
                  </button>
                </div>
              </div>

              <Divider sx={{ margin: "18px 0px" }} />
              <p className="text-[13px] text-gray-700">
                {new Date(alert?.dateTime).toLocaleString()}
              </p>
              <Divider sx={{ margin: "18px 0px" }} />

              <div>
                <p className="text-[12px] text-gray-600">
                  This data is a realtime snapshot from the city&#39;s fire
                  dispatch website/channels.
                </p>

                <p className="text-[12px] text-gray-600 mt-6">
                  When the city reports engines being dispatched to a structure
                  fire, we monitor how long they are on scene. If they are there
                  long enough to indicate a real fire, we create this alert.
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <p className="text-xl font-bold mb-[2px]">Location</p>
            <Divider />

            <p className="text-[17px] mb-[2px] mt-4 flex">
              {" "}
              <span className="font-bold mr-4"> Known Address: </span>{" "}
              <span style={{ fontStyle: "italic", marginRight: "auto" }}>{alert?.address}</span>
              <img src={'/thumb_up.png'} alt="thumbup" className="w-10 h-10 mx-2" />
              <img src={'/thumb_down.png'} alt="thumbdown" className="w-10 h-10 mx-2" />
            </p>
            <p className="text-[17px] font-bold mb-[2px] mt-4">
              Possible Addresses:{" "}
            </p>

            <Paper className="mt-2 p-2" style={{ maxHeight: "70vh", overflow: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      Address
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      Accuracy Score
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      Map
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addresses.map((addr: AddressData, index: number) => (
                    <React.Fragment key={index}>
                      {/* Original row styling */}
                      <TableRow style={{ backgroundColor: expandedRows.includes(index) ? '#f5f5f5' : 'white' }}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{addr.address}</TableCell>
                        <TableCell align="center">{(addr.score * 100).toFixed(2)} %</TableCell>
                        <TableCell>
                          <OpenMapButton address={addr.address} />
                        </TableCell>
                        <TableCell align="center">
                          {/* <ExpandMoreIcon
                            style={{
                              transition: "transform 0.3s",
                              transform: expandedRows.includes(index) ? "rotate(180deg)" : "rotate(0deg)",
                              cursor: "pointer",
                            }}
                          /> */}
                          { addr.score == 1 && (
                            !loading ? (
                              addr.spokeo_status ? (
                                <img
                                  src="/completed.png"
                                  alt="Icon"
                                  width={27}
                                  height={27}
                                  style={{cursor: "pointer"}}
                                  onClick={() => handleRowClick(index)}
                                />
                              ) : (
                                <img
                                  src="/unlock.png"
                                  alt="Icon"
                                  width={25}
                                  height={25}
                                  style={{cursor: "pointer"}}
                                  onClick={() => unlockContactInfo(addr.id)}
                                />
                              )
                            ) : (
                              <img
                                src="/loading.png"
                                alt="Icon"
                                width={27}
                                height={27}
                                style={{cursor: "pointer"}}
                              />
                            )
                          )}

                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell colSpan={5} style={{ padding: "0" }}>
                          <Collapse in={expandedRows.includes(index)} timeout="auto" unmountOnExit>
                            <Box style={{ backgroundColor: '#f0f0f0', padding: "10px", border: "1px solid #ccc" }}>
                              {/* Owner Info Section */}
                              {addr.contact_info?.owner_info?.length > 0 && (
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="center" style={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>Owners</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {addr.contact_info.owner_info.map((info: ResidentInfo | null, idx: number) => (
                                      info && (
                                        <TableRow key={idx}>
                                          <TableCell>
                                            <strong>Name:</strong> {info.name} <br />
                                            <strong>Past Address:</strong> {info.past_address} <br />
                                            <strong>Phone Number:</strong> {info.phone_number} <br />
                                            <strong>Email Address:</strong> {info.email_address} <br />
                                            <strong>Current Address:</strong> {info.current_address}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    ))}
                                  </TableBody>
                                </Table>
                              )}

                              {/* Current Info Section */}
                              {addr.contact_info?.current_info?.length > 0 && (
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="center" style={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>Current Residents</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {addr.contact_info.current_info.map((info: ResidentInfo, idx: number) => (
                                      <TableRow key={idx}>
                                        <TableCell>
                                          <strong>Name:</strong> {info.name} <br />
                                          <strong>Past Address:</strong> {info.past_address} <br />
                                          <strong>Phone Number:</strong> {info.phone_number} <br />
                                          <strong>Email Address:</strong> {info.email_address} <br />
                                          <strong>Current Address:</strong> {info.current_address}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}

                              {/* Past Info Section */}
                              {addr.contact_info?.past_info?.length > 0 && (
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="center" style={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>Past Residents</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {addr.contact_info.past_info.map((info: ResidentInfo, idx: number) => (
                                      <TableRow key={idx}>
                                        <TableCell>
                                          <strong>Name:</strong> {info.name} <br />
                                          <strong>Past Address:</strong> {info.past_address} <br />
                                          <strong>Phone Number:</strong> {info.phone_number} <br />
                                          <strong>Email Address:</strong> {info.email_address} <br />
                                          <strong>Current Address:</strong> {info.current_address}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </Paper>

          </div>
        </div>
      </div>
    </>
  );
}
