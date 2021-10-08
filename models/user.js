var mongoose = require("mongoose");

const crypto = require("crypto");

const uuidv1 = require('uuid/v1');

var userSchema = new mongoose.Schema({
  username : {
      type: String,
      required: true,
      unique: true,
      maxlength: 32,
      trim: true
  },
  Name : {
    type: String,
  },
  Email : {
   type : String
  },
  Montly_Income : {
      type : String
  },

  DOB : {
    type: String,
    required : true
},
 Nationality : {
     type : String
 },
 Profession : {
     type : String
 },
 Account_Number :{
     type : String
 },
  encry_password: {
       type: String,
       required: true

  },
  
  salt: String,

 
},{timestamps: true});


userSchema.virtual("password")
  .set(function(password){
      this._password = password;
      this.salt = uuidv1();
      this.encry_password = this.securePassword(password);
  })
  .get(function(){
      return this._password;
  })



userSchema.methods = {

    autheticate: function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;
    },

    securePassword: function(plainpassword){
        if(!plainpassword){
            return "";
        }
        try{
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
        } catch(err){
            return "";

        }
    }
}



module.exports = mongoose.model("User", userSchema);



