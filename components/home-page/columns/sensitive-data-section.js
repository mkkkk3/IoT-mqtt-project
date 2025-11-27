import { useState } from "react";
import {
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";

export default function SensitiveDataSection({
  dataCheckingObject,
  setDataCheckingObject,
}) {
  const { sensitiveDate } = dataCheckingObject;

  const [inputs, setInputs] = useState({
    personal_name:
      sensitiveDate.containsPersonalData.requiredValues.name.join("; "),
    personal_surname:
      sensitiveDate.containsPersonalData.requiredValues.surname.join("; "),

    email_name: sensitiveDate.containsEmailData.requiredValues.name.join("; "),
    email_email:
      sensitiveDate.containsEmailData.requiredValues.email.join("; "),

    tel_name:
      sensitiveDate.containsTelephoneData.requiredValues.name.join("; "),
    tel_telephone:
      sensitiveDate.containsTelephoneData.requiredValues.telephone.join("; "),

    loc_localization:
      sensitiveDate.containsLocalizationData.requiredValues.localization.join(
        "; "
      ),
    loc_name:
      sensitiveDate.containsLocalizationData.requiredValues.name.join("; "),

    bank_name: sensitiveDate.containsBankingData.requiredValues.name.join("; "),
    bank_bank: sensitiveDate.containsBankingData.requiredValues.bank.join("; "),

    pass_pass: sensitiveDate.containsPassData.requiredValues.pass.join("; "),
  });

  const handleSensitiveMetricCheckboxChange = (group) => (e) => {
    const checked = e.target.checked;
    setDataCheckingObject((prev) => ({
      ...prev,
      sensitiveDate: {
        ...prev.sensitiveDate,
        [group]: {
          ...prev.sensitiveDate[group],
          selected: checked,
        },
      },
    }));
  };

  const handleTextChange = (key, group, field) => (e) => {
    const raw = e.target.value;

    setInputs((prev) => ({
      ...prev,
      [key]: raw,
    }));

    const arr = raw
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    setDataCheckingObject((prev) => ({
      ...prev,
      sensitiveDate: {
        ...prev.sensitiveDate,
        [group]: {
          ...prev.sensitiveDate[group],
          requiredValues: {
            ...prev.sensitiveDate[group].requiredValues,
            [field]: arr,
          },
        },
      },
    }));
  };

  return (
    <Stack spacing={2} className="font-typewriter">
      <Typography variant="h6">Dane wrażliwe</Typography>

      <Stack
        spacing={1}
        className="p-3 rounded-lg border-2 border-pageMenu shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={sensitiveDate.containsPersonalData.selected}
              onChange={handleSensitiveMetricCheckboxChange(
                "containsPersonalData"
              )}
              className="hue-rotate-[190deg]"
            />
          }
          label="Dane zawierające personalne informacje"
        />

        <TextField
          type="text"
          label='Frazy dla "name" (; jako separator)'
          value={inputs.personal_name}
          onChange={handleTextChange(
            "personal_name",
            "containsPersonalData",
            "name"
          )}
          className="hue-rotate-[190deg]"
        />

        <TextField
          type="text"
          label='Frazy dla "surname" (; jako separator)'
          value={inputs.personal_surname}
          onChange={handleTextChange(
            "personal_surname",
            "containsPersonalData",
            "surname"
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
              checked={sensitiveDate.containsEmailData.selected}
              onChange={handleSensitiveMetricCheckboxChange(
                "containsEmailData"
              )}
              className="hue-rotate-[190deg]"
            />
          }
          label="Dane zawierające dane e-mail"
        />

        <TextField
          type="text"
          label='Frazy dla "name" (; jako separator)'
          value={inputs.email_name}
          onChange={handleTextChange("email_name", "containsEmailData", "name")}
          className="hue-rotate-[190deg]"
        />

        <TextField
          type="text"
          label='Frazy dla "email" (; jako separator)'
          value={inputs.email_email}
          onChange={handleTextChange(
            "email_email",
            "containsEmailData",
            "email"
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
              checked={sensitiveDate.containsTelephoneData.selected}
              onChange={handleSensitiveMetricCheckboxChange(
                "containsTelephoneData"
              )}
              className="hue-rotate-[190deg]"
            />
          }
          label="Dane zawierające informacje telefoniczne"
        />

        <TextField
          type="text"
          label='Frazy dla "name" (; jako separator)'
          value={inputs.tel_name}
          onChange={handleTextChange(
            "tel_name",
            "containsTelephoneData",
            "name"
          )}
          className="hue-rotate-[190deg]"
        />

        <TextField
          type="text"
          label='Frazy dla "telephone" (; jako separator)'
          value={inputs.tel_telephone}
          onChange={handleTextChange(
            "tel_telephone",
            "containsTelephoneData",
            "telephone"
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
              checked={sensitiveDate.containsLocalizationData.selected}
              onChange={handleSensitiveMetricCheckboxChange(
                "containsLocalizationData"
              )}
              className="hue-rotate-[190deg]"
            />
          }
          label="Dane zawierające informacje lokalizacyjne"
        />

        <TextField
          type="text"
          label="Frazy lokalizacja (; jako separator)"
          value={inputs.loc_localization}
          onChange={handleTextChange(
            "loc_localization",
            "containsLocalizationData",
            "localization"
          )}
          className="hue-rotate-[190deg]"
        />

        <TextField
          type="text"
          label='Frazy dla "name" (; jako separator)'
          value={inputs.loc_name}
          onChange={handleTextChange(
            "loc_name",
            "containsLocalizationData",
            "name"
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
              checked={sensitiveDate.containsBankingData.selected}
              onChange={handleSensitiveMetricCheckboxChange(
                "containsBankingData"
              )}
              className="hue-rotate-[190deg]"
            />
          }
          label="Dane zawierające informacje bankowe"
        />

        <TextField
          type="text"
          label='Frazy dla "name" (; jako separator)'
          value={inputs.bank_name}
          onChange={handleTextChange(
            "bank_name",
            "containsBankingData",
            "name"
          )}
          className="hue-rotate-[190deg]"
        />

        <TextField
          type="text"
          label='Frazy dla "bank" (; jako separator)'
          value={inputs.bank_bank}
          onChange={handleTextChange(
            "bank_bank",
            "containsBankingData",
            "bank"
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
              checked={sensitiveDate.containsPassData.selected}
              onChange={handleSensitiveMetricCheckboxChange("containsPassData")}
              className="hue-rotate-[190deg]"
            />
          }
          label="Dane zawierające hasła"
        />

        <TextField
          type="text"
          label='Frazy dla "pass" (; jako separator)'
          value={inputs.pass_pass}
          onChange={handleTextChange("pass_pass", "containsPassData", "pass")}
          className="hue-rotate-[190deg]"
        />
      </Stack>
    </Stack>
  );
}
