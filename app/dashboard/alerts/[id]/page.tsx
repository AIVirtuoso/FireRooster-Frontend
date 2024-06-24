"use client"
import { AlertPage } from "@/components/alert/AlertPage";
import { rows } from "../page";
import { useParams } from "next/navigation";

export default function Page() {
    const { id } = useParams<{ id: string} >();
    
    return (
      <>
        <AlertPage data={rows} />
      </>
    );
  }
  