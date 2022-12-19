class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] });

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;
        this.socket.on('connect', function(){
            // console.log('connection established using sockets...!');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'traser'
            });

            // self.socket.on('user_joined', function(data){
            //     console.log('a user joined ' , data);
            // });
        });

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if(msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'traser'
                });
            }
        });

        this.socket.on('receive_message', function(data){
            let newMessage = $('<li>');
            let messageType = 'other-message';
            if(data.user_email == self.userEmail){
                messageType = 'self-message';
            }
            newMessage.append($(`<span>${data.message}<br><sub>${data.user_email}</sub></span>`));
            // newMessage.append($('<span>', {
            //     'html': data.message,
            // }));
            // newMessage.append($('<sub>', {
            //     'html': data.user_email
            // }));
            newMessage.addClass(messageType);
            $('#chat-message-list').append(newMessage);
        })
    }
}