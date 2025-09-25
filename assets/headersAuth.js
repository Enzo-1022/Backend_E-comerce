// const { refreshToken } = require("../app");

function headersAuth (header) {
    if (header == refreshToken)
    {
        return true;
    }

    return false;

}

// module.exports = headersAuth;
