import { Router } from "express";

import { getUsers, getUser} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/',
    getUsers

)


userRouter.get('/:id',authorize,getUser)

userRouter.post('/',
    (req,res) => {
        res.send({title:"Create new User "});
    }
)
userRouter.put('/:id',
    (req,res) => {
        res.send({title:"update User by id "});
    }
)
userRouter.delete('/:id',
    (req,res) => {
        res.send({title:"delete a user "});
    }
)

export default userRouter;