
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
var my_message_template = Handlebars.compile(`
  <div class="outgoing_msg">
    <div class="sent_msg">
        <p>{{message}}</p>
        <span class="time_date">{{username}}</span></div>
    </div>`);
var other_message_template = Handlebars.compile(`
  <div class="incoming_msg">
    <div class="incoming_msg_img">
    <div class="received_msg">
      <div class="received_withd_msg">
        <p>{{message}}</p>
        <span class="time_date">{{username}}</span></div>
    </div>
  </div>
  `);

$(document).ready(function(){
  // check if user is already registered
  if (sessionStorage.getItem('username') != null){
    $("h3").html('');
    $("h3").append('<div>'+ sessionStorage.getItem('username') + "</div>");
  }

  //default channel is Global channel
  sessionStorage.setItem("default_channel", "Global");
  sessionStorage.setItem("current_channel", "Global")
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
      sessionStorage.setItem('username', data.username);
      $("h3").html('');
      $("h3").append('<div>'+ sessionStorage.getItem('username') + "</div>");
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

  $("body").on("click", '.channel', function(){
    // if current channel is not the chosen channel
    if (sessionStorage.getItem("current_channel") !== $(this).find("h5").text()){

      socket.emit("leave", {
        "username": sessionStorage.getItem("username"),
        "channel" : sessionStorage.getItem("current_channel")
      })
      //set current channel to chosen channel
      sessionStorage.setItem("current_channel", $(this).find("h5").text())

      //get the channel's message
      socket.emit("join", {
        "username": sessionStorage.getItem("username"),
        "channel" : sessionStorage.getItem("current_channel")
      })
    }
    //current channel is the chosen channel: do nothing.
    return false;
  })

  socket.on("receive channel message", function(data){
    //Clear message display
    $(".msg_history").empty();
    let msg_html;
    //TODO: display messages of the channel
    //TODO: display messages with user message on the right, guest messages on the left
    for(var i = 0; i < data.length; i++){
      if(data[i]["username"] == sessionStorage.getItem("username")){
        msg_html = my_message_template(data[i]);
        $(".msg_history").append(msg_html);
      }
      else{
        msg_html = other_message_template(data[i]);
        $(".msg_history").append(msg_html);
      }
    }

  })

  $("#user_message").on("submit", function(){
    message = $("#message_field").val().trim();
    let message_time = new Date();
    let time_stamp = message_time.getTime();
    if(message !== ""){
      socket.emit("send message", {
        "channel" : sessionStorage.getItem("current_channel"),
        "username": sessionStorage.getItem("username"),
        "message" : message,
        "time_stamp": time_stamp
      })
    }
    $("#message_field").val('').focus();
    return false;
  })

  socket.on("receive message", function(data){
    let msg_html;
    let data_context = {
      "username": data["username"],
      "message": data["message"],
      "timestamp": data["timestamp"]
    };
    if(sessionStorage.getItem("username") == data_context["username"]){
      msg_html = my_message_template(data_context);
    }
    else{
      msg_html = other_message_template(data_context);
    };
    $(".msg_history").append(msg_html);
  })
})

  /**
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
