//Validation for project form
$(document).ready(function () {
    // Validate the project form
    $("form[name='project_form']").validate({
        // Specify validation rules
        rules: {
            name: {
                minlength: 1,
                maxlength: 50,
                required: true
            },
            summary: {
                minlength: 20,
                maxlength: 80,
                required: true
            },
            start_date: {
                required: true,
                // date: true
                // digits : true,
            },
            "manager[name]": {
                required: true
            },
            "manager[email]": {
                required: true,
                email: true
            },
            "team_members[0][name]": {
                required: true
            },
            "team_members[0][email]": {
                required: true,
                email: true
            },
            "team_members[0][role]": {
                required: true
            }
        },
        // Specify validation error messages
        messages: {
            name: {
                minlength: "Project name must be at least 1 characters long",
                maxlength: "Project name must be at most  50 characters long",
                required: "Project name is required"
            },
            summary: {
                minlength: "Project description must be at least 20 characters long",
                maxlength: "Project description must be at most  80 characters long",
                required: "Project description is required"
            },
            start_date: {
                required: "Start date is required",
                // digits: "Please enter a valid integer for start date just number"
            },
            "manager[name]": {
                required: "Manager's name is required"
            },
            "manager[email]": {
                required: "Manager's email is required",
                email: "Please enter a valid email address"
            },
            "team_members[0][name]": {
                required: "Team member's name is required"
            },
            "team_members[0][email]": {
                required: "Team member's email is required",
                email: "Please enter a valid email address"
            },
            "team_members[0][role]": {
                required: "Team member's role is required"
            }
        },
        // Error placement
        errorPlacement: function (error, element) {
            error.appendTo(element.parent());
        },
        // Highlight and unhighlight
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
        },
        // Form submit handler
        submitHandler: function (form) {
            form.submit();
        }
    });
});