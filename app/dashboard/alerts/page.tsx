"use client";
import { useCheckAuth } from "@/hooks/useCheckAuth";
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
import { useEffect, useState } from "react";

export default function Page() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterAlert, setFilterAlert] = useState("");
  const router = useRouter();

  const { isAuth } = useCheckAuth();
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const rows = [
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

  useEffect(() => {
    if (!isAuth) router.push("/auth/login");
  }, [isAuth]);

  return (
    <>
      <div className="flex justify-between mb-4 items-center p-4 bg-white rounded">
        <div className="font-semibold text-xl text-coolGray-800">Alerts</div>
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
      </div>
      <Divider />
      <Paper sx={{ width: "100%" }} className="mt-6">
        <TableContainer>
          <Table
            sx={{
              minWidth: 1450,
              overflowX: "scroll",
              marginBottom: "20px",
            }}
            aria-label="simple table"
          >
            <TableHead>
              <StyledTableHeaderRow>
                <TableCell className="uppercase">
                  <div className="font-bold">Alert</div>
                </TableCell>
                <TableCell></TableCell>
                <TableCell align="center" className="uppercase">
                  <div className="font-bold">Address</div>
                </TableCell>
                <TableCell align="center" className="uppercase">
                  <div className="font-bold">Recorded</div>
                </TableCell>
                <TableCell align="center" className="uppercase">
                  <div className="font-bold">Type</div>
                </TableCell>
                <TableCell align="center" className="uppercase">
                  <div className="font-bold">Source</div>
                </TableCell>
              </StyledTableHeaderRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow
                  key={row.alertName}
                  className="cursor-pointer"
                  onClick={() => router.push(`/dashboard/scanners/${row.id}`)}
                >
                  <TableCell>
                    <LocalFireDepartment color="warning" />
                  </TableCell>
                  <TableCell scope="row">{row.alertName}</TableCell>
                  <TableCell align="center">{row.address}</TableCell>
                  <TableCell align="center">
                    <div className="font-bold">{row.recorded}</div>
                  </TableCell>
                  <TableCell align="center">
                    <House />
                  </TableCell>
                  <TableCell align="center">
                    <Radio />
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
