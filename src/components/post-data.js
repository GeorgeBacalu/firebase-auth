import { object, string, array } from "yup";

export const fields = [
  { name: "mobile", label: "Mobile", type: "string" },
  { name: "state", label: "State", type: "string" },
  { name: "city", label: "City", type: "string" },
  { name: "instructors", label: "Instructors", type: "array" },
  { name: "danceStyles", label: "Dance Styles", type: "array" },
  { name: "imageUrl", label: "Image URL", type: "string" }
];

export const values = { mobile: "", state: "", city: "", instructors: "", danceStyles: "", imageUrl: "" };

export const schema = object({
  mobile: string().required("Enter a mobile number"),
  state: string().required("Select a state"),
  city: string().required("Select a city"),
  instructors: array().required("Enter at least one instructor"),
  danceStyles: array().required("Enter at least one dance style"),
  imageUrl: string().required("Enter an image URL")
});