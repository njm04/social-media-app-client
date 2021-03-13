import * as yup from "yup";

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email address is a required field"),
  password: yup.string().required("Password is a required field"),
});

export default loginValidationSchema;
