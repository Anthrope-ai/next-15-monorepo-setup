import { InferType, object, string } from "yup";

export let updateUserSchema = object({
  name: string().notRequired()
}).noUnknown(true);

export type UpdateUserDTO = InferType<typeof updateUserSchema>;
