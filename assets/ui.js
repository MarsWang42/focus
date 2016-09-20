$(document).ready(function(){
    var wrapper         = $("#input_fields_wrap"); //Fields wrapper
    var add_button      = $("#add_field_button"); //Add button ID
    var save_button     = $("#save_button");

    $(add_button).click(function(e){ //on add input button click
        e.preventDefault();
        // Every time the button is clicked, append a new domain field.
        $(wrapper).append(
            `<div class="row">
                <div class="col-md-6 col-md-offset-2">
                    <div class="input-group">
                        <input type="text" class="form-control domain-fields" placeholder="Recipient's username" aria-describedby="basic-addon2">
                        <span class="input-group-addon" id="basic-addon2">.com</span>
                    </div>
                </div>
                <button class="btn btn-danger remove_field">remove</button>
            <div>
            <br/>`
        )
    });

    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').remove();
    })

    $(save_button).click(function(e){
        e.preventDefault();
        // Once user click the save button, read the data from the forms
        // and post the data to /save
        var blacklist = [];
        $('.domain-fields').each(function(i, domain) {
            blacklist.push({'domain': '(.(.)|^)' + domain.value + '((.).|$)'})
        })
        var config = {
                        "authority": {
                            address: $("#authority-address")[0].value,
                            type: $("#authority-type")[0].value,
                            port: $("#authority-port")[0].value
                        },
                        "blacklist": blacklist
                    };

        $.ajax({
            url: '/save',
            data: JSON.stringify(config),
            processData: false,
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            success: function(data) {
                alert("Succesfully saved.");
            },
            error: function(data) {
                alert("Failed to save.")
            }
        })
    })

    // Read the previous settings from config.json.
    $.get("config.json", function(data, status) {
        $("#authority-address").val(data.authority.address);
        $("#authority-port").val(data.authority.port);
        $("#authority-type").val(data.authority.type);
        data.blacklist.forEach(function (entry) {
            $(wrapper).append(
                `<div class="row">
                    <div class="col-md-6 col-md-offset-2">
                        <div class="input-group">
                            <input type="text" class="form-control domain-fields" placeholder="Recipient's username" aria-describedby="basic-addon2">
                            <span class="input-group-addon" id="basic-addon2">.com</span>
                        </div>
                    </div>
                    <button class="btn btn-danger remove_field">remove</button>
                <div>
                <br/>`
            )
            $('input').last().val(entry.domain.slice(8, -8))
        })
    }

    )
})
