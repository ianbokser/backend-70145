import bcrypt from "bcrypt"
import multer from "multer"


export const generaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaHash=(pass, hash)=>bcrypt.compareSync(pass, hash)

export const procesaErrores=(res, error)=>{
    console.log(error);
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
        {
            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle:`${error.message}`
        }
    )
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const uploader = multer({ storage: storage })