import mongoose from "mongoose";

const { Schema, SchemaTypes } = mongoose;

const SlotSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    seconds: {
      type: Number,
      required: true,
      default: 5,
    },
    selected: {
      type: Boolean,
      required: true,
      default: false,
    },

    currentWindowStart: {
      type: Date,
      default: null,
    },
    currentWindowCount: {
      type: Number,
      required: true,
      default: 0,
    },

    slotsCount: {
      type: Number,
      required: true,
      default: 0,
    },

    start: {
      type: Date,
      default: null,
    },
    end: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const SimpleMetricSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    selected: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { _id: false }
);

const TestedValuesMetricSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    testedValues: {
      type: [String],
      required: true,
      default: [],
    },
    selected: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { _id: false }
);

const AverageMessageLengthCharsSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    keysCount: {
      type: Number,
      required: true,
      default: 0,
    },
    selected: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { _id: false }
);

const SensitiveGroupSchema = new Schema(
  {
    parsedJSON: {
      type: [SchemaTypes.Mixed],
      required: true,
      default: [],
    },
    requiredValues: {
      type: new Schema(
        {
          name: {
            type: [String],
            default: undefined,
          },
          surname: {
            type: [String],
            default: undefined,
          },
          email: {
            type: [String],
            default: undefined,
          },
          telephone: {
            type: [String],
            default: undefined,
          },
          localization: {
            type: [String],
            default: undefined,
          },
          bank: {
            type: [String],
            default: undefined,
          },
          pass: {
            type: [String],
            default: undefined,
          },
        },
        { _id: false }
      ),
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { _id: false }
);

const RaportSchema = new Schema({
  channel: {
    type: String,
    required: true,
    minlength: [1, "Channel must have at least 1 character"],
    maxlength: [1000, "Channel cannot be more than 1000 characters"],
  },

  startTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },

  flowStatistics: {
    type: new Schema(
      {
        averageMessagesPerSlot: {
          type: SlotSchema,
          required: true,
        },
        maxMessagesPerSlot: {
          type: SlotSchema,
          required: true,
        },
      },
      { _id: false }
    ),
    required: true,
  },

  dataStatistics: {
    type: new Schema(
      {
        numberOfEntriesAboutTemperature: {
          type: TestedValuesMetricSchema,
          required: true,
        },
        numberOfEntriesAboutHumidity: {
          type: TestedValuesMetricSchema,
          required: true,
        },
        averageMessageLengthChars: {
          type: AverageMessageLengthCharsSchema,
          required: true,
        },
        averageMessageLines: {
          type: SimpleMetricSchema,
          required: true,
        },
        invalidJsonCount: {
          type: SimpleMetricSchema,
          required: true,
        },
        validJsonCount: {
          type: SimpleMetricSchema,
          required: true,
        },
        emptyMessages: {
          type: SimpleMetricSchema,
          required: true,
        },
        messagesRecieved: {
          type: SimpleMetricSchema,
          required: true,
        },
      },
      { _id: false }
    ),
    required: true,
  },

  sensitiveDate: {
    type: new Schema(
      {
        containsPersonalData: {
          type: SensitiveGroupSchema,
          required: true,
        },
        containsEmailData: {
          type: SensitiveGroupSchema,
          required: true,
        },
        containsTelephoneData: {
          type: SensitiveGroupSchema,
          required: true,
        },
        containsLocalizationData: {
          type: SensitiveGroupSchema,
          required: true,
        },
        containsBankingData: {
          type: SensitiveGroupSchema,
          required: true,
        },
        containsPassData: {
          type: SensitiveGroupSchema,
          required: true,
        },
      },
      { _id: false }
    ),
    required: true,
  },
});

export default mongoose.models.Raport || mongoose.model("Raport", RaportSchema);
