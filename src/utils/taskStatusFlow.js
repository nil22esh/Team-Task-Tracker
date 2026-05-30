import { TASK_STATUS_TRANSITIONS } from "../constants/taskStatus";

// validate task status transition
export const isValidTaskTransition = (currentStatus, nextStatus) => {
  return TASK_STATUS_TRANSITIONS[currentStatus]?.includes(nextStatus) || false;
};
