"use client";
import { useEffect, useState } from "react";
import { Category } from "@/services/types/settings.type";
import { settingsService } from "@/services/settings";
import { useParams } from "next/navigation";
import { FilterPage } from "@/components/filter/FilterPage";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    fetchAlertsData(category);
  }, [page, rowsPerPage]);

  const fetchAlertsData = async (category: string) => {
    try {
      const res = await settingsService.getSubCategoriesByCategory({
        category: String(category == "ALL" ? "" : category),
      });
      setData(
        (res as Category[]).sort((a, b) => {
          if (a.id < b.id) return -1;
          else if (a.id > b.id) return 1;
          return 0;
        })
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <FilterPage data={data} fetchAlertData={fetchAlertsData} />
    </>
  );
}
