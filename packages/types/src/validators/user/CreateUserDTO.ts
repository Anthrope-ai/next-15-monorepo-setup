import { InferType, object, string } from "yup";

export let createUserSchema = object({
  name: string().required(),
  email: string().email().required()
}).noUnknown(true);

export type CreateUserDTO = InferType<typeof createUserSchema>;
