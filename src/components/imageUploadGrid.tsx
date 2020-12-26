import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { IImageData } from "../store/images";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      minWidth: 275,
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      marginTop: "5px",
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: "nowrap",
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: "translateZ(0)",
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    },
  })
);

export interface ImageUploadGridProps {
  images: IImageData[];
  cols?: number;
  cellHeight?: number;
}

const ImageUploadGrid: React.FC<ImageUploadGridProps> = ({
  images,
  cols = 2,
  cellHeight = 0,
}: ImageUploadGridProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={cols} cellHeight={500}>
        {images.map((image) => (
          <GridListTile key={image.name}>
            <img src={image.url} alt={image.name} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

export default ImageUploadGrid;
