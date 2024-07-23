"use client"
import { Divider, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { alertService } from "@/services/alerts";

export default function Page() {
    const { id, aid } = useParams();

    const [alert, setAlert] = useState<any>();
    const [addresses, setAddresses] = useState<any[]>([]) // Updated to handle address objects

    useEffect(() => {
        fetchAlertsData();
    }, [id, aid])

    const fetchAlertsData = async () => {
        const res = await alertService.getAlertsById({ alert_id: Number(aid), scanner_id: Number(id) });
        setAlert(res.alert);
        setAddresses(res.addresses);
        console.log(res);
    }

    return (
        <>
            <div>
                <p className="text-xl font-semibold">Alert #{id}</p>
                <p className="text-gray-700 text-[13px]">Cook, Illinois (Chicago Fire - Digital)</p>

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
                                {/* [...] {alert?.description.slice(10, alert?.description.length - 10)} [...] */}
                                {alert?.description}
                            </p>

                            <Divider sx={{ margin: '18px 0px' }} />

                            <p className="text-[13px] text-gray-700">June 7, 2024, 11 p.m. IST</p>

                            <Divider sx={{ margin: '18px 0px' }} />

                            <div>
                                <p className="text-[12px] text-gray-600">
                                    This data is a realtime snapshot from the city's fire dispatch website/channels.
                                </p>

                                <p className="text-[12px] text-gray-600 mt-6">
                                    When the city reports engines being dispatched to a structure fire, we monitor how long they are on scene.
                                    If they are there long enough to indicate a real fire, we create this alert.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <p className="text-xl font-bold mb-[2px]">Location</p>
                        <Divider />

                        <p className="text-[17px] mb-[2px] mt-4"> <span className="font-bold mr-4"> Known Address: </span> <span style={{fontStyle:"italic"}}>{alert?.address}</span></p>
                        <p className="text-[17px] font-bold mb-[2px] mt-4">Possible Addresses: </p>
                        <Paper className="mt-2 p-2">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" style={{fontSize: "16px", fontWeight: "bold"}}>ID</TableCell>
                                        <TableCell align="center" style={{fontSize: "16px", fontWeight: "bold"}}>Address</TableCell>
                                        <TableCell align="center" style={{fontSize: "16px", fontWeight: "bold"}}>Accuracy Score</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {addresses.map((addr, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center" >{index+1}</TableCell>
                                            <TableCell align="center" >{addr?.address}</TableCell>
                                            <TableCell align="center" >{addr?.score * 100} %</TableCell>
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