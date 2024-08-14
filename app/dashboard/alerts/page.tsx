"use client";
import { AlertPage } from "@/components/alert/AlertPage";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hooks";
import { alertService } from "@/services/alerts";
import { AlertObject } from "@/services/types/alert.type";
import { setPageInfo } from "@/store/slices/scanner.slice";
import { SelectChangeEvent } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<AlertObject[]>([]);
  const pageInfo = useAppSelector((state) => state.scanner.pageInfo);
  const [page, setPage] = useState(pageInfo?.pageNo || 0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filterAlert, setFilterAlert] = useState("ALL");

  const [selectedFrom, setSelectedFrom] = useState<Date | null>(null);
  const [selectedTo, setSelectedTo] = useState<Date | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchAlertsData();
  }, [
    page,
    rowsPerPage,
    totalPages,
    search,
    filterAlert,
    selectedFrom,
    selectedTo,
  ]);

  const fetchAlertsData = async () => {
    const res = await alertService.getAllAlerts({
      limit: rowsPerPage,
      page: page + 1,
      search,
      category: String(filterAlert == "ALL" ? "" : filterAlert),
      selected_from: selectedFrom,
      selected_to: selectedTo,
    });
    setData(res.alerts);
    setTotalPages(res.pagination.total);
  };

  const handleInfoChange = (event: SelectChangeEvent) => {
    const fAlert = event.target.value;
    setFilterAlert(fAlert);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    dispatch(
      setPageInfo({ pageName: pageInfo?.pageName || "", pageNo: newPage })
    );
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

  return (
    <>
      <AlertPage
        data={data}
        page={page}
        search={search}
        handleSearchChange={handleSearchChange}
        filterAlert={filterAlert}
        handleInfoChange={handleInfoChange}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        selectedFrom={selectedFrom}
        selectedTo={selectedTo}
        handleDateChange={handleDateChange}
      />
    </>
  );
}
