declare enum HTTP_STATUS_CODE {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
}
declare enum HTTP_RES_MSG {
  SUCCESS = "success",
  SERVER_UNKNOWN_ERROR = "server unknown error",
}
interface Http_Response<T> {
  code: HTTP_STATUS_CODE;
  data: T;
  msg: string;
  time: number;
}

interface getAIStreamResReqParams {
  text: string;
}

export {
  HTTP_RES_MSG,
  HTTP_STATUS_CODE,
  type Http_Response,
  type getAIStreamResReqParams,
};
