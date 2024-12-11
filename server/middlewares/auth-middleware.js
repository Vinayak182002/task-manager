const validate = (schema) => async (req,res,next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        //calling next middleware
        next();
    } catch (error) {
        const status = 400;
        // console.log(error);
        const message = error.issues[0].message ;
        const extraDetails = "Some error occured through validators";
        next({status,message,extraDetails});
    }
};

module.exports = validate;