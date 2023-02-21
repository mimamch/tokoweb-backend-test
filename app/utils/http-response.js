exports.responseSuccessWithData = (data) => ({ data: data });
exports.responseErrorWithDefaultMessage = () => ({
  message: "Upsss... Sepertinya Terjadi Masalah Tidak Terduga",
});
exports.responseErrorWithMessage = (message) => ({ message: message });
