const { z } = require('zod');

// Zod schema for creating a task
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'), // Title should be a non-empty string
  description: z.string().min(1, 'Description is required'), // Description should be a non-empty string
  priority: z.string().optional().default('Medium'), // Priority is optional, default value 'Medium'
  deadline: z.string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Enter the date in proper format' })
    .transform((val) => new Date(val))
    .refine(
      (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
      { message: 'Date must be today or in the future' }),  // Transform the string into a Date object
  currentDepartment: z.string().min(1, 'Department is required'), // Department should be a non-empty string
});

// Zod schema for assigning a task
const assignTaskSchema = z.object({
  assignedToIds: z
  .array(z.string().min(1, "Invalid ID format")) // Ensure each ID is a non-empty string
  .nonempty("At least one ID must be provided"), // Ensure the array is not empty
  });

module.exports = {
  createTaskSchema,
  assignTaskSchema,
};
