"use client";
import { useAppSelector } from "@/hooks/store.hooks";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import { AlertObject } from "@/services/types/alert.type";
import { House, LocalFireDepartment, Radio } from "@mui/icons-material";
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  TablePagination,
  styled,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface AlertPageProps {
  data: AlertObject[];
  page: number;
  scanner_id?: number;
  rowsPerPage: number;
  totalPages: number;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangePage: (event: unknown, newPage: number) => void;
}

export function AlertPage({
  data,
  page,
  scanner_id,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  totalPages,
}: AlertPageProps) {
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterAlert, setFilterAlert] = useState("");
  const router = useRouter();

  const { isAuth } = useCheckAuth();
  // const handleChangePage = (event: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const StyledTableRow = styled(TableRow)(() => ({
    td: { backgroundColor: "white" },
    th: { backgroundColor: "white" },
    // "&:last-child td, &:last-child th": { borderBottom: "unset" },
  }));

  const StyledTableHeaderRow = styled(TableRow)(() => ({
    th: {
      fontSize: ".8rem",
      fontWeight: "bold",
    },
  }));

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterAlert(event.target.value as string);
  };

  const handleRowClick = (rowData: any) => {
    router.push(
      `/dashboard/scanners/${rowData.alert.scanner_id}/alert/${rowData.alert.sub_category}/${rowData.alert.id}`
    );
  };

  useEffect(() => {
    if (!isAuth) router.push("/auth/login");
  }, [isAuth]);
  console.log(scanner_id);
  return (
    <>
      <div className="flex justify-between mb-4 items-center p-4 bg-white rounded">
        <div className="font-semibold text-xl text-coolGray-800">Alerts</div>
        {!(scanner_id !== undefined) && (
          <div className="w-52">
            <FormControl size="small" fullWidth>
              <InputLabel id="alert-filter-label">Select alert</InputLabel>
              <Select
                labelId="alert-filter-label"
                id="alert-filter"
                label="Select alert"
                value={filterAlert}
                onChange={handleFilterChange}
              >
                <MenuItem value={""}>All alerts</MenuItem>
                <MenuItem value={"fire"}>
                  Fire alert{" "}
                  <LocalFireDepartment color="warning" className="ms-1" />
                </MenuItem>
                <MenuItem value={"police"}>Police alert</MenuItem>
                <MenuItem value={30}>Menu 3</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}
      </div>
      <Divider />

      <Paper sx={{ width: "100%" }} className="mt-6">
        <TableContainer sx={{ maxHeight: "68vh" }}>
          <Table
            sx={{
              // minWidth: 1450,
              overflowX: "scroll",
              marginBottom: "20px",
            }}
            aria-label="simple table"
          >
            <TableHead>
              <StyledTableHeaderRow>
                <TableCell
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  <div className="font-bold">Alert</div>
                </TableCell>
                <TableCell
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  Id
                </TableCell>
                <TableCell
                  align="center"
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  <div className="font-bold">Headline</div>
                </TableCell>
                <TableCell
                  align="center"
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  <div className="font-bold">Description</div>
                </TableCell>
                <TableCell
                  align="center"
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  <div className="font-bold">Address</div>
                </TableCell>
                <TableCell
                  align="center"
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  <div className="font-bold">Type</div>
                </TableCell>
                <TableCell
                  align="center"
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                  }}
                >
                  <div className="font-bold">Source</div>
                </TableCell>
              </StyledTableHeaderRow>
            </TableHead>
            <TableBody
              sx={{ maxHeight: "calc(50vh - 56px)", overflowY: "auto" }}
            >
              {data?.map((row, i) => (
                <StyledTableRow key={row.alert.id} className="cursor-pointer">
                  <TableCell onClick={() => handleRowClick(row)}>
                    <LocalFireDepartment color="warning" />
                  </TableCell>
                  {/* <TableCell scope="row">{((page * rowsPerPage) + i + 1)}</TableCell> */}
                  <TableCell scope="row" onClick={() => handleRowClick(row)}>
                    {new Date(row.alert?.dateTime).toLocaleString()}
                  </TableCell>
                  <TableCell align="center" onClick={() => handleRowClick(row)}>
                    {row.alert.headline.length > 25
                      ? row.alert.headline.slice(0, 25) + "..."
                      : row.alert.headline}
                  </TableCell>
                  <TableCell align="center" onClick={() => handleRowClick(row)}>
                    <div className="font-bold">
                      {row.alert.description.length > 130
                        ? row.alert.description.slice(0, 130) + "..."
                        : row.alert.description}
                    </div>
                  </TableCell>
                  <TableCell align="center" onClick={() => handleRowClick(row)}>
                    <div className="font-bold">{row.alert.address}</div>
                  </TableCell>
                  <TableCell align="center" onClick={() => handleRowClick(row)}>
                    <House />
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => router.push(`/dashboard/scanners`)}
                  >
                    <Radio />
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
          component="div"
          count={totalPages}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
