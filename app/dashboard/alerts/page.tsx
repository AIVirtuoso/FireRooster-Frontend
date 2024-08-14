"use client";
import { AlertPage } from "@/components/alert/AlertPage";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hooks";
import { alertService } from "@/services/alerts";
import { AlertObject } from "@/services/types/alert.type";
import { setPageInfo } from "@/store/slices/scanner.slice";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function Page() {
  const { sub_category } = useParams<{ sub_category: string }>();
  const [data, setData] = useState<AlertObject[]>([]);
  const pageInfo = useAppSelector((state) => state.scanner.pageInfo);
  const [page, setPage] = useState(pageInfo?.pageNo || 0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchAlertsData();
  }, [page, rowsPerPage, totalPages, search]);

  const fetchAlertsData = async () => {
    const res = await alertService.getAllAlerts({
      limit: rowsPerPage,
      page: page + 1,
      search,
    });
    setData(res.alerts);
    setTotalPages(res.pagination.total);
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

  return (
    <>
      <AlertPage
        data={data}
        page={page}
        search={search}
        handleSearchChange={handleSearchChange}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
      />
    </>
  );
}
