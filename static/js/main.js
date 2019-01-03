
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

$(document).ready(function(){
  // check if user is already registered
  if (localStorage.getItem('username') != null){
    $("h3").html('');
    $("h3").append('<div>'+ localStorage.getItem('username') + "</div>");
  }

  //default channel is Global channel
  localStorage.setItem("default_channel", "Global");
//
  $("#submit_username").on("submit", function(){
    let username = $(".username").val().trim();
    socket.emit("username input", {
      "username": username
    })
    return false;
  })

  socket.on("user validate", function(data){
    console.log(data);
    if (data.response !== "200"){
      $("h3").append("<div>Username is already taken</div>")
    }
    else {
      localStorage.setItem('username', data.username);
      $("h3").html('');
      $("h3").append('<div>'+ localStorage.getItem('username') + "</div>");
    }
  })

  $("#create_channel").on("submit", function(){
    let channel_name = $("#channel_name").val().trim();
    if (channel_name !== ""){
      socket.emit("create channel",{
        "channel_name": channel_name
      })
    }
    $("#channel_name").val('').focus();
    return false;
  })

  socket.on("created channel", function(data){
    $(".inbox_chat").append(
      '<a href = "#" class = "channel"><div class="chat_list active_chat"><div class="chat_people"><div class="chat_ib"><h5 id ="' +data.channel_name+ '">'+ data.channel_name+'</h5></div></div></div></a>')
  })

  $(".channel").on("click", function(){
    // if current channel is not the chosen channel
    if (localStorage.getItem("current_channel") != $(this).find("h5").text()){

      //quit the current channel
      leaveChannel(localStorage.getItem("username"), localStorage.getItem("current_channel"))

      //set current channel to chosen channel
      localStorage.setItem("current_channel", $(this).find("h5").text())

      //Clear message display
      $(".msg_history").empty();

      //get the channel's message
      socket.emit("get channel message", {
        "channel_name": localStorage.getItem("current_channel")
      })
    }

    //current channel is the chosen channel: do nothing.
    return false;
  })
})
  /**$("#user_message").on("submit", function(){
    "message = $("#message_field").val().trim();
    let message_time = new Date();
    let time_stamp = message_time.getTime();
    if(message !== ""){
      "socket.emit("send message", {
        "channel" : channel,
        "username": username,
        "message" : message,
        "time_stamp": time_stamp
      })
    }
    "$("#message_field").val('').focus();
    return false;
  })

  socket.on("received message", function(data){
    "$(".msg_history").append(
      '<div class="outgoing_msg"><div class="sent_msg"><p>' +data.username + '</p> <p> '+ data.message +'</p></div></div>'
    )
  })



  socket.on("channel created", function(data){
    ""$(".inbox_chat").append(
      '<a href = "/'+data.channel_name+ '" class = "channel"><div class="chat_list active_chat"><div class="chat_people"><div class="chat_ib"><h5 id ="' +data.channel_name+ '">'+ data.channel_name+'</h5></div></div></div></a>'
    )
  })

  $("body").on("click", '.channel', function(e){
    "e.preventDefault();
    channel = '';
    channel = $(".channel").find("h5").text();
    socket.emit("get channel messages", {
      "channel" : channel,
      "username" : username
    })
  })

  socket.on("receive channel messages", function(data){
    "let user_messages, others_messages;
    console.log(data)
  })**/
