/**
 * Web application
 */
const apiUrl = 'https://b0cd66dd.eu-de.apigw.appdomain.cloud/survey';
const survey = {
    // retrieve the existing survey entries
    get() {
        return $.ajax({
            type: 'GET',
            url: `${apiUrl}/entries`,
            dataType: 'json'
        });
    },
    // add a single suervey entry
    add(question1, question2, question3) {
        console.log(question1, question2, question3)
        return $.ajax({
            type: 'PUT',
            url: `${apiUrl}/entries`,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                question1,
                question2,
                question3,
            }),
            dataType: 'json',
        });
    }
};

(function() {
    let entriesTemplate;

    function prepareTemplates() {
        entriesTemplate = Handlebars.compile($('#entries-template').html());
    }

    // retrieve entries and update the UI
    function loadEntries() {
        console.log('Loading entries...');
        $('#entries').html('Loading entries...');
        survey.get().done(function(result) {
            if (!result.entries) {
                return;
            }

            const context = {
                entries: result.entries
            }
            $('#entries').html(entriesTemplate(context));
        }).error(function(error) {
            $('#entries').html('No entries');
            console.log(error);
        });
    }

    // intercept the click on the submit button, add the survey entry and
    // reload entries on success
    $(document).on('submit', '#addEntry', function(e) {
        e.preventDefault();
        survey.add(
            $('#question1').val().trim(),
            $('#question2').val().trim(),
            $('#question3').val().trim()
        ).done(function(result) {
            // reload entries
            loadEntries();
        }).error(function(error) {
            console.log(error);
        });
    });

    $(document).ready(function() {
        prepareTemplates();
        loadEntries();
    });
})();