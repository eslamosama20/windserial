export const validation=(schema)=>{
    return(req,res,next)=>{
         //  validate
         const data={...req.body,...req,query,...req.params}
  const validationResult = schema.validate(data, {
    abortEarly: false
  });
  if(validationResult.error){
    const errorMessage=validationResult.error.details.map((obj)=>{
      return obj.message
    })
    return next(new Error(errorMessage))
  }
  return next()

    }
}