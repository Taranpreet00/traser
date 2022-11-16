{
    //flash message
    let flashMessage = function(flash_text){
        new Noty({
            theme: 'relax',
            text: flash_text,
            type: 'success',
            layout: 'topRight',
            timeout: 1500
        }).show();
    }

    // method to submit form data for new comment using ajax
    let createComment = function(){
        let newCommentsForm = $('.post-comments form');
        newCommentsForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(this).serialize(),
                success: function(data){
                    let newComment = newCommentDom(data.data);
                    $(`#post-comments-${data.data.comment.post}`).append(newComment);
                    deleteComment1($('.delete-comments-button', newComment));
                    new ToggleLike($('.toggle-like', newComment)); 
                    flashMessage(data.message);
                },
                error: function(error){
                    console.log(error.responseText());
                }
            });
        });
    };
    
    // method to create a comment in DOM
    let newCommentDom = function(data){
        return $(`<li id="comment-${ data.comment._id }">
        <p>
            <small>
                <a class="delete-comments-button" href="/comments/destroy/${ data.comment._id }">
                    <i class="fa-regular fa-circle-xmark"></i>
                </a>
            </small>
            ${ data.comment.content }
            <br>
            <small>
                ${ data.comment.user.name }
                <a href="/like/comment/${ data.comment._id }" class="toggle-like">
                <i class="fa-solid fa-heart"></i>
                <small>
                    0
                </small>
            </a>
            </small>
        </p>
    </li>`);
    }

    //method to Comment a post from DOM
    let deleteComment = function(deleteLink){
        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#comment-${data.data.comment_id}`).remove();
                flashMessage(data.message);
            },
            error: function(error){
                console.log(error.responseText);
            }
        });
    }

    $('.delete-comments-button').click(function(e){
        e.preventDefault();
        deleteComment(e.currentTarget);
    });

    let deleteComment1 = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            deleteComment(deleteLink);
        });
    }

    createComment();
}