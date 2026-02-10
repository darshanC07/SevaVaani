import { getUserId } from "../utils/AsyncStorageUtils";
import * as TaskManager from "expo-task-manager";
import { UpdateWorkerLoc } from "../services/GlobalAPIs";

export const LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) return;

  if (!data?.locations?.length) return;

  const user = await getUserId();
//   if (!user) return;

  const { latitude, longitude } = data.locations[0].coords;

  await UpdateWorkerLoc(user, latitude, longitude);
  // await UpdateClientLoc("0qD34d7S4FaD6afL6cVN3nOE9zJ2", latitude, longitude);
});
