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

    //method to submit form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = NewPostDom(data.data);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost1($('.delete-post-button', newPost));
                    new ToggleLike($('.toggle-like', newPost));
                    flashMessage(data.message);
                },
                error: function(error){
                    console.log(error.responseText());
                }
            })
        })
    }

    //method to create a post in DOM
    let NewPostDom = function(data){
        return $(`<li id="post-${ data.post._id }">
                    <p>
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${ data.post._id }">
                                <i class="fa-regular fa-circle-xmark"></i>
                            </a>
                        </small>
                        <span class="post-content">
                            ${ data.post.content }
                        </span>
                        <br>
                        <small>
                            ${ data.user_name}
                            <a href="/like/post/${ data.post._id }" class="toggle-like">
                                <i class="fa-solid fa-heart"></i>
                                <small>
                                    0
                                </small>
                            </a>
                        </small>
                    </p>
                    <div class="post-comments">
                            <form action="/comments/create" method="post">
                                <!-- <label for="content">Comment: </label> -->
                                <input type="text" name="content" placeholder="Type here to add comment...." required>
                                <input type="hidden" name="post" value="${ data.post._id }">
                                <button type="submit">Post</button>
                            </form>
                        <div class="post-comments-list">
                            <ul id="post-comments-${ data.post._id }">
                                
                            </ul>
                        </div>
                    </div>
                </li>`);
    }

    //method to delete a post from DOM
    let deletePost = function(deleteLink){
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    flashMessage(data.message);
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
    }

    let deletePost1 = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            deletePost(deleteLink);
        });
    }

    $('.delete-post-button').click(function(e){
        e.preventDefault();
        deletePost(e.currentTarget);
    });

    createPost();
}