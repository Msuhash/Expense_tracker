import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    // 🎯 User-selected icon
    icon: {
      type: String,
      required: true,
      default: "📁" // fallback icon
    },

    // 🎨 User-selected color
    color: {
      type: String,
      required: true,
      match: /^#([0-9A-F]{3}){1,2}$/i, // validates HEX color
      default: "#6b7280" // neutral gray
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isDefault: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category
