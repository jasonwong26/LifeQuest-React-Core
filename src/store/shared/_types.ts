import {Action} from "redux";

export enum DataStatus {
  PENDING = "@@/PENDING",
  LOADING = "@@data/LOADING",
  READY = "@@data/READY",
  SAVING = "@@data/SAVING",
  DELETING = "@@data/DELETING"
}

export interface PayloadAction<T> extends Action {
  payload: T
}
