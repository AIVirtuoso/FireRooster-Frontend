"use client"
import { AlertPage } from "@/components/alert/AlertPage";
import { alertService } from "@/services/alerts";
import { Alert } from "@/services/types/alert.type";
import { useEffect, useState } from "react";


export default function Page() {
    const [data, setData] = useState<Alert[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchAlertsData();
    }, [page, rowsPerPage, totalPages])

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
  