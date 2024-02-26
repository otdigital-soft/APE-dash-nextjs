import * as yup from 'yup'

/**
 * Create validation schema for add team member form.
 * name: required, min 2 characters
 * email: required, email format
 * password: required, min 6 characters, at leat one uppercase required
 * confirmPassword: required, must match password
 */
export const addTeamSchema = yup.object({
  name: yup.string().required('Please enter team member name.').min(2, 'Name must be at least 2 characters.'),
  email: yup.string().required('Please enter team member email address.').email('Please enter a valid email address.'),
  password: yup
    .string()
    .required('Please enter a password.')
    .min(6, 'Password must be at least 6 characters.')
    .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter.'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password.')
    .oneOf([yup.ref('password')], 'Passwords must match.')
})

/**
 * Create validation schema for edit team member form.
 * name: optional, min 2 characters
 * email: optional, email format
 * password: optional, min 6 characters, at leat one uppercase required
 */
export const editTeamSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters.'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter.')
})
