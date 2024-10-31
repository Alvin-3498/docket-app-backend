const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
        "draftname": {type:String,required:true},
        "draftupload": {type:String,required:true},
    }
)
let uploaddraftsmodel = mongoose.model("uploaddrafts",schema)
module.exports = {uploaddraftsmodel}