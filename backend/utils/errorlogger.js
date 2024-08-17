
function createErrorResponse({
    success,
    message
}) {
   return {
       "success":success,
       "message":message
   };
}

module.exports= createErrorResponse;