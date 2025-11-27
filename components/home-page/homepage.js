import { useRef, useState, useCallback, useContext } from "react";
import mqtt from "mqtt";
import {
  Container,
  Stack,
  FormControl,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Image from "next/image";

import FlowStatisticsSection from "./columns/flow-statistics-section";
import DataStatisticsSection from "./columns/data-statistics-section";
import SensitiveDataSection from "./columns/sensitive-data-section";

import {
  incrementMessagesReceived,
  handleValidJsonStats,
  incrementInvalidJsonCount,
  handleEmptyMessagesStats,
  handleAverageMessageLines,
  handleAverageMessageLengthChars,
  handleNumberOfEntriesAboutHumidity,
  handleNumberOfEntriesAboutTemperature,
} from "../../helpers/data-statistics-calculations-util";
import {
  handleMaxMessagesPerSlot,
  handleAverageMessagesPerSlot,
} from "../../helpers/flow-statistics-calculations-util";
import {
  handleContainsBankingData,
  handleContainsEmailData,
  handleContainsLocalizationData,
  handleContainsPersonalData,
  handleContainsTelephoneData,
  handleContainsPassData,
} from "../../helpers/sensitive-statistics-calculations-util";

import NotificationContext from "../../store/notification-context";

const BROKER_URL = "wss://broker.emqx.io:8084/mqtt";
const AVAILABLE_TOPICS = ["sensors/#", "iot/#", "test/#", "/#"];

const initialDataCheckingObject = {
  channel: "sensors/#",

  startTime: null,
  endTime: null,

  flowStatistics: {
    averageMessagesPerSlot: {
      value: 0,
      seconds: 5,
      selected: false,
      currentWindowStart: null,
      currentWindowCount: 0,
      slotsCount: 0,
    },
    maxMessagesPerSlot: {
      value: 0,
      seconds: 5,
      selected: false,
      start: null,
      end: null,
      currentWindowStart: null,
      currentWindowCount: 0,
    },
  },

  dataStatistics: {
    numberOfEntriesAboutTemperature: {
      value: 0,
      testedValues: ["temp", "temperature"],
      selected: false,
    },
    numberOfEntriesAboutHumidity: {
      value: 0,
      testedValues: ["humidity"],
      selected: false,
    },
    averageMessageLengthChars: {
      value: 0,
      keysCount: 0,
      selected: false,
    },
    averageMessageLines: {
      value: 0,
      selected: false,
    },
    invalidJsonCount: {
      value: 0,
      selected: false,
    },
    validJsonCount: {
      value: 0,
      selected: false,
    },
    emptyMessages: {
      value: 0,
      selected: false,
    },
    messagesRecieved: {
      value: 0,
      selected: false,
    },
  },

  sensitiveDate: {
    containsPersonalData: {
      parsedJSON: [],
      requiredValues: {
        name: ["name", "firstName", "pseudonym", "nick"],
        surname: ["surname", "lastName", "familyName"],
      },
      selected: false,
    },
    containsEmailData: {
      parsedJSON: [],
      requiredValues: {
        name: ["name", "firstName"],
        email: ["mail", "email", "e-mail"],
      },
      selected: false,
    },
    containsTelephoneData: {
      parsedJSON: [],
      requiredValues: {
        name: ["name", "firstName"],
        telephone: ["phone", "tel", "mobile"],
      },
      selected: false,
    },
    containsLocalizationData: {
      parsedJSON: [],
      requiredValues: {
        localization: ["address", "city", "country", "postalCode"],
        name: ["name", "firstName"],
      },
      selected: false,
    },
    containsBankingData: {
      parsedJSON: [],
      requiredValues: {
        name: ["name", "firstName"],
        bank: ["creditCard", "iban", "account"],
      },
      selected: false,
    },
    containsPassData: {
      parsedJSON: [],
      requiredValues: {
        pass: ["password", "secret", "token"],
      },
      selected: false,
    },
  },
};

export default function Homepage() {
  const [dataCheckingObject, setDataCheckingObject] = useState(
    initialDataCheckingObject
  );

  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(AVAILABLE_TOPICS[0]);
  const [logs, setLogs] = useState([]);
  const [criteriaOpen, setCriteriaOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);

  const notificationCtx = useContext(NotificationContext);

  const addLog = useCallback((line) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev.slice(-20), `[${time}] ${line}`]);
  }, []);

  const subscribeToTopic = useCallback(
    (topic) => {
      const client = clientRef.current;
      if (!client) return;

      AVAILABLE_TOPICS.forEach((t) => client.unsubscribe(t, () => {}));

      client.subscribe(topic, { qos: 0 }, (err) => {
        if (err) addLog(`Błąd subskrypcji ${topic}: ${err.message}`);
        else addLog(`Subskrybowano: ${topic}`);
      });
    },
    [addLog]
  );

  const connectClient = useCallback(() => {
    if (clientRef.current) return;

    const clientId = "react-emqx-" + Math.random().toString(16).slice(2);
    const client = mqtt.connect(BROKER_URL, {
      clientId,
      clean: true,
      reconnectPeriod: 2000,
      connectTimeout: 10000,
    });

    clientRef.current = client;

    client.on("connect", () => {
      setConnected(true);
      addLog("Połączono z brokerem EMQX");
      subscribeToTopic(selectedTopic);

      setDataCheckingObject((prev) => ({
        ...prev,
        channel: selectedTopic,
        startTime: new Date(),
        endTime: null,
      }));
    });

    client.on("message", (topic, payload) => {
      const msg = payload.toString();
      addLog(`${topic}: ${msg}`);

      setDataCheckingObject((prev) => incrementMessagesReceived(prev));

      try {
        const parsedObject = JSON.parse(msg);
        setDataCheckingObject((prev) => handleValidJsonStats(prev, msg));

        setDataCheckingObject((prev) =>
          handleEmptyMessagesStats(prev, parsedObject)
        );

        setDataCheckingObject((prev) =>
          handleAverageMessageLines(prev, parsedObject)
        );

        setDataCheckingObject((prev) =>
          handleAverageMessageLengthChars(prev, parsedObject)
        );

        setDataCheckingObject((prev) =>
          handleNumberOfEntriesAboutHumidity(prev, parsedObject)
        );

        setDataCheckingObject((prev) =>
          handleNumberOfEntriesAboutTemperature(prev, parsedObject)
        );

        setDataCheckingObject((prev) =>
          handleMaxMessagesPerSlot(prev, parsedObject)
        );

        setDataCheckingObject((prev) =>
          handleAverageMessagesPerSlot(prev, parsedObject)
        );

        setDataCheckingObject((prev) =>
          handleContainsPersonalData(prev, parsedObject)
        );

        setDataCheckingObject((prev) =>
          handleContainsEmailData(prev, parsedObject)
        );

        setDataCheckingObject((prev) =>
          handleContainsTelephoneData(prev, parsedObject)
        );

        setDataCheckingObject((prev) =>
          handleContainsLocalizationData(prev, parsedObject)
        );

        setDataCheckingObject((prev) =>
          handleContainsBankingData(prev, parsedObject)
        );

        setDataCheckingObject((prev) =>
          handleContainsPassData(prev, parsedObject)
        );
      } catch {
        addLog("(JSON ERROR)");
        setDataCheckingObject((prev) => incrementInvalidJsonCount(prev));
      }
    });

    client.on("close", () => {
      setConnected(false);
      addLog("Disconnected");
    });
  }, [selectedTopic, addLog, subscribeToTopic]);

  const disconnectClient = useCallback(() => {
    if (!clientRef.current) return;
    clientRef.current.end(true);
    clientRef.current = null;
    setConnected(false);
    addLog("Połączenie zamknięte");

    setDataCheckingObject((prev) => ({
      ...prev,
      endTime: new Date(),
    }));
    setResultsOpen(true);
  }, [addLog]);

  const openCriteriaModal = () => setCriteriaOpen(true);
  const closeCriteriaModal = () => setCriteriaOpen(false);
  const closeResultsModal = () => setResultsOpen(false);

  const handleRaportSave = async () => {
    setResultsOpen(false);
    notificationCtx.showNotification({
      title: "Zapisywanie raportu...",
      message: "Raport jest wysyłany do serwera",
      status: "pending",
    });

    try {
      const response = await fetch(`/api/raport/raport`, {
        method: "POST",
        body: JSON.stringify(dataCheckingObject),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Request failed");
      }

      await response.json();

      notificationCtx.showNotification({
        title: "Sukces!",
        message: "Raport został pomyślnie zapisany",
        status: "success",
      });
    } catch (error) {
      notificationCtx.showNotification({
        title: "Błąd!",
        message: "Coś poszło nie tak podczas zapisywania raportu",
        status: "error",
      });
    }
  };

  return (
    <div className="bg-page1 min-h-screen w-full font-typewriter">
      <Container maxWidth={false} className="py-8">
        <Container maxWidth="md" className="relative">
          <div className="opacity-0 lg:opacity-100 absolute z-20 w-[calc(100%-34.5rem)] h-[22.2rem] right-[1.6rem] rounded-lg flex justify-center items-center p-5">
            <div className="w-full h-full rounded-lg border-4 border-page5"></div>
          </div>
          <div className="opacity-0 lg:opacity-100 absolute w-[calc(100%-34.5rem)] h-[22.2rem] bg-page3 right-[1.6rem] rounded-lg flex justify-center items-center">
            <Image
              src="/mqtt.png"
              alt="Image"
              placeholder="blur"
              blurDataURL="/mqtt.png"
              width={355}
              height={261}
              className="w-[50%] h-[50%] object-cover hue-rotate-[120deg]"
            />
          </div>
          <Stack spacing={4}>
            <span className="font-typewriter text-3xl tracking-wider font-extrabold text-pageMenu">
              EMQX MQTT
            </span>

            <span
              className={`
                px-3 rounded-full text-sm font-semibold inline-flex items-center gap-2 py-2
                ${
                  connected ? "bg-page5 text-white" : "bg-page2 text-pageMenu"
                } max-w-[30rem]
              `}
            >
              {connected ? (
                <CheckCircleIcon fontSize="small" />
              ) : (
                <CancelIcon fontSize="small" />
              )}
              {connected ? "connected" : "disconnected"}
            </span>

            <FormControl size="small" className="min-w-[180px]">
              <Select
                native
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                disabled={connected}
                className="bg-page2 text-pageMenu rounded-md p-2 max-w-[30rem]"
                inputProps={{
                  className:
                    "bg-page2 text-pageMenu font-typewriter cursor-pointer",
                }}
              >
                {AVAILABLE_TOPICS.map((t) => (
                  <option key={t} value={t} className="bg-page2 text-pageMenu">
                    {t}
                  </option>
                ))}
              </Select>
            </FormControl>

            <button
              onClick={openCriteriaModal}
              className="w-full py-3 rounded-md border border-page5 text-page5 font-semibold hover:bg-page2 hover:text-pageMenu transition max-w-[30rem]"
            >
              Wybierz kryteria testowania
            </button>

            {!connected ? (
              <button
                onClick={connectClient}
                className="w-full py-3 rounded-md bg-page2 text-pageMenu font-semibold hover:opacity-90 transition max-w-[30rem]"
              >
                Połącz
              </button>
            ) : (
              <button
                onClick={disconnectClient}
                className="w-full py-3 rounded-md bg-page5 text-white font-semibold hover:opacity-90 transition max-w-[30rem]"
              >
                Rozłącz
              </button>
            )}

            <div className="bg-page1 text-page5 border border-page5 h-[32rem] overflow-auto rounded-md shadow-sm font-typewriter">
              <pre className="m-0 p-3 text-xs whitespace-pre-wrap font-typewriter">
                {logs.join("\n")}
              </pre>
            </div>
          </Stack>
        </Container>
      </Container>

      <Dialog fullScreen open={criteriaOpen} onClose={closeCriteriaModal}>
        <DialogTitle className="bg-page2 font-typewriter">
          Wybierz kryteria testowania
        </DialogTitle>
        <DialogContent className="bg-page1">
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Box sx={{ minWidth: 280, flex: 1, maxWidth: 420 }}>
              <FlowStatisticsSection
                dataCheckingObject={dataCheckingObject}
                setDataCheckingObject={setDataCheckingObject}
              />
            </Box>

            <Box sx={{ minWidth: 280, flex: 1, maxWidth: 420 }}>
              <DataStatisticsSection
                dataCheckingObject={dataCheckingObject}
                setDataCheckingObject={setDataCheckingObject}
              />
            </Box>

            <Box sx={{ minWidth: 280, flex: 1, maxWidth: 420 }}>
              <SensitiveDataSection
                dataCheckingObject={dataCheckingObject}
                setDataCheckingObject={setDataCheckingObject}
              />
            </Box>
          </Box>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="flex justify-center mt-6">
              <button
                onClick={closeCriteriaModal}
                className="w-full max-w-40 py-3 rounded-xl bg-page5 text-white font-semibold hover:opacity-90 transition duration-200 px-20"
              >
                Zatwierdź
              </button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog fullScreen open={resultsOpen} onClose={closeResultsModal}>
        <DialogTitle className="bg-page2 font-typewriter">
          Podsumowanie sesji MQTT
        </DialogTitle>
        <DialogContent className="bg-page1">
          <div className="max-w-3xl mx-auto mt-4 bg-page1 text-page5 border border-page5 rounded-lg p-4 font-typewriter text-sm">
            <h2 className="text-lg font-bold mb-3">Raport Końcowy</h2>
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(
                {
                  ...dataCheckingObject,
                  startTime:
                    dataCheckingObject.startTime &&
                    new Date(dataCheckingObject.startTime).toLocaleString(),
                  endTime:
                    dataCheckingObject.endTime &&
                    new Date(dataCheckingObject.endTime).toLocaleString(),
                },
                null,
                2
              )}
            </pre>
          </div>

          <div className="flex flex-col items-center mt-6 gap-3">
            <button
              onClick={closeResultsModal}
              className="w-full max-w-40 py-3 rounded-xl bg-page5 text-white font-semibold hover:opacity-90 transition duration-200 px-20"
            >
              Zamknij
            </button>

            <button
              onClick={handleRaportSave}
              className="w-full max-w-40 py-3 rounded-xl bg-page2 text-pageMenu font-semibold hover:opacity-90 transition duration-200 px-20"
            >
              Zapisz raport
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}