"use client";
import { AlertPage } from "@/components/alert/AlertPage";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { AlertObject } from "@/services/types/alert.type";
import { alertService } from "@/services/alerts";
import { SelectChangeEvent } from "@mui/material";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AlertObject[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const { sub_category } = useParams<{ sub_category: string }>();
  const [search, setSearch] = useState("");
  const [selectedFrom, setSelectedFrom] = useState<Date | null>(null);
  const [selectedTo, setSelectedTo] = useState<Date | null>(null);
  const [filterAlert, setFilterAlert] = useState("ALL");


  useEffect(() => {
    fetchAlertsData();
  }, [page, rowsPerPage, search]);

  const fetchAlertsData = async () => {
    const res = await alertService.getAllAlerts({
      limit: rowsPerPage,
      page: page + 1,
      scanner_id: Number(id),
      sub_category: sub_category,
      search: search,
    });
    setData(res.alerts);
    setTotalPages(res.pagination.total);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
  };

  const handleDateChange = (
    event: unknown,
    type: "from" | "to",
    date: Date
  ) => {
    if (type === "from") setSelectedFrom(date);
    else setSelectedTo(date);
  };

  const handleInfoChange = (event: SelectChangeEvent) => {
    const fAlert = event.target.value;
    setFilterAlert(fAlert);
  };

  return (
    <>
      <AlertPage
        data={data}
        page={page}
        search={search}
        filterAlert={filterAlert}
        handleSearchChange={handleSearchChange}
        scanner_id={Number(id)}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        selectedFrom={selectedFrom}
        selectedTo={selectedTo}
        handleDateChange={handleDateChange}
        handleInfoChange={handleInfoChange}
      />
    </>
  );
}
