import { EnvTypes } from "myria-core-sdk";
import env from "react-dotenv";

export default {
  environment: EnvTypes.STAGING,
  stark_key: env.STARK_KEY,
  owner_public_key: env.OWNER_PUBLIC_KEY
}