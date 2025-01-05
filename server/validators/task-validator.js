const { z } = require('zod');

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'), // Title should be a non-empty string
  description: z.string().min(1, 'Description is required'), // Description should be a non-empty string
});


// Zod schema for creating a task
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'), // Title should be a non-empty string
  description: z.string().min(1, 'Description is required'), // Description should be a non-empty string
  priority: z.string().optional().default('Medium'), // Priority is optional, default value 'Medium'
  projectId: z.string().min(1, 'Project ID is required'), // Ensure projectId is provided
  currentDepartment: z.enum([
    "application",
    "design",
    "production",
    "store",
    "quality",
    "purchase",
    "maintenance",
    "services",
  ], { message: "Invalid department" }), // Validate against allowed departments
  departmentDeadlines: z.array(
    z.object({
      department: z.enum([
        "application",
        "design",
        "production",
        "store",
        "quality",
        "purchase",
        "maintenance",
        "services",
      ], { message: "Invalid department" }),
      deadline: z.string()
        .refine((val) => !isNaN(Date.parse(val)), { message: 'Enter a valid date' })
        .transform((val) => new Date(val))
        .refine(
          (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
          { message: 'Deadline must be today or in the future' }
        ),
    })
  ).optional(), // departmentDeadlines is optional but must follow this structure
});


// Zod schema for assigning a task
const assignTaskSchema = z.object({
  assignedToIds: z
  .array(z.string().min(1, "Invalid ID format")) // Ensure each ID is a non-empty string
  .nonempty("At least one ID must be provided"), // Ensure the array is not empty
  });

module.exports = {
  createProjectSchema,
  createTaskSchema,
  assignTaskSchema,
};
