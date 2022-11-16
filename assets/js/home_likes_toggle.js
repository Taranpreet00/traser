class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: $(self).attr('href')
            })
            .done(function(data){
                let likesCount = parseInt($(self).find('small')[0].innerText);
                if(data.deleted){
                    likesCount -= 1;
                    $(self).find('i')[0].classList.remove('like');
                }
                else{
                    likesCount +=1;
                    $(self).find('i')[0].classList.add('like');
                }
                $(self).find('small')[0].innerText = likesCount.toString();
            })
            .fail(function(errdata){
                console.log('Error in completing the request', errdata);
            });
        });
    }
};