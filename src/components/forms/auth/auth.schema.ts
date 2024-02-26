import * as yup from 'yup'

/**
 * Create validation schema for auth signin form.
 * email: required, email format
 * password: required, min 6 characters, at leat one uppercase required
 */
export const authSigninSchema = yup.object({
  identifier: yup.string().required('Please enter an email address.').email('Please enter a valid email address.'),
  password: yup
    .string()
    .required('Please enter a password.')
    .min(6, 'Password must be at least 6 characters.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])/, 'Password must contain at least one uppercase letter.')
})

export const requireAuthSchema = yup.object({
  password: yup
    .string()
    .required('Please enter your password.')
    .min(6, 'Password must be at least 6 characters.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])/, 'Password must contain at least one uppercase letter.')
})
