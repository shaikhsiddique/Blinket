const bcrypt = require('bcrypt');

const hashPassword = (data)=>{
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(data, salt);
    return hashedPassword;
}
module.exports = hashPassword;