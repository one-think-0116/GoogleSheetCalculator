$(() => {
    $('#guide .mdl-navigation__link').click(e => {
        $('#guide .mdl-navigation__link').removeClass('bg-success');
        $('#guide .mdl-navigation__link').removeClass('text-light');
        e.target.classList.add('bg-success');
        e.target.classList.add('text-light');

        $('#guide .page-content > div').hide();
        setTimeout(() => {$(`#${$(e.target).attr('id').slice(0,-5)}`).show();}, 100)
    })
})