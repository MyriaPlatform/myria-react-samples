import axios from "axios";

const stagingLink =
  "https://staging.myriacore-marketp-api.nonprod-myria.com/v1";
const prodLink = "https://myriacore-marketp-api.nonprod-myria.com/v1";

export async function getListProjectByStarkKey(
  networkId: number,
  starkKey: string
) {
  const data = await axios.get(
    networkId === 1 ? prodLink : stagingLink + `projects/stark-key/${starkKey}`
  );
  return data.data;
}
