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
    .email({
      message: "Invalid email format! Please include '@' and a domain.",
    })
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
    .email({
      message: "Invalid email format! Please include '@' and a domain.",
    })
    .min(4, { message: "Email should be at least 4 characters long" })
    .max(255, { message: "Email should not exceed 255 characters" }),

  password: z
    .string({ required_error: "Password should be entered!" })
    .trim()
    .min(6, { message: "Password should be at least 6 characters long" })
    .max(255, { message: "Password should not exceed 255 characters" }),
});

const changePasswordSchema = z.object({
  oldPassword: z
    .string({ required_error: "Old password should be entered!" })
    .trim()
    .min(6, { message: "Old password should be at least 6 characters long" })
    .max(255, { message: "Old password should not exceed 255 characters" }),

  newPassword: z
    .string({ required_error: "New password should be entered!" })
    .trim()
    .min(6, { message: "New password should be at least 6 characters long" })
    .max(255, { message: "New password should not exceed 255 characters" }),
});

const registerDepartmentAdminSchema = z.object({
  fullName: z
    .string({ required_error: "Full Name should be entered!" })
    .trim()
    .min(3, { message: "Full Name should be at least 3 characters long" })
    .max(255, { message: "Full Name should not exceed 255 characters" }),

  email: z
    .string({ required_error: "Email should be entered!" })
    .trim()
    .email({
      message: "Invalid email format! Please include '@' and a domain.",
    })
    .min(4, { message: "Email should be at least 4 characters long" })
    .max(255, { message: "Email should not exceed 255 characters" }),

  department: z
    .string({ required_error: "Department should be entered!" })
    .trim()
    .min(3, { message: "Department should be at least 3 characters long" })
    .max(255, { message: "Department should not exceed 255 characters" }),
});

const adminLoginSchema = z.object({
  email: z
    .string({ required_error: "Email should be entered!" })
    .trim()
    .email({
      message: "Invalid email format! Please include '@' and a domain.",
    })
    .min(4, { message: "Email should be at least 4 characters long" })
    .max(255, { message: "Email should not exceed 255 characters" }),

  password: z
    .string({ required_error: "Password should be entered!" })
    .trim()
    .min(6, { message: "Password should be at least 6 characters long" })
    .max(255, { message: "Password should not exceed 255 characters" }),
});

const registerEmployeeSchema = z.object({
  fullName: z
    .string({ required_error: "Full Name should be entered!" })
    .trim()
    .min(3, { message: "Full Name should be at least 3 characters long" })
    .max(255, { message: "Full Name should not exceed 255 characters" }),

  email: z
    .string({ required_error: "Email should be entered!" })
    .trim()
    .email({ message: "Invalid email format! Please include '@' and a domain." })
    .min(4, { message: "Email should be at least 4 characters long" })
    .max(255, { message: "Email should not exceed 255 characters" }),

  department: z
    .string({ required_error: "Department should be entered!" })
    .trim()
    .min(3, { message: "Department should be at least 3 characters long" })
    .max(255, { message: "Department should not exceed 255 characters" }),
});

const employeeLoginSchema = z.object({
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


module.exports = {
  superAdminRegisterSchema,
  superAdminLoginSchema,
  changePasswordSchema,
  registerDepartmentAdminSchema,
  adminLoginSchema,
  registerEmployeeSchema,
  employeeLoginSchema,
};
