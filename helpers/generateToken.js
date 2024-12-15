import jsonwebtoken from "jsonwebtoken";

const generateToken = async (id) => {
    let token = await jsonwebtoken.sign({_id: id}, process.env.JWT_SECRET);
    return token;
}

export default generateToken;