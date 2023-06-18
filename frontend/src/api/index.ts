import { Class } from "utility-types";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Empty } from "../helpers";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

export type RequestParams<GO = any, PI = any, PO = any> = {
  url: string;
  auth?: {
    username: string;
    password: string;
  };
  getOutput?: GO;
  postInput?: PI;
  postOutput?: PO;
};

export class Request<
  GO extends Class<unknown> = any,
  PI extends Class<unknown> = any,
  PO extends Class<unknown> = any,
> {
  private url: string;
  private auth?: {
    username: string;
    password: string;
  };
  private instance: AxiosInstance;

  constructor(params: RequestParams<GO, PI, PO>) {
    this.url = params.url;
    this.auth = params.auth;
    this.instance = axios.create({
      timeout: 15000,
    });
  }

  async get(): Promise<InstanceType<GO>> {
    const res = await this.instance.get(this.url, {
      auth: this.auth,
    });
    return responseBody<InstanceType<GO>>(res);
  }

  async post(body: InstanceType<PI>): Promise<InstanceType<PO>> {
    const res = await this.instance.post(this.url, {
      auth: this.auth,
    });
    return responseBody<InstanceType<PO>>(res);
  }
}

export const createRequest = <
  GO extends Class<unknown> = typeof Empty,
  PI extends Class<unknown> = typeof Empty,
  PO extends Class<unknown> = typeof Empty,
>(
  params: RequestParams<GO, PI, PO>,
): Request<GO, PI, PO> => {
  return new Request(params);
};
