class UserBind{
    self;
    constructor(from_user_id, to_user_id){
        this.send_user_id = from_user_id;
        this.rec_user_id = to_user_id;
        self = this;

        this.socket = io('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket']});

        this.getdata();
    }

    getdata(){
        let self1 = this;
        this.socket.on('connect', function(){
            self1.socket.emit('join_room', {
                chatroom: self.send_user_id
            });
        });
        $.ajax({
            url: '/chat/getchat',
            method: 'POST',
            success: this.displaychat,
            data: {
                toUser: this.rec_user_id
            }
        });

        this.socket.on('new-message', function(data){
            let id1 = $('#chatarea h1').attr('data');
            let id2 = data.from_user;
            if(id1 == id2){
                $('#chat-list').append(`<li class="other-message"><span>${data.message}</span></li>`);
                $('#chat-list').scrollTop($('#chat-list')[0].scrollHeight);
            }
        });
    }

    displaychat(data){
        let chatarea = $('#chatarea');
        chatarea.html(`
        <h1 data="${data.data.receiveuser.id}"> ${data.data.receiveuser.name} </h1>
        <ul id ="chat-list">
        </ul>
        <div id="messagebox-container">
            <input id="new_message" type="text">
            <button>
                <i class="fa-solid fa-paper-plane"></i>
            </button>
        </div>
        `);

        for(let message of data.data.chat.messages){
            if(message.from_user == self.rec_user_id){
                $('#chat-list').append(`<li class="other-message"><span>${message.content}</span></li>`);
            }
            else{
                $('#chat-list').append(`<li class="self-message"><span>${message.content}</span></li>`);
            }
        }
        $('#chat-list').scrollTop($('#chat-list')[0].scrollHeight);
    
        $('#chatarea button').attr('id', 'send-message-button');
        $('#send-message-button').on('click', function(e){
            let to_user = $('#chatarea h1').attr('data');
            let message = $('#new_message').val();
            if(message != ''){
                $.ajax({
                    url: '/chat/send_message',
                    method: 'POST',
                    success: self.createMessage,
                    data:{
                        to_user_id: to_user,
                        message: message
                    }
                });
            }
        });
    }

    createMessage(data){
        $('#chat-list').append(`<li class="self-message"><span>${data.message.content}</span></li>`)
        $('#new_message').val('');
        $('#chat-list').scrollTop($('#chat-list')[0].scrollHeight);
        self.socket.emit('send-message', {
            from_user: self.send_user_id,
            to_user: self.rec_user_id,
            message: data.message.content
        });
    }
}


$('.friends').on('click', function(e){
    e.preventDefault();
    let to_user_id = $(this).attr('href');
    let from_user_id = $('#chatarea').attr('from_user');
    new UserBind(from_user_id, to_user_id);
});