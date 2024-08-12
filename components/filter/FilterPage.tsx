"use client";
import { useCheckAuth } from "@/hooks/useCheckAuth";
import { LocalFireDepartment } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
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
import { Category } from "@/services/types/settings.type";
import { Grid } from "react-feather";

interface AlertPageProps {
  data: Category[];
  fetchAlertData: (category: string) => void;
}

export function FilterPage({ data, fetchAlertData }: AlertPageProps) {
  const [filterAlert, setFilterAlert] = useState("ALL");
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

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterAlert(event.target.value as string);
    fetchAlertData(event.target.value as string);
  };

  const [checkedRows, setCheckedRows] = useState<Set<number>>(
    new Set(data.map((row) => row.id))
  );

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
    const rowIndex = +event.currentTarget.rowIndex;
    setCheckedRows((prevCheckedRows) => {
      const newCheckedRows = new Set(prevCheckedRows);
      if (newCheckedRows.has(rowIndex)) newCheckedRows.delete(rowIndex);
      else newCheckedRows.add(rowIndex);
      return newCheckedRows;
    });
    console.log(checkedRows);
  };

  const isChecked = (id: number) => checkedRows.has(id);
  useEffect(() => {
    if (!isAuth) router.push("/auth/login");
  }, [isAuth]);

  return (
    <>
      <div className="flex justify-between mb-4 items-center p-4 bg-white rounded">
        <div className="font-semibold text-xl text-coolGray-800">Filters</div>
        <div className="flex">
          <Button variant="contained">Save</Button>
          <div className="ml-5 w-52">
            <FormControl size="small" fullWidth>
              <InputLabel id="alert-filter-label">Settings</InputLabel>
              <Select
                labelId="alert-filter-label"
                id="alert-filter"
                label="Settings"
                value={filterAlert}
                onChange={handleFilterChange}
              >
                <MenuItem value={"ALL"} selected>
                  ALL
                </MenuItem>
                <MenuItem value={"Fire Alerts"}>
                  Fire Alerts
                  <LocalFireDepartment color="warning" className="ms-1" />
                </MenuItem>
                <MenuItem value={"Police Dispatch"}>Police Dispatch</MenuItem>
                <MenuItem value={"Medical Emergencies"}>
                  Medical Emergencies
                </MenuItem>
                <MenuItem value={"Miscellaneous (MISC)"}>
                  Miscellaneous (MISC)
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <Divider />
      <Paper sx={{ width: "100%" }} className="mt-6">
        <TableContainer sx={{ maxHeight: "68vh" }}>
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
                    width: "5%",
                  }}
                >
                  <div className="font-bold">Alert</div>
                </TableCell>
                <TableCell
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                    width: "15%",
                  }}
                >
                  <div className="font-bold">Check</div>
                </TableCell>
                <TableCell
                  align="center"
                  className="uppercase"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    bgcolor: "white",
                    width: "70%",
                  }}
                >
                  <div className="font-bold">Keyword</div>
                </TableCell>
              </StyledTableHeaderRow>
            </TableHead>
            <TableBody
              sx={{ maxHeight: "calc(50vh - 56px)", overflowY: "auto" }}
            >
              {data?.map((row, i) => (
                <StyledTableRow
                  key={row.id}
                  className="cursor-pointer"
                  data-index={row.id}
                  onClick={handleRowClick}
                >
                  <TableCell>
                    <LocalFireDepartment
                      color="warning"
                      style={{ opacity: isChecked(row.id) ? 1 : 0.2 }}
                    />
                  </TableCell>
                  <TableCell scope="row">
                    <Checkbox
                      name={row.sub_category}
                      checked={checkedRows.has(row.id)}
                      readOnly
                    />
                  </TableCell>
                  <TableCell align="center">{row.sub_category}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
