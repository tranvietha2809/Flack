
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  //var socket = io()
  var username;
  var channel = "Global";
  var message;
  $("#submit_username").on("submit", function(){
    username = $(".username").val().trim();
    socket.emit("username input", {
      "username":username
    })
    return false;
  })

  socket.on("user validate", function(data){
    console.log(data);
    if (data.response !== "200"){
      $("h3").append("<div>Username is already taken</div>")
    }
    else {
      $("h3").html('');
      $("h3").append('<div>'+ data.username + "</div>");
    }
  })

  $("#user_message").on("submit", function(){
    message = $("#message_field").val().trim();
    let message_time = new Date();
    let time_stamp = message_time.getTime();
    if(message !== ""){
      socket.emit("send message", {
        "channel" : channel,
        "username": username,
        "message" : message,
        "time_stamp": time_stamp
      })
    }
    $("#message_field").val('').focus();
    return false;
  })

  socket.on("received message", function(data){
    $(".msg_history").append(
      '<div class="outgoing_msg"><div class="sent_msg"><p>' +data.username + '</p> <p> '+ data.message +'</p></div></div>'
    )
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

  socket.on("channel created", function(data){
    $(".inbox_chat").append(
      '<a href = "/'+data.channel_name+ '" class = "channel"><div class="chat_list active_chat"><div class="chat_people"><div class="chat_ib"><h5 id ="' +data.channel_name+ '">'+ data.channel_name+'</h5></div></div></div></a>'
    )
  })

  $("body").on("click", '.channel', function(e){
    e.preventDefault();
    channel = '';
    channel = $(".channel").find("h5").text();
    socket.emit("get channel messages", {
      "channel" : channel,
      "username" : username
    })
  })

  socket.on("receive channel messages", function(data){
    let user_messages, others_messages;
    console.log(data)
  })
