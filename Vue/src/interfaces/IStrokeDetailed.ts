import type { IStroke } from "./IStroke";

export interface IStrokeDetailed extends IStroke {
  newR: number;
  secondDash: number;
  centerLineY: number;
  bottomLineX: number;
  topLineY1: number;
  strokeDasharray: string;
  bottomLineY1: number;
  fillCenterLineY: number;
  fillBottomLineX: number;
  fillTopLineY1: number;
  fillStrokeDasharray: string;
  circleCenterBefore: number;
  circleCenterAfter: number;
}
