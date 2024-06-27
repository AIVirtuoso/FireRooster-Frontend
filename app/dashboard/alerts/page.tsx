"use client"
import { AlertPage } from "@/components/alert/AlertPage";
import { alertService } from "@/services/alerts";
import { Alert } from "@/services/types/alert.type";
import { useEffect, useState } from "react";

function createData(
  id: number,
  alert: string,
  alertName: string,
  address: string,
  recorded: string,
  type: string,
  source: string
) {
  return { id, alert, alertName, address, recorded, type, source };
}


export const rows = [
  createData(
    1,
    "Fire",
    "Alert #11",
    "39300 North Cedarcrest Drive, Lake Villa, IL 60046-5202, USA",
    "03/19/24 07:45 EET",
    "Home",
    "Stream"
  ),
  createData(
    2,
    "Fire",
    "Alert #12",
    "39300 North Cedarcrest Drive, Lake Villa, IL 60046-5202, USA",
    "03/19/24 07:45 EET",
    "Home",
    "Stream"
  ),
  createData(
    3,
    "Fire",
    "Alert #13",
    "39300 North Cedarcrest Drive, Lake Villa, IL 60046-5202, USA",
    "03/19/24 07:45 EET",
    "Home",
    "Stream"
  ),
  createData(
    4,
    "Fire",
    "Alert #14",
    "39300 North Cedarcrest Drive, Lake Villa, IL 60046-5202, USA",
    "03/19/24 07:45 EET",
    "Home",
    "Stream"
  ),
  createData(
    5,
    "Fire",
    "Alert #15",
    "39300 North Cedarcrest Drive, Lake Villa, IL 60046-5202, USA",
    "03/19/24 07:45 EET",
    "Home",
    "Stream"
  ),
  createData(
    6,
    "Fire",
    "Alert #16",
    "39300 North Cedarcrest Drive, Lake Villa, IL 60046-5202, USA",
    "03/19/24 07:45 EET",
    "Home",
    "Stream"
  ),
];

export type AlertDataType= typeof rows;

export default function Page() {
    const [data, setData] = useState<Alert[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchAlertsData();
    }, [page, rowsPerPage])

    const fetchAlertsData = async () => {
        const res = await alertService.getAllAlerts({limit: rowsPerPage, page: page+1 });
        setData(res.data);
        setTotalPages(res.pagination.total);
    }

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    return (
      <>
        <AlertPage 
            data={data} 
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPage={rowsPerPage}
            totalPages={totalPages}
        />
      </>
    );
  }
  