const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
        "empid": {type:String,required:true},
        "empname": {type:String,required:true},
        "email": {type:String,required:true},
        "mobileno": {type:String,required:true},
        "gender": {type:String,required:true},
        "pass": {type:String,required:true},
        "cpass":{type:String,required:true},
    }
)
let docket1model = mongoose.model("docket1",schema)
module.exports={docket1model}