const { z } = require("zod");

// Creating an object schema for Super Admin registration
const superAdminRegisterSchema = z.object({
  fullName: z
    .string({ required_error: "Full Name should be entered!" })
    .trim()
    .min(3, { message: "Full Name should be at least 3 characters long" })
    .max(255, { message: "Full Name should not exceed 255 characters" }),

  userName: z
    .string({ required_error: "Username should be entered!" })
    .trim()
    .min(3, { message: "Username should be at least 3 characters long" })
    .max(255, { message: "Username should not exceed 255 characters" }),

  email: z
    .string({ required_error: "Email should be entered!" })
    .trim()
    .email({ message: "Invalid email format! Please include '@' and a domain." })
    .min(4, { message: "Email should be at least 4 characters long" })
    .max(255, { message: "Email should not exceed 255 characters" }),

  password: z
    .string({ required_error: "Password should be entered!" })
    .trim()
    .min(6, { message: "Password should be at least 6 characters long" })
    .max(255, { message: "Password should not exceed 255 characters" }),
});

const superAdminLoginSchema = z.object({
  email: z
    .string({ required_error: "Email should be entered!" })
    .trim()
    .email({ message: "Invalid email format! Please include '@' and a domain." })
    .min(4, { message: "Email should be at least 4 characters long" })
    .max(255, { message: "Email should not exceed 255 characters" }),

  password: z
    .string({ required_error: "Password should be entered!" })
    .trim()
    .min(6, { message: "Password should be at least 6 characters long" })
    .max(255, { message: "Password should not exceed 255 characters" }),
});

module.exports = { superAdminRegisterSchema, superAdminLoginSchema};