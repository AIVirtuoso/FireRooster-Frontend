"use client";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import { AlertObject } from "@/services/types/alert.type";
import {
  House,
  LocalFireDepartment,
  LocalPolice,
  MedicalInformation,
  MiscellaneousServices,
  Radio,
} from "@mui/icons-material";
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  TablePagination,
  TextField,
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AlertPageProps {
  data: AlertObject[];
  page: number;
  search: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filterAlert: string;
  handleInfoChange?: (event: SelectChangeEvent) => void;
  scanner_id?: number;
  rowsPerPage: number;
  totalPages: number;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangePage: (event: unknown, newPage: number) => void;
  selectedFrom: Date | null;
  selectedTo: Date | null;
  handleDateChange: (event: unknown, type: "from" | "to", date: Date) => void;
}

export function AlertPage({
  data,
  page,
  search,
  handleSearchChange,
  filterAlert,
  handleInfoChange,
  scanner_id,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  totalPages,
  selectedFrom,
  selectedTo,
  handleDateChange,
}: AlertPageProps) {
  const router = useRouter();

  const { isAuth } = useCheckAuth();
  const StyledTableRow = styled(TableRow)(() => ({
    td: { backgroundColor: "white" },
    th: { backgroundColor: "white" },
  }));
  const StyledTableHeaderRow = styled(TableRow)(() => ({
    th: {
      fontSize: ".8rem",
      fontWeight: "bold",
    },
  }));

  const handleRowClick = (rowData: any) => {
    router.push(
      `/dashboard/scanners/${rowData.alert.scanner_id}/alert/${rowData.alert.sub_category}/${rowData.alert.id}`
    );
  };

  useEffect(() => {
    if (!isAuth) router.push("/auth/login");
  }, [isAuth]);

  return (
    <>
      <div className="mb-4 p-4 bg-white rounded">
        <div className="font-semibold text-xl text-coolGray-800">Alerts</div>
        <div className="flex mt-6 gap-2">
          <div className="w-48">
            <FormControl size="small" fullWidth>
              <TextField
                size="small"
                onChange={handleSearchChange}
                value={search}
                name="search"
                label="Search alerts"
              />
            </FormControl>
          </div>
          {!(scanner_id !== undefined) && (
            <div className="w-48">
              <FormControl size="small" fullWidth>
                <InputLabel id="alert-filter-label">Select alert</InputLabel>
                <Select
                  labelId="alert-filter-label"
                  id="alert-filter"
                  label="Select alert"
                  value={filterAlert}
                  onChange={handleInfoChange}
                  name="alert"
                >
                  <MenuItem value={"ALL"} selected>
                    <span className="mx-auto">ALL</span>
                  </MenuItem>
                  <MenuItem value={"Fire Alerts"}>
                    <LocalFireDepartment color="warning" className="mr-2" />
                    Fire Alerts
                  </MenuItem>
                  <MenuItem value={"Police Dispatch"}>
                    <LocalPolice color="warning" className="mr-2" />
                    Police Dispatch
                  </MenuItem>
                  <MenuItem value={"Medical Emergencies"}>
                    <MedicalInformation color="warning" className="mr-2" />
                    Medical Emergencies
                  </MenuItem>
                  <MenuItem value={"Miscellaneous (MISC)"}>
                    <MiscellaneousServices color="warning" className="mr-2" />
                    Miscellaneous (MISC)
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
          <div className="w-48 custom-date-picker-wrapper">
            <DatePicker
              selected={selectedFrom}
              onChange={(date, e) => handleDateChange(e, "from", date as Date)}
              placeholderText="From"
              isClearable
              customInput={
                <TextField size="small" label="From" variant="outlined" />
              }
              className="custom-datepicker"
              popperClassName="datepicker-popper"
            />
          </div>
          <div className="w-48 custom-date-picker-wrapper">
            <DatePicker
              selected={selectedTo}
              onChange={(date, e) => handleDateChange(e, "to", date as Date)}
              placeholderText="To"
              isClearable
              customInput={
                <TextField size="small" label="To" variant="outlined" />
              }
              className="custom-datepicker"
              popperClassName="datepicker-popper"
            />
          </div>
        </div>
      </div>
      <Divider />
      <Paper sx={{ width: "100%" }} className="mt-6">
        <TableContainer sx={{ maxHeight: "70vh" }}>
          <Table
            sx={{
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
              sx={{ maxHeight: "calc(50vh - 112px)", overflowY: "auto" }}
            >
              {data?.map((row, i) => (
                <StyledTableRow key={row.alert.id} className="cursor-pointer">
                  <TableCell onClick={() => handleRowClick(row)}>
                    {row.alert.category == "Fire Alerts" && (
                      <LocalFireDepartment color="warning" />
                    )}
                    {row.alert.category == "Police Dispatch" && (
                      <LocalPolice color="warning" />
                    )}
                    {row.alert.category == "Medical Emergencies" && (
                      <MedicalInformation color="warning" />
                    )}
                    {row.alert.category == "Miscellaneous (MISC)" && (
                      <MiscellaneousServices color="warning" />
                    )}
                  </TableCell>
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
