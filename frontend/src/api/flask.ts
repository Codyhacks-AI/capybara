import { Class } from "utility-types";
import { createRequest, Request } from ".";

const BASE_URL = "http://127.0.0.1:5000";

export const Flask = {
  test: createRequest({
    url: `${BASE_URL}/test`,
    getOutput: class {
      test!: string;
    },
  }),
};

export default Flask;
