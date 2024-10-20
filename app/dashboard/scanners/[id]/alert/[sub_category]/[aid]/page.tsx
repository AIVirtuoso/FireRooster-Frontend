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
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  useMediaQuery,
  useTheme,
  Button,
  Rating,
} from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { alertService } from "@/services/alerts";
import OpenMapButton from "@/components/googlemap/openMapButton";
import {
  ExpandMore as ExpandMoreIcon,
  ThumbUp,
  ThumbDown,
  Star,
  StarBorder,
  PlayArrow,
} from "@mui/icons-material";
import { transcriptService } from "@/services/transcript";
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

const playbackRates = [  
  { rate: 0.25, label: '0.25x' },  
  { rate: 0.5, label: '0.5x' },  
  { rate: 1, label: '1x' },  
  { rate: 1.5, label: '1.5x' },  
  { rate: 2, label: '2x' },  
];  

const starCount = 5;

export default function Page() {
  const { id, aid } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [alert, setAlert] = useState<any>(null);
  const [addresses, setAddresses] = useState<AddressData[]>([]);
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
  const [prompt, setPrompt] = useState("");

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
    await alertService.unlockContactInfo({ address_id: address_id });
    await fetchAlertsData();
    setLoading(false);
  };

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

    setAudio(res.audio);

    setWhisperTranscript(res.audio.context);
    setAssemblyTranscript(res.audio.assembly_transcript);
    setClearedTranscript(res.audio.cleared_context);
  };

  const fetchPrompt = async () => {
    setLoading(true);
    const data = await transcriptService.getTranscriptPrompt();
    setPrompt(data);
    setLoading(false);
  };

  const setPlaybackRate = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleRerun = async (event: any, model: string) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("model", model);
    formData.append("file_name", audio.file_name);
    const data = await transcriptService.getTranscriptByModels(formData);
    if (model === "whisper") setWhisperTranscript(data);
    else setAssemblyTranscript(data);
    setLoading(false);
  };

  const handleGPTRerun = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file_name", audio.file_name);
    formData.append("whisper_transcript", whisperTranscript);
    formData.append("assembly_transcript", assemblyTranscript);
    formData.append("prompt", prompt);

    const data = await transcriptService.getTranscriptByGPT(formData);
    setClearedTranscript(data);
    setLoading(false);
  };

  const handleSavePrompt = async () => {
    const formData = new FormData();
    formData.append("prompt", prompt);
    await transcriptService.setTranscriptPrompt(formData);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const renderStars = (rating: number) => {
    // return Array.from({ length: starCount }, (_, index) =>
    //   index < rating ? (
    //     <Star key={index} color="info" />
    //   ) : (
    //     <StarBorder key={index} color="disabled" />
    //   )
    // );
    return (
      <Grid item xs={12}>
        <Rating
          name="alert-rating"
          value={rating}
          max={starCount}
        />
      </Grid>
    )
  };

  return (
    <>
      <div>
        <Typography variant="h6" component="p">
          Alert #{aid}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {scanner &&
            `${scanner.county_name}, ${scanner.state_name} (${scanner.scanner_title})`}
        </Typography>

        <Grid container spacing={2} mt={2}>
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" component="p" style={{ flexGrow: 1 }}>
                Dispatch Website
              </Typography>
              <div>{alert && renderStars(alert.rating)}</div>
            </div>
            <Divider />

            <Paper
              elevation={3}
              sx={{ mt: 2, p: 2 }}
              style={{ position: "relative" }}
            >
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Headline:</strong> {alert?.headline}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Description:</strong> {alert?.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Transcript:</strong>
                <IconButton
                  onClick={handleOpenModal}
                  color="primary"
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <ExpandMoreIcon />
                </IconButton>
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
                  playbackRates={playbackRates}
                />
              </Typography>

              {isMounted ? (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ maxHeight: "200px", overflow: "auto", whiteSpace: "pre-wrap" }}
                >
                  {clearedTranscript || whisperTranscript}
                </Typography>
              ) : (
                <Typography variant="body2">Loading...</Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <div>  
                <audio  
                  ref={audioRef}  
                  controls  
                  style={{ width: '100%' }}  
                  onLoadedData={() => console.log('Audio loaded')}  
                >  
                  {audioUrl && <source src={audioUrl} type="audio/mpeg" />}  
                </audio>  
                <Box mt={2} display="flex" justifyContent="space-between">  
                  {playbackRates.map(({ rate, label }) => (  
                    <Button  
                      key={rate}  
                      variant="contained"  
                      color="primary"  
                      onClick={() => setPlaybackRate(rate)}  
                      size="small"  
                      sx={{ minWidth: "50px", padding: "unset"}}  
                    >  
                      {label}  
                    </Button>  
                  ))}  
                </Box>  
              </div>  


              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="textSecondary">
                {new Date(alert?.dateTime).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="caption" color="textSecondary" component="div">
                This data is a realtime snapshot from the city&#39;s fire dispatch
                website/channels.
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                component="div"
                mt={2}
              >
                When the city reports engines being dispatched to a structure
                fire, we monitor how long they are on scene. If they are there
                long enough to indicate a real fire, we create this alert.
              </Typography>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" component="p">
              <span>Location</span>
              <IconButton color="primary">
                <img src='/Approved not pushed.png' className="mb-1" height={24} width={24}></img>
              </IconButton>
              <IconButton color="primary" sx={{marginLeft: "auto"}}>
              <img src='/Disapproved not pushed.png' className="mb-1" height={24} width={24}></img>
              </IconButton>
            </Typography>

            <Divider />

            <Box mt={2} display="flex" alignItems="center" flexWrap="wrap">
              <Typography variant="body1" component="span" sx={{ mr: 1 }}>
                <strong>Known Address:</strong>
              </Typography>
              <Typography
                variant="body1"
                component="span"
                sx={{ fontStyle: "italic", flexGrow: 1 }}
              >
                {alert?.address}
              </Typography>
            </Box>

            <Typography variant="body1" component="p" mt={2}>
              <strong>Possible Addresses:</strong>
            </Typography>

            {addresses.length ? (
              <Box mt={2}>
                {isMobile ? (
                  <Grid container spacing={2}>
                    {addresses.map((addr, index) => (
                      <Grid item xs={12} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="body2" color="textSecondary">
                              <strong>ID:</strong> {index + 1}
                            </Typography>
                            <Typography variant="body2" display="flex" color="textSecondary">
                              <strong>Address: </strong> {addr.address}
                              <Box sx={{marginTop: "-12px", marginLeft: "-50px"}}>
                                <OpenMapButton address={addr.address}/>
                              </Box>
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              <strong>Accuracy Score:</strong>{" "}
                              {(addr.score * 100).toFixed(2)}%
                            </Typography>
                            {/* <Box mt={1}>
                            </Box> */}
                          </CardContent>
                          <CardActions disableSpacing>
                            {addr.score === 1 && (
                              !loading ? (
                                addr.spokeo_status ? (
                                  <IconButton
                                    onClick={() => handleRowClick(index)}
                                    color="primary"
                                  >
                                    <ExpandMoreIcon />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    onClick={() => unlockContactInfo(addr.id)}
                                    color="primary"
                                  >
                                    <img
                                      src="/unlock.png"
                                      alt="Unlock"
                                      width={24}
                                      height={24}
                                    />
                                  </IconButton>
                                )
                              ) : (
                                <IconButton disabled>
                                  <img
                                    src="/loading.png"
                                    alt="Loading"
                                    width={24}
                                    height={24}
                                  />
                                </IconButton>
                              )
                            )}
                          </CardActions>
                          <Collapse in={expandedRows.includes(index)}>
                            <Box p={2}>
                              {/* Owner Info Section */}
                              {addr.contact_info?.owner_info?.length > 0 && (
                                <Box mb={2}>
                                  <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    Owners
                                  </Typography>
                                  {addr.contact_info.owner_info.map(
                                    (info, idx) =>
                                      info && (
                                        <Typography
                                          variant="body2"
                                          key={idx}
                                          sx={{ mb: 1 }}
                                        >
                                          <strong>Name:</strong> {info.name} <br />
                                          <strong>Past Address:</strong>{" "}
                                          {info.past_address} <br />
                                          <strong>Phone Number:</strong>{" "}
                                          {info.phone_number} <br />
                                          <strong>Email Address:</strong>{" "}
                                          {info.email_address} <br />
                                          <strong>Current Address:</strong>{" "}
                                          {info.current_address}
                                        </Typography>
                                      )
                                  )}
                                </Box>
                              )}

                              {/* Current Info Section */}
                              {addr.contact_info?.current_info?.length > 0 && (
                                <Box mb={2}>
                                  <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    Current Residents
                                  </Typography>
                                  {addr.contact_info.current_info.map(
                                    (info, idx) => (
                                      <Typography
                                        variant="body2"
                                        key={idx}
                                        sx={{ mb: 1 }}
                                      >
                                        <strong>Name:</strong> {info.name} <br />
                                        <strong>Past Address:</strong>{" "}
                                        {info.past_address} <br />
                                        <strong>Phone Number:</strong>{" "}
                                        {info.phone_number} <br />
                                        <strong>Email Address:</strong>{" "}
                                        {info.email_address} <br />
                                        <strong>Current Address:</strong>{" "}
                                        {info.current_address}
                                      </Typography>
                                    )
                                  )}
                                </Box>
                              )}

                              {/* Past Info Section */}
                              {addr.contact_info?.past_info?.length > 0 && (
                                <Box mb={2}>
                                  <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    Past Residents
                                  </Typography>
                                  {addr.contact_info.past_info.map(
                                    (info, idx) => (
                                      <Typography
                                        variant="body2"
                                        key={idx}
                                        sx={{ mb: 1 }}
                                      >
                                        <strong>Name:</strong> {info.name} <br />
                                        <strong>Past Address:</strong>{" "}
                                        {info.past_address} <br />
                                        <strong>Phone Number:</strong>{" "}
                                        {info.phone_number} <br />
                                        <strong>Email Address:</strong>{" "}
                                        {info.email_address} <br />
                                        <strong>Current Address:</strong>{" "}
                                        {info.current_address}
                                      </Typography>
                                    )
                                  )}
                                </Box>
                              )}
                            </Box>
                          </Collapse>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  // Desktop Table View
                  <Paper
                    className="mt-2 p-2"
                    style={{ maxHeight: "70vh", overflow: "auto" }}
                  >
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">
                            <strong>ID</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Address</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Accuracy Score</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Map</strong>
                          </TableCell>
                          <TableCell align="center"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {addresses.map((addr, index) => (
                          <React.Fragment key={index}>
                            <TableRow
                              style={{
                                backgroundColor: expandedRows.includes(index)
                                  ? "#f5f5f5"
                                  : "white",
                              }}
                            >
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="center">{addr.address}</TableCell>
                              <TableCell align="center">
                                {(addr.score * 100).toFixed(2)} %
                              </TableCell>
                              <TableCell align="center">
                                <OpenMapButton address={addr.address} />
                              </TableCell>
                              <TableCell align="center">
                                {addr.score === 1 && (
                                  !loading ? (
                                    addr.spokeo_status ? (
                                      <IconButton
                                        onClick={() => handleRowClick(index)}
                                        color="primary"
                                      >
                                        <ExpandMoreIcon
                                          style={{
                                            transform: expandedRows.includes(index)
                                              ? "rotate(180deg)"
                                              : "rotate(0deg)",
                                            transition: "transform 0.3s",
                                          }}
                                        />
                                      </IconButton>
                                    ) : (
                                      <IconButton
                                        onClick={() => unlockContactInfo(addr.id)}
                                        color="primary"
                                      >
                                        <img
                                          src="/unlock.png"
                                          alt="Unlock"
                                          width={24}
                                          height={24}
                                        />
                                      </IconButton>
                                    )
                                  ) : (
                                    <IconButton disabled>
                                      <img
                                        src="/loading.png"
                                        alt="Loading"
                                        width={24}
                                        height={24}
                                      />
                                    </IconButton>
                                  )
                                )}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                colSpan={5}
                                style={{ padding: 0, borderBottom: "none" }}
                              >
                                <Collapse
                                  in={expandedRows.includes(index)}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Box
                                    style={{
                                      backgroundColor: "#f0f0f0",
                                      padding: "10px",
                                      border: "1px solid #ccc",
                                    }}
                                  >
                                    {/* Owner Info Section */}
                                    {addr.contact_info?.owner_info?.length > 0 && (
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell
                                              align="center"
                                              style={{
                                                fontWeight: "bold",
                                                backgroundColor: "#e0e0e0",
                                              }}
                                            >
                                              Owners
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {addr.contact_info.owner_info.map(
                                            (info, idx) =>
                                              info && (
                                                <TableRow key={idx}>
                                                  <TableCell>
                                                    <strong>Name:</strong>{" "}
                                                    {info.name} <br />
                                                    <strong>Past Address:</strong>{" "}
                                                    {info.past_address} <br />
                                                    <strong>Phone Number:</strong>{" "}
                                                    {info.phone_number} <br />
                                                    <strong>Email Address:</strong>{" "}
                                                    {info.email_address} <br />
                                                    <strong>Current Address:</strong>{" "}
                                                    {info.current_address}
                                                  </TableCell>
                                                </TableRow>
                                              )
                                          )}
                                        </TableBody>
                                      </Table>
                                    )}

                                    {/* Current Info Section */}
                                    {addr.contact_info?.current_info?.length > 0 && (
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell
                                              align="center"
                                              style={{
                                                fontWeight: "bold",
                                                backgroundColor: "#e0e0e0",
                                              }}
                                            >
                                              Current Residents
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {addr.contact_info.current_info.map(
                                            (info, idx) => (
                                              <TableRow key={idx}>
                                                <TableCell>
                                                  <strong>Name:</strong> {info.name}{" "}
                                                  <br />
                                                  <strong>Past Address:</strong>{" "}
                                                  {info.past_address} <br />
                                                  <strong>Phone Number:</strong>{" "}
                                                  {info.phone_number} <br />
                                                  <strong>Email Address:</strong>{" "}
                                                  {info.email_address} <br />
                                                  <strong>Current Address:</strong>{" "}
                                                  {info.current_address}
                                                </TableCell>
                                              </TableRow>
                                            )
                                          )}
                                        </TableBody>
                                      </Table>
                                    )}

                                    {/* Past Info Section */}
                                    {addr.contact_info?.past_info?.length > 0 && (
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell
                                              align="center"
                                              style={{
                                                fontWeight: "bold",
                                                backgroundColor: "#e0e0e0",
                                              }}
                                            >
                                              Past Residents
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {addr.contact_info.past_info.map(
                                            (info, idx) => (
                                              <TableRow key={idx}>
                                                <TableCell>
                                                  <strong>Name:</strong> {info.name}{" "}
                                                  <br />
                                                  <strong>Past Address:</strong>{" "}
                                                  {info.past_address} <br />
                                                  <strong>Phone Number:</strong>{" "}
                                                  {info.phone_number} <br />
                                                  <strong>Email Address:</strong>{" "}
                                                  {info.email_address} <br />
                                                  <strong>Current Address:</strong>{" "}
                                                  {info.current_address}
                                                </TableCell>
                                              </TableRow>
                                            )
                                          )}
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
                )}
              </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No addresses available.
                </Typography>
              )}
          </Grid>
        </Grid>
      </div>
    </>
  );
}
