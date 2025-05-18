
const notNullAuth = (name,password) => {
    const isValid = [];
    if (!name) {
        isValid.push('Name cannot be null');
    };
    if (!password) {
        isValid.push('Password cannot be null');
    };
    return isValid;
};
module.exports = notNullAuth;