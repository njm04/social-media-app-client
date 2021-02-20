import Badge from "@material-ui/core/Badge";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      marginTop: 330,
      backgroundColor: "#44b700",
      height: 20,
      width: 20,
      borderRadius: "50%",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "$ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  })
)(Badge);

export default StyledBadge;
