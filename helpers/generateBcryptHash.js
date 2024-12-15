import bcrypt from 'bcrypt'

const generateBcryptHash = async (text) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(text, salt);
    return hash;
}

export default generateBcryptHash;