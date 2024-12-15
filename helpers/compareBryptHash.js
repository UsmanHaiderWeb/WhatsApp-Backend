import bcrypt from 'bcrypt';

const compareBcryptHashPassword = async (password, hash) => {
    try {
        let result = await bcrypt.compare(password, hash);
        return result
    } catch (error) {
        console.log('COMPARING BCRYPT HASH PASSWORD ERROR: ', error.message);
    }
}

export default compareBcryptHashPassword;