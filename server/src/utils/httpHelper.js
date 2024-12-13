class HttpHelper {
  static success(res, data = null) {
    return res.status(200).json({ success: true, data });
  }

  static error(res, { type, message, details = null }) {
    const statusCodes = {
      validation: 400,
      auth: 401,
      notFound: 404,
      conflict: 409,
      server: 500,
    };

    const response = { success: false, message };
    if (details) response.errors = details;

    return res.status(statusCodes[type] || 500).json(response);
  }
}

export default HttpHelper;
