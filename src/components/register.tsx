import React, { useState, useEffect, forwardRef } from "react";
import { useDispatch } from "react-redux";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import { TransitionProps } from "@material-ui/core/transitions";
import DatePicker from "./common/datePicker";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { registerUser } from "../store/users";
import { IRegisterUser } from "../interfaces/users";
import registrationValiditionSchema from "../validation/registration";
import { yupResolver } from "@hookform/resolvers/yup";

const useStyles = makeStyles((theme: Theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface RegisterProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  birthDate: new Date(),
  gender: "",
};

const Register: React.FC<RegisterProps> = ({
  open,
  setOpen,
}: RegisterProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    control,
    errors,
    handleSubmit,
    reset,
    clearErrors,
    formState: { isSubmitSuccessful },
  } = useForm<IRegisterUser>({
    defaultValues,
    resolver: yupResolver(registrationValiditionSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) reset(defaultValues);
  }, [isSubmitSuccessful, open, reset]);

  const onSubmit: SubmitHandler<IRegisterUser> = (data) => {
    dispatch(registerUser(data));
  };

  const handleClose = () => {
    setOpen(false);
    reset(defaultValues);
    clearErrors();
  };

  return (
    <div>
      <Dialog
        TransitionComponent={Transition}
        keepMounted
        open={open}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Sign Up
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider variant="middle" />
        <DialogContent>
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item xs>
                <Controller
                  control={control}
                  name="firstName"
                  as={
                    <TextField
                      error={errors.firstName ? true : false}
                      required
                      label="First name"
                      id="register-firstName"
                      placeholder="First name"
                      variant="outlined"
                      fullWidth
                      helperText={
                        errors.firstName ? errors.firstName.message : ""
                      }
                    />
                  }
                />
              </Grid>
              <Grid item xs>
                <Controller
                  control={control}
                  name="lastName"
                  as={
                    <TextField
                      error={errors.lastName ? true : false}
                      required
                      label="Last name"
                      id="register-lastName"
                      placeholder="Last name"
                      variant="outlined"
                      fullWidth
                      helperText={
                        errors.lastName ? errors.lastName.message : ""
                      }
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="email"
                  as={
                    <TextField
                      error={errors.email ? true : false}
                      required
                      label="Email"
                      id="register-email"
                      placeholder="Email"
                      variant="outlined"
                      fullWidth
                      helperText={errors.email ? errors.email.message : ""}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="password"
                  as={
                    <TextField
                      error={errors.password ? true : false}
                      required
                      id="register-password"
                      label="Password"
                      type="password"
                      autoComplete="current-password"
                      variant="outlined"
                      fullWidth
                      helperText={
                        errors.password ? errors.password.message : ""
                      }
                    />
                  }
                />
              </Grid>
              <Grid item xs>
                <Controller
                  control={control}
                  name="birthDate"
                  render={(props) => (
                    <DatePicker value={props.value} onChange={props.onChange} />
                  )}
                />
              </Grid>
              <Grid item xs>
                <Controller
                  control={control}
                  name="gender"
                  as={
                    <TextField
                      required
                      id="register-gender"
                      select
                      label="Select Gender"
                      defaultValue=""
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        Select Gender
                      </MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Unspecified">
                        Prefer not to specify
                      </MenuItem>
                    </TextField>
                  }
                />
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Sign Up
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
