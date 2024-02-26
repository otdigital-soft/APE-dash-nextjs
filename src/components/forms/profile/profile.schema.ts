import * as yup from 'yup'

/**
 * Create validation schema for edit profile form.
 * email: optional, email format
 * password: optional, min 6 characters, at leat one uppercase required
 * confirmPassword: optional, must match password
 */
export const editProfileSchema = yup.object({
  email: yup.string().email('Please enter a valid email address.'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter.'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match.')
})

/**
 * Create validation schema for change password form.
 * currentPassword: required, min 6 characters, at leat one uppercase required
 * password: required, min 6 characters, at leat one uppercase required
 * confirmPassword: required, must match password
 */
export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Please enter your current password.')
    .min(6, 'Password must be at least 6 characters.')
    .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter.'),
  password: yup
    .string()
    .required('Please enter your new password.')
    .min(6, 'Password must be at least 6 characters.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])/, 'Password must contain at least one uppercase letter.'),
  confirmPassword: yup
    .string()
    .required('Please confirm your new password.')
    .oneOf([yup.ref('password')], 'Passwords must match.')
})
