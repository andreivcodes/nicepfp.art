import { SSTConfig } from "sst";
import { stack } from "./stacks/nicepfp";

export default {
  config(_input) {
    return {
      name: "nicepfp",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(stack);
  },
} satisfies SSTConfig;
