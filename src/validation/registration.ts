import * as yup from "yup";

const registrationValiditionSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email address is a required field"),
  password: yup
    .string()
    .min(5)
    .max(1000)
    .required("Password is a required field"),
  firstName: yup.string().required("First name is a required field"),
  lastName: yup.string().required("Last name is a required field"),
  gender: yup.string().required("Gender is a required field"),
  birthDate: yup.date().required("Birthday is a required field"),
});

export default registrationValiditionSchema;
