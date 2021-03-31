'use strict';

var mongoose = require('mongoose');


///start owner schema
var UserSchema = new mongoose.Schema({
	pic: {type: String, default:null},
	matchFees: String,
	fname: String,
	lname: String,
	phone: Number,
	email: String,
	uid:{type: String, default:null},
	password: String,
	state: {type: String, default:null},
	city: {type: String, default:null},
	country: {type: String, default:null},
	zip: {type: String, default:null},
	status:{type: String},
	stripe_id:{type: String}

}, {timestamps: true});

///start owner schema
var SparePlayersSchema = new mongoose.Schema({
	ownerId: String,
	fname: String,
	lname: String,
	gender: String,
	phone: Number,
	email: String,
	state: {type: String, default:null},
	city: {type: String, default:null},
	country: {type: String, default:null},
	zip: {type: String, default:null},
	status:{type: String}

}, {timestamps: true});

var SavedCardSchema = new mongoose.Schema({
	userID: String,
	customerId: String,
	sourceId: String,
	matchId: String,
	amount: String 
}, {timestamps: true})

///start Player schema
var playerSchema = new mongoose.Schema({
	pic: {type: String, default:null},
	fname: String,
	lname: String,
	gender: String,
	phone: Number,
	email: String,
	status:String,
	address:String,
	password: String,
	state: {type: String, default:null},
	city: {type: String, default:null},
	country: {type: String, default:null},
	zip: {type: String, default:null},
	weight: String,
	height:String,
	uid:{type: String, default:null},
	position:String,
	dob:String,
	goals: {type:Number,default:0},
	 cords: {
      type: {type: String},
      coordinates: [Number]
	},
	points : {type:Number,default:0},
	hasTeam: {type:String,default:0},
	stripe_id: {type: String, default:null}
}, {timestamps: true});

var ChatSchema = new mongoose.Schema({
	
    fromId: {
      type: String
    },
    toId: {
      type: Array
    },
    message: {
      type: String 
    },
    isRead: {
      type: String,
      default : 0 
    },
    fromType: {
      type: String   
    },
    toType: {
      type: String   
	},
	is_group:{
	  type: String,
	  default:0 
	},
	team_id: {
	  type: String 
	},
	amount: {
	  type: String 
	},
	is_card: {
		type: String,
		default:0  
	  },
	readIds: {
	  type: [] 
	  },
    deleted: {
	  type:[]
	},
    
},{timestamps: true});


var CalendarSchema = new mongoose.Schema({
	player_id:String,
	match_id: String,
	 
}, {timestamps: true});



//type 1 for owner and 2 for player
var OtpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  type:Number,
  status:{type: String, default:1},
}, {timestamps: true});

var MatchSchema = new mongoose.Schema({
	level: {type:Number, default:1},
	matchFees: String,
	start_day: String,
	end_day: String,
	duration : String,
	joined: {type:Number,default:0},
	owner_id: String,
	name: String,
	location: String,
	date: String,
	stime: String,
	etime: String,
	players: Number,
	team1: String,
	team2: String,
	team1_player_ids: [],
	team2_player_ids: [],
    team1_team_id: String,
	team2_team_id: String,
	team_2_type: String,
	team_1_type: String,
	gender: String,
	status: {type:Number,default:1},
	paid: {type:Number,default:0},
	request_match: String,
	fullday: String,
	alert_sent: {type:Number,default:0},
	is_near: {type:Number,default:0},
	team3_player_ids : [],
	slotted: {type:Number,default:0},
	isCancelled: {type:Number,default:0},
	propertyId: String,
	isCaptain1: {type:String,default:0},
	isCaptain2: {type:String,default:0},
	invitedTeam1: {type:String,default:0},
	invitedTeam2: {type:String,default:0},
	friendsEnteries : [],
},  {timestamps: true});

var PropertySchema = new mongoose.Schema({
	owner_id:String,
	name: String,
	area:String,
	state:String,
	city:String,
	zip:String,
	address:String,
	descr:String,
	cover:String,
	status:{type: String, default:1},
	lat:String,
	lng:String

}, {timestamps: true});


module.exports = mongoose.model('User', UserSchema);
module.exports = mongoose.model('Otp', OtpSchema);
module.exports = mongoose.model('Match', MatchSchema);
module.exports = mongoose.model('Property', PropertySchema);

///end owner schema





var joinmatchSchema = new mongoose.Schema({    
	match_id:String,
	player_id:[],
	status:{type: String, default:1},

}, {timestamps: true});



var addfavSchema = new mongoose.Schema({
		player_id:String,
		match_id:String,
		status:Number,
		status:{type: String, default:1},
}, {timestamps: true});



var followersSchema = new mongoose.Schema({
		player_id:[],
		owner_id:String,
		status:{type: String, default:1},

}, {timestamps: true});

var requestfieldSchema = new mongoose.Schema({
		transaction_id:String,
		player_id:String,
		owner_id:String,
		fullday:{type:Boolean,default:false},
		date:String,
		time:{type:String,default:null},
		comment:String,
		status:{type: String, default:1},
		payment_id:String,
		stime:String,
		etime:String,
		payment_id:String,
		players_ids: [],
		team_id: String,
		duration: String

}, {timestamps: true});


//match results

var matchresultsSchema = new mongoose.Schema({

	    match_id: String,
		name: String,
		location: String,
		team1_score: String,
		team2_score: String,
		positions_team1: String,
		positions_team2: String,
		shots_ontarget_team1: String,
		shots_ontarget_team2: String,
		touches_team1: String,
		touches_team2: String,
		shots_team1: String,
		shots_team2: String,
		status:{type: String, default:1},
		request_match:{type: String, default:0},
		fullday:{type: String},

}, {timestamps: true});


//invited players

//status 1 for active request, 2 for accepted, 3 for declined
var invitedPlayers = new mongoose.Schema({
	    match_id:String,
	    player_id:String,
		status:{type: String, default:1},

}, {timestamps: true});


//status 1 for active request, 2 for accepted, 3 for declined
var admin = new mongoose.Schema({
			fname:String,
			lname:String,
			email:String,
			password:String,
		    phone:String,
		    pic:String
		    },
			{timestamps: true});



var bookingPayment = new mongoose.Schema({
			payId:String,
			transaction_id:String,
			owner_id:String,
			match_id:String,
			player_id:String,
			amount:String,	
			type:{type:String,default:1}	   
		    },
			{timestamps: true});

var requestFieldPayments = new mongoose.Schema({
			payId:String,
			transaction_id:String,
			owner_id:String,			
			player_id:String,
			amount:String,	
			type:Number  	   
		    },
			{timestamps: true},


			);



var paymentToOwner = new mongoose.Schema({
			payId: String,
			transaction_id: String,
			owner_id: String,			
			player_id: String,
			amount: String,
			type: String,	
			matchId: String,	   
		    },
			{timestamps: true}

			);

var refunds_to_player = new mongoose.Schema({
			payId:String,
			transaction_id:String,
			owner_id:String,			
			player_id:String,
			amount:String,		   
		    },
			{timestamps: true}

			);

// 0 for no action, 1 for paid, 2 for expired			
var customerIdSchema = new mongoose.Schema({
			id:String,
			player_id:String,
			match_id:String,
			status:{type:String,default:0},		   
			},
			{timestamps: true}

			);

// 0 for unseen, 1 for paid, 2 for declined
var ConfirmationSchema = new mongoose.Schema({
			player_id:String,
			match_id:String,
			status:{type:String,default:0},		   
			},
			{timestamps: true}

			);



var NotificationsSchema = new mongoose.Schema({
    fromId: {
    	type: String
    },
    toId: {
      type: []
    },
    type: {
      type: String
    },
    isRead: {
      type: String
	},
	isNewEntry: {
		type: String,
		default: 1
	  },
    data_params: {
      type: Object
    }
   },{timestamps: true}

);

// team
var teamSchema = new mongoose.Schema({
		player_id:String,
		name:String,
		players:[],
		cover:String,
		status: {type: String, default: '1'}	   
		},
		{timestamps: true}

		);

// team invitations
var teamInvitationSchema = new mongoose.Schema({
		team_id:String,	
		team_owner_id:String,
		player_id:String,
		status:String,
		read: {default: 0, type: String}
		
		},
		{timestamps: true}

		);

//votes

var votesSchema = new mongoose.Schema({
		match_id : String,	
		toId:String,
		fromId: String,
		comment:String,
		},
		{timestamps: true}

		);

var adminDeposits = new mongoose.Schema({
		match_id: String,
		amount: String,
		player_id:  String
		},
		{timestamps: true});

var statesSchema = new mongoose.Schema( {
		states: []			 
		},
		{timestamps: true});

var termsSchema = new mongoose.Schema({
		terms:String,
		colId: String		
	    },
	    {timestamps: true});

var captainPaymentsSchema = new mongoose.Schema({
		transaction_id:String,
		captain_id:String,
		player_id:String,
		team_id:String,
		amount:String,	
		type:{type:String}	   
		},
		{timestamps: true});


	var locationAlertSchema = new mongoose.Schema({
		matchId: String,
		playerId: String,
		type:{type: String}	   
		},
		{timestamps: true});

var matchInvitesSchema = new mongoose.Schema({
		matchId: String,
		type: String,	
		playerId: String,
		captainId: String,
		status: {type: String, default:'0'},
		name: String  
		},
		{timestamps: true});

var outsiderPlayersSchema = new mongoose.Schema({
		payingPlayer: String,
		matchId: String,
		status: String,
		name: String,
		position: String
		},
		{timestamps: true});

playerSchema.index({ cords: '2dsphere' });

module.exports = mongoose.model('Player', playerSchema);
module.exports = mongoose.model('Addfav', addfavSchema);
module.exports = mongoose.model('Joinmatch', joinmatchSchema);
module.exports = mongoose.model('Followers', followersSchema);
module.exports = mongoose.model('RequestField', requestfieldSchema);
module.exports = mongoose.model('MatchResults', matchresultsSchema);
module.exports = mongoose.model('invitedPlayers', invitedPlayers);
module.exports = mongoose.model('Admin', admin);
module.exports = mongoose.model('bookingPayment', bookingPayment);
module.exports = mongoose.model('requestFieldPayments', requestFieldPayments);
module.exports = mongoose.model('Notifications', NotificationsSchema);
module.exports = mongoose.model('paymentToOwner', paymentToOwner);
module.exports = mongoose.model('refunds_to_player', refunds_to_player);
module.exports = mongoose.model('customerId', customerIdSchema);
module.exports = mongoose.model('Confirmation', ConfirmationSchema);
module.exports = mongoose.model('team', teamSchema);
module.exports = mongoose.model('teamInvitation', teamInvitationSchema);
module.exports = mongoose.model('votes', votesSchema);
module.exports = mongoose.model('chat', ChatSchema);
module.exports = mongoose.model('Calendar', CalendarSchema);
module.exports = mongoose.model('AdminDeposits', adminDeposits);
module.exports = mongoose.model('States', statesSchema);
module.exports = mongoose.model('terms', termsSchema);
module.exports = mongoose.model('captainPayments', captainPaymentsSchema);
module.exports = mongoose.model('SavedCard', SavedCardSchema);
module.exports = mongoose.model('LocationAlert', locationAlertSchema);
module.exports = mongoose.model('matchInvites', matchInvitesSchema);
module.exports = mongoose.model('outsiderPlayers', outsiderPlayersSchema);
module.exports = mongoose.model('SparePlayers', SparePlayersSchema);
