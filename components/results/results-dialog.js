import { useContext } from "react";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import NotificationContext from "../../store/notification-context";
import { useRouter } from "next/router";

export default function ResultsDialog({ open, raport, onClose }) {
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();

  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  };

  const handleDeleteRaport = async () => {
    onClose();

    if (!raport?._id) {
      return;
    }

    notificationCtx.showNotification({
      title: "Usuwanie raportu...",
      message: "Raport jest usuwany z serwera",
      status: "pending",
    });

    try {
      const response = await fetch(
        `/api/raport/raport?id=${encodeURIComponent(raport._id)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Request failed");
      }

      await response.json();

      notificationCtx.showNotification({
        title: "Sukces!",
        message: "Raport został pomyślnie usunięty",
        status: "success",
      });

      router.push("/");
    } catch (error) {
      notificationCtx.showNotification({
        title: "Błąd!",
        message: "Coś poszło nie tak podczas usuwania raportu",
        status: "error",
      });
    }
  };

  if (!raport) {
    return (
      <Dialog fullScreen open={open} onClose={onClose}>
        <DialogTitle className="bg-page2 font-typewriter">
          Szczegóły raportu
        </DialogTitle>
        <DialogContent className="bg-page1">
          <div className="flex justify-center mt-6 mb-4 gap-4 flex-wrap">
            <button
              onClick={onClose}
              className="w-full max-w-40 py-3 rounded-xl bg-page5 text-white font-semibold hover:opacity-90 transition duration-200 px-20"
            >
              Zamknij
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { flowStatistics, dataStatistics, sensitiveDate } = raport;

  const avgSlot = flowStatistics?.averageMessagesPerSlot;
  const maxSlot = flowStatistics?.maxMessagesPerSlot;

  const showAvg = !!avgSlot?.selected;
  const showMax = !!maxSlot?.selected;

  const ds = dataStatistics || {};

  const tempStat = ds.numberOfEntriesAboutTemperature;
  const humStat = ds.numberOfEntriesAboutHumidity;
  const avgLenStat = ds.averageMessageLengthChars;
  const avgLinesStat = ds.averageMessageLines;
  const invalidStat = ds.invalidJsonCount;
  const validStat = ds.validJsonCount;
  const emptyStat = ds.emptyMessages;
  const receivedStat = ds.messagesRecieved;

  const baseMessages = receivedStat?.value ?? 0;
  const baseMaxForAxis = baseMessages > 0 ? baseMessages * 1.1 : 1;

  const makeBarConfig = (stat) => {
    if (!stat) return null;
    const value = stat.value ?? 0;
    const maxDomain = Math.max(baseMaxForAxis, value * 1.1 || 0);
    return {
      data: [{ name: "", value }],
      domain: [0, maxDomain || 1],
      value,
    };
  };

  const showTemp = !!tempStat?.selected;
  const showHum = !!humStat?.selected;

  const showAvgLen = !!avgLenStat?.selected;
  const showAvgLines = !!avgLinesStat?.selected;
  const showInvalid = !!invalidStat?.selected;
  const showValid = !!validStat?.selected;
  const showEmpty = !!emptyStat?.selected;
  const showReceived = !!receivedStat?.selected;

  const showAnyDataStats =
    showTemp ||
    showHum ||
    showAvgLen ||
    showAvgLines ||
    showInvalid ||
    showValid ||
    showEmpty ||
    showReceived;

  const avgLenBar = makeBarConfig(avgLenStat);
  const avgLinesBar = makeBarConfig(avgLinesStat);
  const invalidBar = makeBarConfig(invalidStat);
  const validBar = makeBarConfig(validStat);
  const emptyBar = makeBarConfig(emptyStat);
  const receivedBar = makeBarConfig(receivedStat);

  const showPieValidInvalid = showInvalid && showValid;

  const pieDataValidInvalid = showPieValidInvalid
    ? [
        { name: "Poprawne", value: validStat.value ?? 0 },
        { name: "Niepoprawne", value: invalidStat.value ?? 0 },
      ]
    : [];

  const PIE_COLORS = ["#E2CEB1", "#734128"];

  const sd = sensitiveDate || {};

  const personal = sd.containsPersonalData;
  const email = sd.containsEmailData;
  const tel = sd.containsTelephoneData;
  const loc = sd.containsLocalizationData;
  const bank = sd.containsBankingData;
  const pass = sd.containsPassData;

  const showPersonal = !!personal?.selected;
  const showEmail = !!email?.selected;
  const showTel = !!tel?.selected;
  const showLoc = !!loc?.selected;
  const showBank = !!bank?.selected;
  const showPass = !!pass?.selected;

  const anySensitiveSelected =
    showPersonal || showEmail || showTel || showLoc || showBank || showPass;

  const renderRequiredValues = (requiredValues) => {
    const entries = Object.entries(requiredValues || {});
    if (entries.length === 0) {
      return (
        <p className="text-xs text-page5/70 mt-2">
          Brak zdefiniowanych szukanych fraz.
        </p>
      );
    }

    return (
      <div className="mt-2 text-xs">
        <p className="font-semibold mb-1">Szukane frazy:</p>
        <ul className="list-disc list-inside space-y-1">
          {entries.map(([group, values]) => (
            <li key={group}>
              <span className="font-semibold mr-1">{group}:</span>
              <span className="font-mono">
                {Array.isArray(values) ? values.join(", ") : "—"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderParsedList = (parsedJSON) => {
    if (!parsedJSON || parsedJSON.length === 0) {
      return (
        <p className="text-xs text-page5/70 mt-2">
          Brak dopasowanych rekordów dla zadanych kryteriów.
        </p>
      );
    }

    return (
      <div className="mt-3 space-y-2 max-h-64 overflow-auto bg-page1/40 rounded-md p-2 border border-page5/40">
        {parsedJSON.map((item, idx) => (
          <div
            key={idx}
            className="bg-page1 rounded-md border border-page5/40 p-2 text-[11px]"
          >
            <div className="font-semibold mb-1">Rekord {idx + 1}</div>
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(item, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogTitle className="bg-page2 font-typewriter">
        Szczegóły raportu
      </DialogTitle>
      <DialogContent className="bg-page1">
        <Box className="max-w-5xl mx-auto mt-4 bg-page1 text-page5 rounded-lg p-4 font-typewriter text-sm">
          <h3 className="text-xl font-bold mb-2">
            Raport – {raport.channel || "Brak kanału"}
          </h3>
          <p className="mb-4 text-xs text-page5/80">
            <span className="font-semibold">Start:</span>{" "}
            {formatDate(raport.startTime)} |{" "}
            <span className="font-semibold">Koniec:</span>{" "}
            {formatDate(raport.endTime)}
          </p>

          <section className="mb-8">
            <h4 className="text-lg font-semibold mb-3">Statystyki danych</h4>

            {!showAnyDataStats && (
              <p className="text-page5/80">
                Dla tego badania statystyki danych nie były zbierane.
              </p>
            )}

            {showAnyDataStats && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showReceived && receivedBar && (
                    <div className="bg-page3 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px] min-h-[12rem]">
                      <h5 className="font-semibold mb-2">
                        Otrzymanych wiadomości
                      </h5>
                      <p className="w-full h-full text-5xl font-extrabold pb-5 flex justify-center items-center">
                        <span className="font-semibold">
                          {receivedBar.value}
                        </span>
                      </p>
                    </div>
                  )}

                  {showEmpty && emptyBar && (
                    <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px] min-h-[12rem]">
                      <h5 className="font-semibold mb-2">
                        Ilość wiadomości pustych
                      </h5>
                      <p className="w-full h-full text-5xl font-extrabold pb-5 flex justify-center items-center">
                        <span className="font-semibold">{emptyBar.value}</span>
                      </p>
                    </div>
                  )}

                  {showAvgLen && avgLenBar && (
                    <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px] min-h-[12rem]">
                      <h5 className="font-semibold mb-2">
                        Przeciętna ilość znaków we wpisie w wiadomości
                      </h5>
                      <p className="w-full h-full text-5xl font-extrabold pb-5 flex justify-center items-center">
                        <span className="font-semibold">
                          {avgLenBar.value.toFixed
                            ? avgLenBar.value.toFixed(2)
                            : avgLenBar.value}
                        </span>
                      </p>
                    </div>
                  )}

                  {showAvgLines && avgLinesBar && (
                    <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px] min-h-[12rem]">
                      <h5 className="font-semibold mb-2">
                        Ilość wpisów w przeciętnej wiadomości
                      </h5>
                      <p className="w-full h-full text-5xl font-extrabold pb-5 flex justify-center items-center">
                        <span className="font-semibold">
                          {avgLinesBar.value.toFixed
                            ? avgLinesBar.value.toFixed(2)
                            : avgLinesBar.value}
                        </span>
                      </p>
                    </div>
                  )}

                  {showValid && validBar && (
                    <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px]">
                      <h5 className="font-semibold mb-2">
                        Ilość wiadomości poprawnych (JSON parse success)
                      </h5>
                      <p className="text-sm mb-2">
                        Wartość:{" "}
                        <span className="font-semibold">{validBar.value}</span>
                      </p>
                      <div className="w-full h-40 bg-page1 rounded-md">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={validBar.data} margin={{ top: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" hide />
                            <YAxis domain={validBar.domain} />
                            <Tooltip />
                            <Bar dataKey="value" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {showInvalid && invalidBar && (
                    <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px]">
                      <h5 className="font-semibold mb-2">
                        Ilość wiadomości niepoprawnych (JSON parse error)
                      </h5>
                      <p className="text-sm mb-2">
                        Wartość:{" "}
                        <span className="font-semibold">
                          {invalidBar.value}
                        </span>
                      </p>
                      <div className="w-full h-40 bg-page1 rounded-md">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={invalidBar.data} margin={{ top: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" hide />
                            <YAxis domain={invalidBar.domain} />
                            <Tooltip />
                            <Bar dataKey="value" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>

                {showPieValidInvalid && (
                  <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px]">
                    <h5 className="font-semibold mb-2">
                      Udział poprawnych i niepoprawnych wiadomości
                    </h5>
                    <div className="w-full h-64 bg-page1 rounded-md flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieDataValidInvalid}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {pieDataValidInvalid.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <div className="w-full h-1 rounded-lg"></div>
                <div className="w-full h-1 bg-page5 rounded-lg"></div>
                <div className="w-full h-1 "></div>

                {(showTemp || showHum) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {showTemp && (
                      <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px]">
                        <h5 className="font-semibold mb-2">
                          Dane o temperaturze
                        </h5>
                        <p className="text-sm">
                          Ilość wpisów zawierających dane dotyczące temperatury:{" "}
                          <span className="font-semibold">
                            {tempStat.value}
                          </span>
                        </p>
                        <p className="text-xs mt-1">
                          Szukanymi frazami były:{" "}
                          <span className="font-mono">
                            {Array.isArray(tempStat.testedValues)
                              ? tempStat.testedValues.join(", ")
                              : "—"}
                          </span>
                        </p>
                      </div>
                    )}

                    {showHum && (
                      <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px]">
                        <h5 className="font-semibold mb-2">
                          Dane o wilgotności
                        </h5>
                        <p className="text-sm">
                          Ilość wpisów zawierających dane dotyczące wilgotności:{" "}
                          <span className="font-semibold">{humStat.value}</span>
                        </p>
                        <p className="text-xs mt-1">
                          Szukanymi frazami były:{" "}
                          <span className="font-mono">
                            {Array.isArray(humStat.testedValues)
                              ? humStat.testedValues.join(", ")
                              : "—"}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="mb-8">
            <h4 className="text-lg font-semibold mb-3">Statystyki ruchu</h4>

            {!showAvg && !showMax && (
              <p className="text-page5/80">
                Dla tego badania statystyki ruchu nie były zbierane.
              </p>
            )}

            {(showAvg || showMax) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {showAvg && (
                  <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px]">
                    <h5 className="font-semibold mb-2">
                      Średnia liczba wiadomości
                    </h5>
                    <p className="text-sm">
                      Średnia liczba wiadomości w przedziale{" "}
                      <span className="font-semibold">
                        {avgSlot.seconds ?? 0} sekund
                      </span>{" "}
                      wynosi:{" "}
                      <span className="font-semibold">
                        {typeof avgSlot.value === "number"
                          ? avgSlot.value.toFixed(2)
                          : avgSlot.value}
                      </span>
                      .
                    </p>
                  </div>
                )}

                {showMax && (
                  <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px]">
                    <h5 className="font-semibold mb-2">
                      Maksymalna liczba wiadomości
                    </h5>
                    <p className="text-sm mb-1">
                      Maksymalna liczba wiadomości w przedziale{" "}
                      <span className="font-semibold">
                        {maxSlot.seconds ?? 0} sekund
                      </span>{" "}
                      wyniosła:{" "}
                      <span className="font-semibold">{maxSlot.value}</span>.
                    </p>
                    <p className="text-xs mt-2">
                      <span className="font-semibold">Czas wystąpienia:</span>
                      <br />
                      start:{" "}
                      <span className="font-mono">
                        {maxSlot.start ? formatDate(maxSlot.start) : "—"}
                      </span>
                      <br />
                      koniec:{" "}
                      <span className="font-mono">
                        {maxSlot.end ? formatDate(maxSlot.end) : "—"}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="mb-4">
            <h4 className="text-lg font-semibold mb-3">Dane wrażliwe</h4>

            {!anySensitiveSelected && (
              <p className="text-page5/80">
                Dla tego badania dane wrażliwe nie były analizowane lub żaden z
                typów danych wrażliwych nie został zaznaczony.
              </p>
            )}

            {anySensitiveSelected && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {showPersonal && (
                  <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px]">
                    <h5 className="font-semibold mb-2">
                      Dane zawierające personalne informacje
                    </h5>
                    {renderRequiredValues(personal.requiredValues)}
                    {renderParsedList(personal.parsedJSON)}
                  </div>
                )}

                {showEmail && (
                  <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px]">
                    <h5 className="font-semibold mb-2">
                      Dane zawierające dane e-mail
                    </h5>
                    {renderRequiredValues(email.requiredValues)}
                    {renderParsedList(email.parsedJSON)}
                  </div>
                )}

                {showTel && (
                  <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px]">
                    <h5 className="font-semibold mb-2">
                      Dane zawierające informacje telefoniczne
                    </h5>
                    {renderRequiredValues(tel.requiredValues)}
                    {renderParsedList(tel.parsedJSON)}
                  </div>
                )}

                {showLoc && (
                  <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px]">
                    <h5 className="font-semibold mb-2">
                      Dane zawierające informacje lokalizacyjne
                    </h5>
                    {renderRequiredValues(loc.requiredValues)}
                    {renderParsedList(loc.parsedJSON)}
                  </div>
                )}

                {showBank && (
                  <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px]">
                    <h5 className="font-semibold mb-2">
                      Dane zawierające informacje bankowe
                    </h5>
                    {renderRequiredValues(bank.requiredValues)}
                    {renderParsedList(bank.parsedJSON)}
                  </div>
                )}

                {showPass && (
                  <div className="bg-page2 text-pageMenu rounded-lg p-4 shadow-xl min-w-[260px]">
                    <h5 className="font-semibold mb-2">
                      Dane zawierające sekrety
                    </h5>
                    {renderRequiredValues(pass.requiredValues)}
                    {renderParsedList(pass.parsedJSON)}
                  </div>
                )}
              </div>
            )}
          </section>
        </Box>

        <div className="flex justify-center mt-6 mb-4 gap-4 flex-wrap">
          <button
            onClick={onClose}
            className="w-full md:w-[50%] max-w-40 py-3 rounded-xl bg-page4 text-white font-semibold hover:opacity-90 transition duration-200 px-20"
          >
            Zamknij
          </button>
          {raport?._id && (
            <button
              onClick={handleDeleteRaport}
              className="w-full md:w-[50%] max-w-40 py-3 rounded-xl bg-page5 text-white font-semibold hover:opacity-90 transition duration-200 px-20"
            >
              Usuń raport
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
