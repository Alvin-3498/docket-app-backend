const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
        "filename": {type:String,required:true},
        "desc": {type:String,required:true},
    }
)
let uploaddocmodel = mongoose.model("uploaddoc",schema)
module.exports = {uploaddocmodel}