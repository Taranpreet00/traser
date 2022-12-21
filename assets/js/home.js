$('#friends-show-button').click(function(e){
    console.log('friends button clicked');
    $('#feed-posts').addClass('hideposts');
    $('#user-friends').removeClass('friends-hide');
});
$('#home-show-button').click(function(e){
    console.log('home button clicked');
    $('#user-friends').addClass('friends-hide');
    $('#feed-posts').removeClass('hideposts');
});