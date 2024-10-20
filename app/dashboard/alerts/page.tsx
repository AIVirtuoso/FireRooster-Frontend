"use client";
import { AlertPage } from "@/components/alert/AlertPage";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hooks";
import { alertService } from "@/services/alerts";
import { AlertObject } from "@/services/types/alert.type";
import { setPageInfo } from "@/store/slices/scanner.slice";
import { useStore } from "@/store/StoreProvider";
import { SelectChangeEvent } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<AlertObject[]>([]);
  const pageInfo = useAppSelector((state) => state.scanner.pageInfo);
  const [page, setPage] = useState(pageInfo?.pageNo || 0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const {
    headSearch,
    setHeadSearch,
    decSearch,
    setDecSearch,
    currentCategory,
    setCurrentCategory,
    currentStars,
    setCurrentStars,
    alertIdSearch,
    setAlertIdSearch,
    selectedFrom,
    setSelectedFrom,
    selectedTo,
    setSelectedTo
  } = useStore();
  

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchAlertsData();
  }, [
    page,
    rowsPerPage,
    totalPages,
    headSearch,
    decSearch,
    currentCategory,
    selectedFrom,
    selectedTo,
    currentStars,
    alertIdSearch
  ]);

  const fetchAlertsData = async () => {
    const res = await alertService.getAllAlerts({
      limit: rowsPerPage,
      page: page + 1,
      headSearch,
      decSearch,
      alertIdSearch,
      category: String(currentCategory == "ALL" ? "" : currentCategory),
      selected_from: selectedFrom,
      selected_to: selectedTo,
      stars: currentStars
    });
    setData(res.alerts);
    setTotalPages(res.pagination.total);
  };

  const handleInfoChange = (event: SelectChangeEvent) => {
    const fAlert = event.target.value;
    setCurrentCategory(fAlert);
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

  const handleHeadSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setHeadSearch(value);
  };
  const handleDecSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDecSearch(value);
  };
  const handleAlertIdSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '' || /^\d+$/.test(value)) {  
      setAlertIdSearch(value === '' ? 0 : parseInt(value, 10)); // Convert to a number  
    }  
  };

  const handleDateChange = (
    event: unknown,
    type: "from" | "to",
    date: Date
  ) => {
    if (type === "from") setSelectedFrom(date);
    else setSelectedTo(date);
  };

  const handleClickStars = (index: number) => {
    console.log("index: ", index)
    setCurrentStars(index);
  }

  return (
    <>
      <AlertPage
        data={data}
        page={page}
        headSearch={headSearch}
        decSearch={decSearch}
        alertIdSearch={alertIdSearch}
        handleHeadSearchChange={handleHeadSearchChange}
        handleDecSearchChange={handleDecSearchChange}
        handleAlertIdSearchChange={handleAlertIdSearchChange}
        filterAlert={currentCategory}
        handleInfoChange={handleInfoChange}
        handleClickStars={handleClickStars}
        currentStars={currentStars}
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
