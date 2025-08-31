class ApiResponse {
  constructor(success, message, data = null, statusCode = 200, meta = null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.meta = meta;
  }

  send(res) {
    const response = {
      success: this.success,
      message: this.message,
    };
    if (this.data) {
      response.data = this.data;
    }
    if (this.meta) {
      response.meta = this.meta;
    }
    return res.status(this.statusCode).json(response);
  }
}

module.exports = ApiResponse;
