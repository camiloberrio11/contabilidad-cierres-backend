export function responseHttpService(
  code: number,
  dataResponse: any,
  message: string,
  ok: boolean,
  res: any
) {
  return res.status(code).json({
    ok,
    message,
    data: dataResponse,
  });
}