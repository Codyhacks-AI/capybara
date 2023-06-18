import { requests } from ".";

export const Flask = {
  test: async (): Promise<string> => {
    return await requests.get("");
  },
};

export default Flask;
