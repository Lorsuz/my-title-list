import mongoose from "mongoose";
const Schema = mongoose.Schema;
const tokenSchema = new Schema({	
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	token	: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 43200
	}
	},{
		timestamps: true
	} );
	const  tokenModel = mongoose.model("Token", tokenSchema);

	export default tokenModel;