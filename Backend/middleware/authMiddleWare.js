import jwt from 'jsonwebtoken';

const tokenDecoder = async (req, res ,next) =>{
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, login again" });
    }

    try{

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(!decodedToken.id){
            return res.json({success : false, message : "Error occurs : login again"})
        }

        req.user = { id: decodedToken.id };

        next();
    }
    catch(error){
        return res.json({success : false, message : error.message})
    }
}

export default tokenDecoder;