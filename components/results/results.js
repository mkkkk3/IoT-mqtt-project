import { useState } from "react";
import ResultsDialog from "./results-dialog";

export default function Results({ raports }) {
  const [selectedRaport, setSelectedRaport] = useState(null);

  const handleOpen = (raport) => {
    setSelectedRaport(raport);
  };

  const handleClose = () => {
    setSelectedRaport(null);
  };

  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  };

  return (
    <div className="py-6 font-typewriter bg-page1">
      <h2 className="text-3xl font-extrabold tracking-wider mb-4 ms-4 text-pageMenu">
        Raporty
      </h2>

      {(!raports || raports.length === 0) && (
        <p className="text-pageMenu/70 ms-4">Brak zapisanych raportów.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-4">
        {raports?.map((raport, index) => {
          const key = raport._id?.$oid || raport._id || index;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleOpen(raport)}
              className="relative p-4 bg-page5 rounded-xl shadow-md flex flex-col items-center justify-center text-page1 hover:shadow-lg hover:-translate-y-0.5 transition transform min-h-[20rem]"
            >
              <div className="absolute w-full h-[35%] top-0 p-4">
                <div className="w-full h-full border-t-4 border-x-4 border-page1 rounded-lg"></div>
              </div>
              <div className="absolute w-full h-[35%] bottom-0 p-4">
                <div className="w-full h-full border-b-4 border-x-4 border-page1 rounded-lg"></div>
              </div>

              <div className="text-4xl font-semibold break-all text-page1 mb-4">
                {raport.channel || "Brak kanału"}
              </div>

              <div className="text-xs text-page1 text-center space-y-1">
                <div className="text-sm">
                  <span className="font-semibold">Start:</span>{" "}
                  {formatDate(raport.startTime)}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Koniec:</span>{" "}
                  {formatDate(raport.endTime)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <ResultsDialog
        open={!!selectedRaport}
        raport={selectedRaport}
        onClose={handleClose}
      />
    </div>
  );
}
