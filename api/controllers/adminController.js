"use strict";
var constants = require("../constants/constants"),
  errors = ["", null, undefined];

//modules
var mongoose = require("mongoose"),
  path = require("path"),
  passwordHash = require("password-hash"),
  otpGenerator = require("otp-generator"),
  FCM = require("fcm-node"),
  fcm = new FCM(constants.FCM_SERVER_KEY),
  arraySort = require("array-sort"),
  NodeGeocoder = require("node-geocoder"),
  fs = require("fs"),
  sg = require("sendgrid")(constants.SENDGRID_ID),
  multer = require("multer"),
  filesUpload = require("../logic/uploadFiles");

//tables
var OTPTable = mongoose.model("OTP"),
  UserTable = mongoose.model("User"),
  AdminTable = mongoose.model("Admin"),
  GroupTable = mongoose.model("Group"),
  DynamicDataTable = mongoose.model("DynamicData"),
  FriendsTable = mongoose.model("Friend");

//exported functions

exports.tryLoginAdmin = tryLoginAdmin;
exports.Admin_updateUserProfileData = Admin_updateUserProfileData;
exports.Admin_updateAuthPassword = Admin_updateAuthPassword;
exports.Admin_fetchAllUsers = Admin_fetchAllUsers;
exports.Admin_getUserDetail = Admin_getUserDetail;
exports.Admin_fetchSingleUser = Admin_fetchSingleUser;
exports.Admin_updateUserAuthPassword = Admin_updateUserAuthPassword;
exports.Admin_updateUserStatus = Admin_updateUserStatus;
exports.Admin_addNewUser = Admin_addNewUser;
exports.Admin_setNewPassword = Admin_setNewPassword;
exports.getAllGroups = getAllGroups;
exports.getSingleGroupDetailsAdmin = getSingleGroupDetailsAdmin;
exports.Admin_updateGroupStatus = Admin_updateGroupStatus;
exports.Admin_updateDynamicData = Admin_updateDynamicData;
exports.getDynamicData = getDynamicData;
exports.getDynamicDataById = getDynamicDataById;
exports.removeFromGroup = removeFromGroup;
(exports.removeGroup = removeGroup), (exports.getUserFriends = getUserFriends);
exports.removeFriend = removeFriend;

//functions logic

async function tryLoginAdmin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (errors.indexOf(email) >= 0)
      return res.json({ status: false, msg: "Please provide the email." });
    if (errors.indexOf(password) >= 0)
      return res.json({ status: false, msg: "Please provide the password." });

    var isUser = await AdminTable.findOne(
      { email: email },
      {},
      { sort: { createdAt: -1 } }
    );

    if (isUser != null) {
      var isMatch = passwordHash.verify(password, isUser.password)
        ? true
        : false;
    } else
      return res.json({
        status: false,
        msg: "Either your email or password is wrong",
      });

    if (isMatch) {
      return res.json({ status: true, msg: "Access permitted", data: isUser });
    } else
      return res.json({
        status: false,
        msg: "You have provided wrong password",
      });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function Admin_updateUserProfileData(req, res, next) {
  try {
    filesUpload.uploadPic(req, res, function (err) {
      console.log(req.body);
      const { id, email, phone, name, state, address, country } = req.body;
      if (errors.indexOf(id) >= 0)
        return res.json({ status: false, msg: "Please provide the id." });
      if (errors.indexOf(email) >= 0)
        return res.json({ status: false, msg: "Please provide the email." });
      if (errors.indexOf(phone) >= 0)
        return res.json({ status: false, msg: "Please provide the phone." });
      if (errors.indexOf(name) >= 0)
        return res.json({ status: false, msg: "Please provide the name." });
      var newData = {
        name: req.body.name,
        phone: phone,
        email: email,
        address: address,
        country: country,
        state: state,
      };
      if (req.file != undefined) newData["pic"] = req.file.filename;

      AdminTable.updateOne({ _id: id }, newData, function (err, response) {
        AdminTable.findOne({ _id: id }, function (err, userData) {
          if (err == null)
            return res.json({
              status: true,
              msg: "Profile is updated",
              data: userData,
            });
          else
            return res.json({
              status: false,
              msg: "Something Went Wrong. Please Try Again!",
            });
        });
      });
    });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function Admin_updateAuthPassword(req, res, next) {
  try {
    const { id, oldPassword, newPassword } = req.body;
    if (errors.indexOf(id) >= 0)
      return res.json({ status: false, msg: "Please provide the id." });
    if (errors.indexOf(oldPassword) >= 0)
      return res.json({
        status: false,
        msg: "Please provide the oldPassword.",
      });
    if (errors.indexOf(newPassword) >= 0)
      return res.json({
        status: false,
        msg: "Please provide the newPassword.",
      });

    var userDetails = await AdminTable.findOne({ _id: id });

    var isMatch = passwordHash.verify(oldPassword, userDetails.password)
      ? true
      : false;

    if (!isMatch)
      return res.json({ status: false, msg: "Your old password is wrong." });

    AdminTable.updateOne(
      { _id: id },
      { password: passwordHash.generate(newPassword) },
      function (err, response) {
        if (err == null)
          return res.json({ status: true, msg: "Your password is updated." });
        else
          return res.json({
            status: false,
            msg: "Something Went Wrong. Please Try Again!",
          });
      }
    );
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function Admin_fetchAllUsers(req, res, next) {
  try {
    const { limit } = req.body;
    if (errors.indexOf(limit) >= 0)
      return res.json({ status: false, msg: "Please provide the limit." });

    var userList = await UserTable.find({ status: { $nin: [0] } }, null, {
      sort: { createdAt: -1 },
      limit: limit != "infinity" ? limit : 1000000000000000,
    });
    var userListCount = await UserTable.count({});
    var groups = await GroupTable.count();
    return res.json({
      status: true,
      data: userList,
      groupsCount: groups,
      userListCount: userListCount,
    });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function Admin_getUserDetail(req, res, next) {
  try {
    const { id } = req.body;
    if (errors.indexOf(id) >= 0)
      return res.json({ status: false, msg: "Please provide the id." });

    var groups = await GroupTable.find({ members: { $in: [id] }, status: 1 });

    return res.json({ status: true, groups: groups });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function Admin_fetchSingleUser(req, res, next) {
  try {
    const { id } = req.body;
    if (errors.indexOf(id) >= 0)
      return res.json({ status: false, msg: "Please provide the id." });

    var userDetails = await UserTable.findOne({ _id: id });

    return res.json({ status: true, data: userDetails });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function Admin_updateUserAuthPassword(req, res, next) {
  try {
    const { id, newPassword, confirmPassword } = req.body;
    if (errors.indexOf(id) >= 0)
      return res.json({ status: false, msg: "Please provide the id." });

    if (errors.indexOf(newPassword) >= 0)
      return res.json({
        status: false,
        msg: "Please provide the newPassword.",
      });

    if (newPassword != confirmPassword)
      return res.json({
        status: false,
        msg: "New password and confirm passwords do not match.",
      });

    UserTable.updateOne(
      { _id: id },
      { password: passwordHash.generate(newPassword) },
      function (err, response) {
        if (err == null)
          return res.json({ status: true, msg: "Your password is updated." });
        else
          return res.json({
            status: false,
            msg: "Something Went Wrong. Please Try Again!",
          });
      }
    );
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function Admin_updateUserStatus(req, res, next) {
  try {
    const { id, status } = req.body;
    if (errors.indexOf(id) >= 0)
      return res.json({ status: false, msg: "Please provide the id." });

    if (errors.indexOf(status) >= 0)
      return res.json({ status: false, msg: "Please provide the status." });

    UserTable.updateOne(
      { _id: id },
      { status: status },
      function (err, response) {
        if (err == null)
          return res.json({ status: true, msg: "status is updated." });
        else
          return res.json({
            status: false,
            msg: "Something Went Wrong. Please Try Again!",
          });
      }
    );
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function Admin_addNewUser(req, res, next) {
  try {
    console.log(req.params);
    const { email, phone } = req.params;
    if (errors.indexOf(email) >= 0)
      return res.json({ status: false, msg: "Please provide the email." });
    if (errors.indexOf(phone) >= 0)
      return res.json({ status: false, msg: "Please provide the phone." });

    var doesEmailExist = await UserTable.find({ email: email });
    if (doesEmailExist.length != 0)
      return res.json({
        status: false,
        msg: "This email is already in use, Please use another",
      });

    var doesPhoneExist = await UserTable.find({ phone: Number(phone) });
    if (doesPhoneExist.length != 0)
      return res.json({
        status: false,
        msg: "This phone is already in use, Please use another",
      });

    filesUpload.uploadPic(req, res, function (err) {
      const { name, newPassword } = req.body;
      if (errors.indexOf(name) >= 0)
        return res.json({ status: false, msg: "Please provide the name." });
      if (errors.indexOf(newPassword) >= 0)
        return res.json({
          status: false,
          msg: "Please provide the newPassword.",
        });

      var newData = {
        name: req.body.name,
        phone: phone,
        email: email,
        password: passwordHash.generate(newPassword),
      };
      if (req.file != undefined) newData["pic"] = req.file.filename;

      var newUser = new UserTable(newData);

      newUser.save(function (err, response) {
        if (err == null)
          return res.json({ status: true, msg: "New user is created." });
        else
          return res.json({
            status: false,
            msg: "Something Went Wrong. Please Try Again!",
          });
      });
    });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function Admin_setNewPassword(req, res, next) {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (errors.indexOf(email) >= 0)
      return res.json({ status: false, msg: "Please provide the email." });

    if (errors.indexOf(newPassword) >= 0)
      return res.json({
        status: false,
        msg: "Please provide the newPassword.",
      });

    if (newPassword != confirmPassword)
      return res.json({
        status: false,
        msg: "New password and confirm passwords do not match.",
      });

    AdminTable.updateOne(
      { email: email },
      { password: passwordHash.generate(newPassword) },
      function (err, response) {
        if (err == null)
          return res.json({ status: true, msg: "Your password is updated." });
        else
          return res.json({
            status: false,
            msg: "Something Went Wrong. Please Try Again!",
          });
      }
    );
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function getAllGroups(req, res, next) {
  try {
    var response1 = await GroupTable.find({ status: { $nin: [0] } });

    if (response1.length != 0) {
      var cont = 0;
      var groupList = [];
      for (let key of response1) {
        cont++;
        var allMembers = [];
        var cont1 = 0;
        var admin = await UserTable.findOne({ _id: key.admin }, "_id name pic");

        for (let key1 of key.members) {
          var userDetails = await UserTable.findOne(
            { _id: key1 },
            "_id name pic"
          );

          allMembers.push(userDetails);
          cont1++;
          if (cont1 == key.members.length) {
            var name = key.name.split(" ");
            var dist = {
              admin: admin,
              createdAt: key.createdAt,
              members: allMembers,
              name: key.name,
              name1: name[0].split("")[0].toUpperCase(),
              name2:
                name[1] != undefined
                  ? name[1].split("")[0].toUpperCase()
                  : null,
              paymentStatus: key.paymentStatus,
              pic: key.pic,
              _id: key._id,
            };

            groupList.push(dist);

            if (cont == response1.length)
              return res.json({
                status: true,
                msg: "groups list",
                data: groupList,
              });
          }
        }
      }
    } else
      return res.json({
        status: false,
        msg: "Something Went Wrong. Please Try Again!",
      });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function getSingleGroupDetailsAdmin(req, res, next) {
  try {
    const { groupId } = req.body;
    if (errors.indexOf(groupId) >= 0)
      return res.json({ status: false, msg: "Please provide the groupId." });

    var response1 = await GroupTable.findOne({ _id: groupId });
    var admin = await UserTable.findOne({ _id: response1.admin });

    if (response1 != null) {
      var cont = 0;
      var allMembers = [];
      for (let key of response1.members) {
        var userDetails = await UserTable.findOne({ _id: key });
        allMembers.push(userDetails);
        cont++;

        if (cont == response1.members.length) {
          var name = response1.name.split(" ");
          var ResData = {
            admin: admin,
            createdAt: response1.createdAt,
            members: allMembers,
            name: response1.name,
            name1: name[0].split("")[0].toUpperCase(),
            name2:
              name[1] != undefined ? name[1].split("")[0].toUpperCase() : null,
            paymentStatus: response1.paymentStatus,
            pic: response1.pic,
            _id: response1._id,
          };

          return res.json({ status: true, msg: "groups list", data: ResData });
        }
      }
    } else
      return res.json({
        status: false,
        msg: "Something Went Wrong. Please Try Again!",
      });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function Admin_updateGroupStatus(req, res, next) {
  try {
    const { id, status } = req.body;
    if (errors.indexOf(id) >= 0)
      return res.json({ status: false, msg: "Please provide the id." });

    if (errors.indexOf(status) >= 0)
      return res.json({ status: false, msg: "Please provide the status." });

    GroupTable.updateOne(
      { _id: id },
      { status: status },
      function (err, response) {
        if (err == null)
          return res.json({ status: true, msg: "status is updated." });
        else
          return res.json({
            status: false,
            msg: "Something Went Wrong. Please Try Again!",
          });
      }
    );
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function Admin_updateDynamicData(req, res, next) {
  try {
    const { id, title, desc } = req.body;
    if (errors.indexOf(id) >= 0)
      return res.json({ status: false, msg: "Please provide the id." });

    if (errors.indexOf(title) >= 0)
      return res.json({ status: false, msg: "Please provide the title." });

    if (errors.indexOf(desc) >= 0)
      return res.json({ status: false, msg: "Please provide the desc." });

    DynamicDataTable.updateMany(
      { page: id },
      { title: title, desc: desc, page: id },
      { upsert: true },
      function (err, response) {
        if (err != null)
          return res.json({
            status: false,
            msg: "Something Went Wrong. Please Try Again!",
          });
        else return res.json({ status: true, msg: "Data is updated." });
      }
    );
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function getDynamicData(req, res, next) {
  try {
    DynamicDataTable.find(function (err, response) {
      if (response.length != 0)
        return res.json({
          status: true,
          msg: "status is updated.",
          data: response,
        });
      else
        return res.json({
          status: false,
          msg: "Something Went Wrong. Please Try Again!",
        });
    });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function getDynamicDataById(req, res, next) {
  try {
    const { id } = req.body;
    if (errors.indexOf(id) >= 0)
      return res.json({ status: false, msg: "Please provide the id." });

    DynamicDataTable.findOne({ page: id }, function (err, response) {
      if (response != null)
        return res.json({
          status: true,
          msg: "status is updated.",
          data: response,
        });
      else
        return res.json({
          status: false,
          msg: "Something Went Wrong. Please Try Again!",
        });
    });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function removeFromGroup(req, res, next) {
  try {
    const { id, members } = req.body;
    if (errors.indexOf(id) >= 0)
      return res.json({ status: false, msg: "Please provide the group id." });
    if (errors.indexOf(members) >= 0)
      return res.json({ status: false, msg: "Please provide the member ids." });

    var memberIDS = JSON.parse(members);

    GroupTable.updateOne(
      { _id: id },
      { $pull: { members: { $in: memberIDS } } },
      function (err, response) {
        if (err == null)
          return res.json({
            status: true,
            msg: "Member is removed.",
            data: response,
          });
        else
          return res.json({
            status: false,
            msg: "Something Went Wrong. Please Try Again!",
          });
      }
    );
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function removeGroup(req, res, next) {
  try {
    const { id } = req.body;

    if (errors.indexOf(id) >= 0)
      return res.json({ status: false, msg: "Please provide the group id." });

    GroupTable.updateOne({ _id: id }, { status: 0 }, function (err, response) {
      if (err == null)
        return res.json({
          status: true,
          msg: "Group is removed.",
          data: response,
        });
      else
        return res.json({
          status: false,
          msg: "Something Went Wrong. Please Try Again!",
        });
    });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function getUserFriends(req, res, next) {
  try {
    const { id } = req.body;

    if (errors.indexOf(id) >= 0)
      return res.json({ status: false, msg: "Please provide the user id." });

    FriendsTable.find(
      { userId: id, status: 1 },
      async function (err, response) {
        if (response.length != 0) {
          var cont = 0;
          var allMembers = [];
          for (let key of response) {
            console.log(key.friendId);
            var userDetails = await UserTable.findOne({ _id: key.friendId });

            console.log(userDetails);
            allMembers.push(userDetails);
            cont++;

            if (cont == response.length) {
              return res.json({
                status: true,
                msg: "groups list",
                data: allMembers,
              });
            }
          }
        } else
          return res.json({
            status: false,
            msg: "Something Went Wrong. Please Try Again!",
          });
      }
    );
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function removeFriend(req, res, next) {
  try {
    const { userId, friendId } = req.body;

    if (errors.indexOf(friendId) >= 0)
      return res.json({ status: false, msg: "Please provide the friendId." });
    if (errors.indexOf(userId) >= 0)
      return res.json({ status: false, msg: "Please provide the userId." });

    FriendsTable.deleteOne(
      { userId: userId, friendId: friendId },
      function (err, response) {
        if (err == null)
          return res.json({
            status: true,
            msg: "Friend is removed.",
            data: response,
          });
        else
          return res.json({
            status: false,
            msg: "Something Went Wrong. Please Try Again!",
          });
      }
    );
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}
