import { connectDatabase } from "../../../helpers/db-util";
import mongoose from "mongoose";
import Raport from "../../../models/Raport";

function encryptParsedJSONArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => {
    try {
      const json = JSON.stringify(item);
      return Buffer.from(json, "utf8").toString("base64");
    } catch (e) {
      return item;
    }
  });
}

async function handler(req, res) {
  const { method, query } = req;

  try {
    await connectDatabase();
  } catch (error) {
    return res.status(503).json({ message: "Failed to connect to server" });
  }

  try {
    switch (method) {
      case "POST": {
        const raportData = req.body;

        const sd = raportData.sensitiveDate || {};

        const encryptedRaportData = {
          ...raportData,
          sensitiveDate: {
            ...sd,
            containsPersonalData: {
              ...(sd.containsPersonalData || {}),
              parsedJSON: encryptParsedJSONArray(
                sd.containsPersonalData?.parsedJSON
              ),
            },
            containsEmailData: {
              ...(sd.containsEmailData || {}),
              parsedJSON: encryptParsedJSONArray(
                sd.containsEmailData?.parsedJSON
              ),
            },
            containsTelephoneData: {
              ...(sd.containsTelephoneData || {}),
              parsedJSON: encryptParsedJSONArray(
                sd.containsTelephoneData?.parsedJSON
              ),
            },
            containsLocalizationData: {
              ...(sd.containsLocalizationData || {}),
              parsedJSON: encryptParsedJSONArray(
                sd.containsLocalizationData?.parsedJSON
              ),
            },
            containsBankingData: {
              ...(sd.containsBankingData || {}),
              parsedJSON: encryptParsedJSONArray(
                sd.containsBankingData?.parsedJSON
              ),
            },
            containsPassData: {
              ...(sd.containsPassData || {}),
              parsedJSON: encryptParsedJSONArray(
                sd.containsPassData?.parsedJSON
              ),
            },
          },
        };

        try {
          const raport = new Raport(encryptedRaportData);
          await raport.save();

          return res.status(201).json({
            message: "Raport saved successfully",
            raport,
          });
        } catch (error) {
          return res.status(500).json({
            message: "Something went wrong when saving raport",
          });
        }
      }

      case "DELETE": {
        const { id } = query;

        if (!id) {
          return res.status(400).json({ message: "Raport id is required" });
        }

        try {
          const deleted = await Raport.findByIdAndDelete(id);

          if (!deleted) {
            return res.status(404).json({
              message: "Raport not found",
            });
          }

          return res.status(200).json({
            message: "Raport deleted successfully",
            deletedRaport: deleted,
          });
        } catch (error) {
          return res.status(500).json({
            message: "Something went wrong when deleting raport",
          });
        }
      }

      default: {
        res.setHeader("Allow", ["POST", "DELETE"]);
        return res.status(405).json({ message: "Method not allowed" });
      }
    }
  } finally {
    mongoose.connection.close();
  }
}

export default handler;
