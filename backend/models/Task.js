import mongoose, { mongo } from "mongoose";
import Inc from 'mongoose-sequence';

const AutoIncrement = Inc(mongoose)

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: "ticketNums",
    start_seq: 500
})
export default mongoose.model("Task", taskSchema);
