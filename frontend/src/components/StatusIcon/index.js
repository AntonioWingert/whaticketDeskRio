import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.8rem",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  statusDiv: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  statusP: {
    margin: "0",
  }
}));

const StatusIcon = ({ currentStatus }) => {
  const classes = useStyles();
  const status = currentStatus.toLowerCase();
  return (
    <div className={classes.root}>
      <div className={classes.statusDiv} style={{
        backgroundColor: status === "online" ? "#00ff00" : status === "offline" ? "#ff0000" : "#ffcc00",
      }} />
      <p className={classes.statusP}>{status}</p>
    </div>
  )
};

export default StatusIcon;