"use client"
import { Divider } from "@mui/material";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();

  return (
    <>
      <div>
        <p className="text-xl font-semibold">Alert #{id}</p>
        <p className="text-gray-700 text-[13px]">Cook, Illinois (Chicago Fire - Digital)</p>

        <div className="mt-7 grid grid-cols-3 gap-10">
          <div className="col-span-1">
            <p className="text-xl font-bold mb-[2px]">Dispatch Website</p>
            <Divider />

            <div className="mt-3 bg-white rounded-md px-4 py-7 shadow-md">
              <p className="text-[17px] font-bold mb-[2px]">Dispatch Website</p>

              <p className="text-sm text-gray-600 mt-2">
                <span className="font-bold mt-2">Headline: </span> 
                Suspected Shooter In Custody After Deaths of 2 Brothers Found at House Fire 
                on Park Ave West, Highland Park
              </p>

              <p className="text-sm text-gray-600 mt-1">
                <span className="font-bold">Desc: </span> 
                ... Two people were found deceased at the scene of a house fire on Park Avenue West in Highland Park early Wednesday, June 5, 2024, and police canvassed a neighbor, showed her a picture of a [...] SEE CARDINAL NEWS 
              </p>

              <Divider sx={{ margin: '18px 0px'}} />

              <p className="text-[13px] text-gray-700">June 7, 2024, 11 p.m. IST</p>

              <Divider sx={{ margin: '18px 0px'}} />

              <div>
                <p className="text-[12px] text-gray-600">
                  This data is a realtime snapshot from the city&#39;s fire dispatch website/channels.  
                </p>

                <p className="text-[12px] text-gray-600 mt-6">
                  When the city reports engines being dispatched to a structure fire, we monitor how long they are on scene. 
                  If they are there long enough to indicate a real fire, we create this alert.
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <p className="text-xl font-bold mb-[2px]">Structure</p>
            <Divider />
          </div>
        </div>
      </div>
    </>
  );
}
