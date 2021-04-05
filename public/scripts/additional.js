$(() => {
    $('#guide .mdl-navigation__link').click(e => {
        $('#guide .page-content > div').hide();
        setTimeout(() => {$(`#${$(e.target).attr('id').slice(0,-5)}`).show();}, 100)
    })
})