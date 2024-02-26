import * as yup from 'yup'

/**
 * Create validation schema for goal tracker form.
 * calls: optional, must be a number, required if sales is empty
 * sales: optional, must be a number, required if calls is empty
 * confirmPassword: optional, must match password
 */
export const goalTrackerSchema = yup.object({
  calls: yup
    .number()
    .typeError('Calls must be a number')
    .integer('Calls must be a whole number')
    .min(0, 'Calls must be greater than or equal to 0'),
  sales: yup
    .number()
    .typeError('Sales must be a number')
    .integer('Sales must be a whole number')
    .min(0, 'Sales must be greater than or equal to 0')
})
