import { FC } from "react";

import logo from "../../assets/img/logo512.png";

export interface CatPointProps {
  x: number;
  y: number;
  datum: {
    _y: number;
    _x: number;
  };
  size: number;
}

export const CatPoint: FC<{}> = (props) => {
  console.log(props);
  const { x, y, datum, size } = props as CatPointProps;
  const cat = datum._y >= 0 ? "😻" : "😹";
  const halfSize = size / 2;

  return (
    <image
      x={x - halfSize}
      y={y - halfSize}
      href={logo}
      height={size}
      width={size}
    />
  );
  // return (
  //   <text x={x} y={y} fontSize={size}>
  //     {cat}
  //   </text>
  // );
};
