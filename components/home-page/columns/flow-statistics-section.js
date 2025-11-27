import {
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";

export default function FlowStatisticsSection({
  dataCheckingObject,
  setDataCheckingObject,
}) {
  const updateFlowSeconds = (field) => (e) => {
    const seconds = Number(e.target.value) || 0;
    setDataCheckingObject((prev) => ({
      ...prev,
      flowStatistics: {
        ...prev.flowStatistics,
        [field]: {
          ...prev.flowStatistics[field],
          seconds,
        },
      },
    }));
  };

  const handleFlowCheckboxChange = (field) => (e) => {
    const checked = e.target.checked;
    setDataCheckingObject((prev) => ({
      ...prev,
      flowStatistics: {
        ...prev.flowStatistics,
        [field]: {
          ...prev.flowStatistics[field],
          selected: checked,
        },
      },
    }));
  };

  const { flowStatistics } = dataCheckingObject;

  return (
    <Stack spacing={2} className="font-typewriter">
      <Typography variant="h6">Statystyki ruchu</Typography>

      <Stack spacing={1} className="p-3 rounded-lg border-2 border-pageMenu shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]">
        <FormControlLabel
          control={
            <Checkbox
              checked={flowStatistics.averageMessagesPerSlot.selected}
              onChange={handleFlowCheckboxChange("averageMessagesPerSlot")}
              className="hue-rotate-[190deg]"
            />
          }
          label="Średnia liczba wiadomości w przedziale czasowym (s)"
        />
        <TextField
          type="number"
          label="Odstęp czasowy (sekundy)"
          value={flowStatistics.averageMessagesPerSlot.seconds}
          onChange={updateFlowSeconds("averageMessagesPerSlot")}
          className="hue-rotate-[190deg]"
        />
      </Stack>

      <Stack spacing={1} className="p-3 rounded-lg border-2 border-pageMenu shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]">
        <FormControlLabel
          control={
            <Checkbox
              checked={flowStatistics.maxMessagesPerSlot.selected}
              onChange={handleFlowCheckboxChange("maxMessagesPerSlot")}
              className="hue-rotate-[190deg]"
            />
          }
          label="Maksymalna liczba wiadomości w przedziale czasowym (s)"
        />
        <TextField
          type="number"
          label="Odstęp czasowy (sekundy)"
          value={flowStatistics.maxMessagesPerSlot.seconds}
          onChange={updateFlowSeconds("maxMessagesPerSlot")}
          className="hue-rotate-[190deg]"
        />
      </Stack>
    </Stack>
  );
}
