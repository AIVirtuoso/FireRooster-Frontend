import { AlertPage } from "@/components/alert/AlertPage";

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
    return (
      <>
        <AlertPage data={rows} />
      </>
    );
  }
  