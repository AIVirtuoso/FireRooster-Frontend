"use client";
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { alertService } from "@/services/alerts";
import OpenMapButton from "@/components/googlemap/openMapButton";

export default function Page() {
  const { id, aid } = useParams();

  const [alert, setAlert] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [scanner, setScanner] = useState<any>();
  const [audio, setAudio] = useState<any>({});
  const [audioUrl, setAudioUrl] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetchAlertsData();
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
  };

  const setPlaybackRate = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };
  return (
    <>
      <div>
        <p className="text-xl font-semibold">Alert #{id}</p>
        <p className="text-gray-700 text-[13px]">
          {scanner &&
            `${scanner.county_name}, ${scanner.state_name} (${scanner.scanner_title})`}
        </p>
        <div className="mt-7 grid grid-cols-3 gap-10">
          <div className="col-span-1">
            <p className="text-xl font-bold mb-[2px]">Dispatch Website</p>
            <Divider />

            <div className="mt-3 bg-white rounded-md px-4 py-7 shadow-md">
              <p className="text-[17px] font-bold mb-[2px]">Dispatch Website</p>

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
                style={{ maxHeight: "200px", overflow: "auto" }}
              >
                <span className="font-bold">Transcript: </span>
                <span dangerouslySetInnerHTML={{ __html: audio.cleared_context === null ? audio.context : audio.cleared_context }}></span>
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

            <p className="text-[17px] mb-[2px] mt-4">
              {" "}
              <span className="font-bold mr-4"> Known Address: </span>{" "}
              <span style={{ fontStyle: "italic" }}>{alert?.address}</span>
            </p>
            <p className="text-[17px] font-bold mb-[2px] mt-4">
              Possible Addresses:{" "}
            </p>
            <Paper className="mt-2 p-2">
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addresses.map((addr, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{addr?.address}</TableCell>
                      <TableCell align="center">
                        {addr?.score * 100} %
                      </TableCell>
                      <TableCell>
                        <OpenMapButton address={addr?.address} />
                      </TableCell>
                    </TableRow>
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
