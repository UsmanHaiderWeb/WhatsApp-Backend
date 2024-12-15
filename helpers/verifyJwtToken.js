import jsonwebtoken from 'jsonwebtoken';

const verifyJwtToken = async (token) => {
    const dataExtractedFromToken = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
    return dataExtractedFromToken?._id;
}

export default verifyJwtToken;