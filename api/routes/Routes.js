'use strict';
module.exports = function(app) {

var users = require('../controllers/UsersCtrl');
var matches = require('../controllers/matchesCtrl');
var players = require('../controllers/playerCtrl');
var admin = require('../controllers/adminCtrl');



//owner routes start
		app.route('/signup')
		.get(users.getAddresses)
		.delete(users.delete_address)
		.post(users.add_user);

		app.route('/confirmEmail/:_id')
		.get(users.confirmEmail);

		app.route('/login')
		.post(users.user_login);

		app.route('/forgotpassword')	
		.post(users.getotp);

		app.route('/resetpassword')
		.post(users.resetpassword);

		app.route('/updateinfo')
		.post(users.updateinfo);

		app.route('/updatepassword')
		.post(users.updatepassword);


		app.route('/getFieldRequests')
		.post(users.getFieldRequests);

		app.route('/actionOnFieldReq')
		.post(users.actionOnFieldReq);

		app.route('/getnearbyUsers')
		.post(users.getnearbyUsers);


		app.route('/addMatchResults')
		.post(users.addMatchResults);

		app.route('/getaAllPlayers')
		.post(users.getaAllPlayers);

		app.route('/sendInvite')
		.post(users.sendInvite);


		app.route('/getResults')
		.post(users.getResults);


		app.route('/searchplayerforInvitation')
		.post(users.searchplayerforInvitation);

		app.route('/cancelMatch')
		.post(users.cancelMatch);

		app.route('/get_owner_notifications')
		.post(users.get_owner_notifications);


		app.route('/clear_owner_notifications')
		.post(users.clear_owner_notifications);

		app.route('/searchhome')
		.post(users.searchhome);


		app.route('/stripe_redirect')
		.get(users.stripe_redirect);


		app.route('/get_profile')
		.post(users.get_profile);

		app.route('/get_owner_transaction')
		.post(users.get_owner_transaction);

		app.route('/getPlayersForAddMatch')
		.post(users.getPlayersForAddMatch);
		
		app.route('/getTeamsForAddMatch')
		.post(users.getTeamsForAddMatch);

		app.route('/getTemInfo')
		.post(users.getTemInfo);
		
		app.route('/facilityLogout')
		.post(users.facilityLogout);

		app.route('/playerLogout')
		.post(users.playerLogout);


		app.route('/getPlayersForAddMatchNew')
		.post(users.getPlayersForAddMatchNew);

		app.route('/getTeamsForAddMatchNew')
		.post(users.getTeamsForAddMatchNew);

		app.route('/add_Spare')
		.post(users.add_Spare);

		app.route('/get_Spares')
		.post(users.get_Spares);

		app.route('/remove_Spare')
		.post(users.remove_Spare);



	
//owner routes end

//match routes start	

		app.route('/fcmTest')
		.post(matches.fcmTest);

		app.route('/todayMatches')
		.post(matches.todayMatches);


		app.route('/upcomingMatches')
		.post(matches.upcomingMatches);

		app.route('/searchmatch')
		.post(matches.searchmatch);

		app.route('/updatePropertyByOwner')
		.post(matches.updatePropertyByOwner);

		app.route('/ownerMyPreviousMatches')
		.post(matches.ownerMyPreviousMatches);





//match routes end

//my matches routes start

		app.route('/addmatch')
		.post(matches.addmatch);

		app.route('/todayMatches')
		.post(matches.todayMatches);


		app.route('/upcomingMatches')
		.post(matches.upcomingMatches);



		app.route('/myupcomingMatches')
		.post(matches.myupcomingMatches);

		app.route('/mypreviousMatches')
		.post(matches.mypreviousMatches);


		app.route('/ownerTodayMatches')
		.post(matches.ownerTodayMatches);

		app.route('/ownerUpcomingMatches')
		.post(matches.ownerUpcomingMatches);


//my matches routes end

//property routes start

		app.route('/updateProperty')
		.post(matches.updateProperty);

		app.route('/getProperty')
		.post(matches.getProperty);
		
		app.route('/ownersearchMatches')
		.post(matches.ownersearchMatches);
		
		app.route('/getPropertiesArray')
		.post(matches.getPropertiesArray);

		app.route('/getPropertyById')
		.post(matches.getPropertyById);

		app.route('/updatePropertyById')
		.post(matches.updatePropertyById);

		app.route('/deletePropertyByID')
		.post(matches.deletePropertyByID);

		app.route('/cancelGameManually')
		.post(matches.cancelGameManually);

//property routes end

//player routes start

		app.route('/joinGuest')
		.post(players.joinGuest);

		app.route('/unJoinGuest')
		.post(players.unJoinGuest);

		app.route('/LeaveWithFriends')
		.post(players.LeaveWithFriends);


		app.route('/JoinWithFriends')
		.post(players.JoinWithFriends);

		app.route('/deleteGroupChat')
		.post(players.deleteGroupChat);

		app.route('/saveCard')
		.post(players.saveCard);

		app.route('/deleteChat')
		.post(players.deleteChat);

		app.route('/saveCalendar')
		.post(players.saveCalendar);

		app.route('/JoinWithTeam')
		.post(players.JoinWithTeam);

		app.route('/getSelectedPlayers')
		.post(players.getSelectedPlayers);

		app.route('/searchPlayers')
		.post(players.searchPlayers);

		app.route('/get_unread_messages')
		.post(players.get_unread_messages);

		app.route('/getConfirmations')
		.post(players.getConfirmations);

		app.route('/confirmPlayerEmail/:_id')
		.get(players.confirmPlayerEmail);

		app.route('/p_signup')
		.post(players.p_signup);

		app.route('/p_login')
		.post(players.p_login);

		app.route('/p_updateinfo/:_id/:email')
		.post(players.p_updateinfo);

		app.route('/p_updatepassword')
		.post(players.p_updatepassword);	

		app.route('/p_addfav')
		.post(players.p_addfav);	

		app.route('/p_getfav')
		.post(players.p_getfav);

		app.route('/p_srchfav')
		.post(players.p_srchfav);

		app.route('/p_matchdetails')
		.post(players.p_matchdetails);

		app.route('/Joinmatch')
		.post(players.Joinmatch);

		app.route('/getJoinmatch')
		.post(players.getJoinmatch);

		app.route('/ownerdetail')
		.post(players.ownerdetail);

		app.route('/followOwner')
		.post(players.followOwner);

		app.route('/getfollowOwner')
		.post(players.getfollowOwner);

		app.route('/searchfollowOwner')
		.post(players.searchfollowOwner);

		app.route('/playerUpMatches')
		.post(players.playerUpMatches);

		app.route('/fieldRequest')
		.post(players.fieldRequest);

		app.route('/playerGetOtp')
		.post(players.playerGetOtp);

		app.route('/playerResetPassword')
		.post(players.playerResetPassword);


		app.route('/bookMatchPayment')
		.post(players.bookMatchPayment);

		app.route('/transaction_details')
		.post(players.transaction_details);

		app.route('/requestFieldPaymentFun')
		.post(players.requestFieldPaymentFun);

		app.route('/get_player_notifications')
		.post(players.get_player_notifications);


		app.route('/clear_player_notifications')
		.post(players.clear_player_notifications);

		app.route('/location_update')
		.post(players.location_update);

		app.route('/ConfirmAvailabilty')
		.post(players.ConfirmAvailabilty);

		app.route('/getPlayersForMatch')
		.post(players.getPlayersForMatch);
		
		app.route('/createTeam')
		.post(players.createTeam);

		app.route('/getAllInvitations')
		.post(players.getAllInvitations);

		app.route('/actionOnTeaminvitation')
		.post(players.actionOnTeaminvitation);

		app.route('/getPlayerInfo')
		.post(players.getPlayerInfo);

		app.route('/getJoinedPlayers')
		.post(players.getJoinedPlayers);

		app.route('/voteForMOTM')
		.post(players.voteForMOTM);


		app.route('/getMyVotes')
		.post(players.getMyVotes);

		app.route('/getPlayersForRequestField')
		.post(players.getPlayersForRequestField);

		app.route('/getAllOwners')
		.post(players.getAllOwners);
		
		app.route('/searchNonfollowOwner')
		.post(players.searchNonfollowOwner);

		app.route('/getTeamInfo')
		.post(players.getTeamInfo);


		app.route('/confirmPayment')
		.post(players.confirmPayment);

		app.route('/getHoursOfPlay')
		.post(players.getHoursOfPlay);

		app.route('/newGetJoinmatch')
		.post(players.newGetJoinmatch);

		app.route('/playerAllInfo')
		.post(players.playerAllInfo);

		app.route('/add_chat')
		.post(players.add_chat);

		app.route('/get_chat')
		.post(players.get_chat);

		app.route('/get_all_chats')
		.post(players.get_all_chats);

		app.route('/LeaveMatchWithTeam')
		.post(players.LeaveMatchWithTeam);


		app.route('/remove_player_from_team')
		.post(players.remove_player_from_team);

		app.route('/add_players_to_team')
		.post(players.add_players_to_team);

		app.route('/getFollowingList')
		.post(players.getFollowingList);

		app.route('/search')
		.post(players.search);

		app.route('/searchPlayers1')
		.post(players.searchPlayers1);

		app.route('/group_chat')
		.post(players.group_chat);

		app.route('/get_group_chat')
		.post(players.get_group_chat);

		app.route('/getTeamPlayerIds')
		.post(players.getTeamPlayerIds);


		app.route('/sendLink')
		.post(players.sendLink);


		app.route('/payToCaptain')
		.post(players.payToCaptain);


		app.route('/credits_details')
		.post(players.credits_details);

		app.route('/changeTeamPic')
		.post(players.changeTeamPic);

		app.route('/updateTeamName')
		.post(players.updateTeamName);

		app.route('/dltSingleMsg')
		.post(players.dltSingleMsg);

		app.route('/checkSavedCard')
		.post(players.checkSavedCard);

		app.route('/confirmPayment_1')
		.post(players.confirmPayment_1);

		app.route('/getTeamData')
		.post(players.getTeamData);

		app.route('/checkAvailability')
		.post(players.checkAvailability);

		app.route('/noOfFollowers')
		.post(players.noOfFollowers);

		app.route('/checkAvailabilityForTeam')
		.post(players.checkAvailabilityForTeam);

		app.route('/get_untouched_confirmations')
		.post(players.get_untouched_confirmations);

		app.route('/get_unread_notifications')
		.post(players.get_unread_notifications);

		app.route('/read_unread_notifications')
		.post(players.read_unread_notifications);


		app.route('/saveCardForOutsider')
		.post(players.saveCardForOutsider);

		app.route('/read_unread_invitations')
		.post(players.read_unread_invitations);

		app.route('/get_untouched_invitations')
		.post(players.get_untouched_invitations);

		app.route('/checkIfAlreadyJoined')
		.post(players.checkIfAlreadyJoined);

//admin routes
		app.route('/addPlayerByAdmin/:email')
		.post(admin.addPlayerByAdmin);

		app.route('/getOwners')
		.post(admin.getOwners);

		app.route('/deleteOwner')
		.post(admin.deleteOwner);


		app.route('/ownerNProperty')
		.post(admin.ownerNProperty);

		app.route('/update_PlayerByAdmin/:email/:_id')
		.post(admin.update_PlayerByAdmin);

		app.route('/editProperty')
		.post(admin.editProperty);


		app.route('/getPlayers')
		.post(admin.getPlayers);

		app.route('/deletePlayer')
		.post(admin.deletePlayer);

		app.route('/getPlayer')
		.post(admin.getPlayer);

		app.route('/updatePByadmin/:email/:_id')
		.post(admin.updatePByadmin);

		app.route('/addPByadmin/:email')
		.post(admin.addPByadmin);


		app.route('/adminTodayMatches')
		.post(admin.adminTodayMatches);


		app.route('/adminUpcomingMatches')
		.post(admin.adminUpcomingMatches);

		app.route('/adminPreviousMatches')
		.post(admin.adminPreviousMatches);

		app.route('/adminMatchDetails')
		.post(admin.adminMatchDetails);

		app.route('/CancelMatchByAdmin')
		.post(admin.CancelMatchByAdmin);


		app.route('/invitePlayerByAdmin')
		.post(admin.invitePlayerByAdmin);

		app.route('/getPlayersByAdmin')
		.post(admin.getPlayersByAdmin);


		app.route('/getResultsByAdmin')
		.post(admin.getResultsByAdmin);


		app.route('/adminAuth')
		.post(admin.adminAuth);

		app.route('/getAdminProfile')
		.post(admin.getAdminProfile);

		app.route('/updateAdminProfile/:email/:_id')
		.post(admin.updateAdminProfile);

		app.route('/AdminPasswordUpdate')
		.post(admin.AdminPasswordUpdate);

		app.route('/addMByAdmin/:_id/:stime/:etime/:date')
		.post(admin.addMByAdmin);

		app.route('/dashboardOwners')
		.post(admin.dashboardOwners);


		app.route('/dashboardPlayers')
		.post(admin.dashboardPlayers);

		app.route('/deleteTeam')
		.post(admin.deleteTeam);
		
		app.route('/manageTeamAdmin')
		.post(admin.manageTeamAdmin);


		app.route('/getAdminDeposits')
		.post(admin.getAdminDeposits);


	    app.route('/getVotesData')
		.post(admin.getVotesData);

		app.route('/getPlayersForVote')
		.post(admin.getPlayersForVote);

	    app.route('/getTeamsForAdmin')
		.post(admin.getTeamsForAdmin);

		app.route('/getStates')
		.post(admin.getStates);

		app.route('/updatePropertyByOwner1/:email')
		.post(admin.updatePropertyByOwner1);

		app.route('/OwnersForTeam')
		.post(admin.OwnersForTeam);
		
		app.route('/PlayersForTeamAdmin')
		.post(admin.PlayersForTeamAdmin);

		app.route('/updateTeam')
		.post(admin.updateTeam);


		app.route('/updateTerms')
		.post(admin.updateTerms);

		app.route('/getTerms')
		.post(admin.getTerms);

		app.route('/saveInsta')
		.post(admin.saveInsta);
		





};
