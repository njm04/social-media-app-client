import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { navigate, Redirect } from "@reach/router";
import { RouteComponentProps } from "@reach/router";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "./common/copyRight";
import Register from "./register";
import { authReceived, login, isLoading } from "../store/auth";
import auth from "../services/authService";
import http from "../services/httpService";
import loginValidationSchema from "../validation/login";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loader: {
    marginRight: 5,
  },
}));

export interface LoginProps extends RouteComponentProps {}

const defaultValues = {
  email: "",
  password: "",
};

type LoginFields = {
  email: string;
  password: string;
};

const Login: React.FC<LoginProps> = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector(isLoading);
  const { control, errors, handleSubmit } = useForm<LoginFields>({
    defaultValues,
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit: SubmitHandler<LoginFields> = async (data) => {
    await dispatch(login(data));
    http.setJwt(auth.getJwt());
    dispatch(authReceived(auth.getCurrentUser()));
    navigate("/news-feed");
  };

  const handleRegister = () => {
    setOpen(true);
  };

  if (auth.getCurrentUser()) return <Redirect to="/news-feed" noThrow />;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            control={control}
            name="email"
            as={
              <TextField
                error={errors.email ? true : false}
                disabled={loading}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                helperText={errors.email ? errors.email.message : ""}
              />
            }
          />
          <Controller
            control={control}
            name="password"
            as={
              <TextField
                error={errors.password ? true : false}
                disabled={loading}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                helperText={errors.password ? errors.password.message : ""}
              />
            }
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            disabled={loading}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {loading && (
              <CircularProgress size={20} className={classes.loader} />
            )}
            Sign In
          </Button>
          <Grid container direction="row" justify="center" alignItems="center">
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              {loading ? (
                ""
              ) : (
                <Link href="#" variant="body2" onClick={handleRegister}>
                  {"Don't have an account? Sign Up"}
                </Link>
              )}
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      <Register open={open} setOpen={setOpen} />
    </Container>
  );
};

export default Login;
