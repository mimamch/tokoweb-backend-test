exports.responseSuccessWithData = (data) => ({ data: data });
exports.responseSuccessWithMessage = (message) => ({
  message: message ?? "Request Executed With Successfully",
});
exports.responseErrorWithDefaultMessage = () => ({
  message: "Upsss... There is a Unexpected Error",
});
exports.responseErrorWithMessage = (message) => ({ message: message });
