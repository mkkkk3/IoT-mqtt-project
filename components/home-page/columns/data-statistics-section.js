import { useState } from "react";
import {
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";

export default function DataStatisticsSection({
  dataCheckingObject,
  setDataCheckingObject,
}) {
  const { dataStatistics } = dataCheckingObject;

  const [temperatureInput, setTemperatureInput] = useState(
    dataStatistics.numberOfEntriesAboutTemperature.testedValues.join("; ")
  );
  const [humidityInput, setHumidityInput] = useState(
    dataStatistics.numberOfEntriesAboutHumidity.testedValues.join("; ")
  );

  const handleDataMetricCheckboxChange = (field) => (e) => {
    const checked = e.target.checked;
    setDataCheckingObject((prev) => ({
      ...prev,
      dataStatistics: {
        ...prev.dataStatistics,
        [field]: {
          ...prev.dataStatistics[field],
          selected: checked,
        },
      },
    }));
  };

  const handleTextChange = (setLocal, field) => (e) => {
    const raw = e.target.value;
    setLocal(raw);

    const arr = raw
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    setDataCheckingObject((prev) => ({
      ...prev,
      dataStatistics: {
        ...prev.dataStatistics,
        [field]: {
          ...prev.dataStatistics[field],
          testedValues: arr,
        },
      },
    }));
  };

  return (
    <Stack spacing={2} className="font-typewriter">
      <Typography variant="h6">Statystyki danych</Typography>

      <Stack
        spacing={1}
        className="p-3 rounded-lg border-2 border-pageMenu shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={dataStatistics.messagesRecieved.selected}
              onChange={handleDataMetricCheckboxChange("messagesRecieved")}
              className="hue-rotate-[190deg]"
            />
          }
          label="Ilość wiadomości odebranych"
        />
      </Stack>

      <Stack
        spacing={1}
        className="p-3 rounded-lg border-2 border-pageMenu shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={dataStatistics.numberOfEntriesAboutTemperature.selected}
              onChange={handleDataMetricCheckboxChange(
                "numberOfEntriesAboutTemperature"
              )}
              className="hue-rotate-[190deg]"
            />
          }
          label="Ilość wpisów zawierających informacje dotyczące temperatury"
        />
        <TextField
          type="text"
          label="Szukane frazy temperatura (; jako separator)"
          value={temperatureInput}
          onChange={handleTextChange(
            setTemperatureInput,
            "numberOfEntriesAboutTemperature"
          )}
          className="hue-rotate-[190deg]"
        />
      </Stack>

      <Stack
        spacing={1}
        className="p-3 rounded-lg border-2 border-pageMenu shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={dataStatistics.numberOfEntriesAboutHumidity.selected}
              onChange={handleDataMetricCheckboxChange(
                "numberOfEntriesAboutHumidity"
              )}
              className="hue-rotate-[190deg]"
            />
          }
          label="Ilość wpisów zawierających informacje dotyczące wilgotności"
        />
        <TextField
          type="text"
          label="Szukane frazy wilgotność (; jako separator)"
          value={humidityInput}
          onChange={handleTextChange(
            setHumidityInput,
            "numberOfEntriesAboutHumidity"
          )}
          className="hue-rotate-[190deg]"
        />
      </Stack>

      <FormControlLabel
        className="p-3 rounded-lg border-2 border-pageMenu shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
        control={
          <Checkbox
            checked={dataStatistics.averageMessageLengthChars.selected}
            onChange={handleDataMetricCheckboxChange(
              "averageMessageLengthChars"
            )}
            className="hue-rotate-[190deg]"
          />
        }
        label="Przeciętna ilość znaków we wpisie w wiadomości"
      />

      <FormControlLabel
        className="p-3 rounded-lg border-2 border-pageMenu shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
        control={
          <Checkbox
            checked={dataStatistics.averageMessageLines.selected}
            onChange={handleDataMetricCheckboxChange("averageMessageLines")}
            className="hue-rotate-[190deg]"
          />
        }
        label="Ilość wpisów w przeciętnej wiadomości"
      />

      <FormControlLabel
        className="p-3 rounded-lg border-2 border-pageMenu shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
        control={
          <Checkbox
            checked={dataStatistics.invalidJsonCount.selected}
            onChange={handleDataMetricCheckboxChange("invalidJsonCount")}
            className="hue-rotate-[190deg]"
          />
        }
        label="Ilość wiadomości niepoprawnych (JSON parse error)"
      />

      <FormControlLabel
        className="p-3 rounded-lg border-2 border-pageMenu shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
        control={
          <Checkbox
            checked={dataStatistics.validJsonCount.selected}
            onChange={handleDataMetricCheckboxChange("validJsonCount")}
            className="hue-rotate-[190deg]"
          />
        }
        label="Ilość wiadomości poprawnych (JSON parse success)"
      />

      <FormControlLabel
        className="p-3 rounded-lg border-2 border-pageMenu shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
        control={
          <Checkbox
            checked={dataStatistics.emptyMessages.selected}
            onChange={handleDataMetricCheckboxChange("emptyMessages")}
            className="hue-rotate-[190deg]"
          />
        }
        label="Ilość pustych wiadomości"
      />
    </Stack>
  );
}
