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
        return $.ajax({
            type: 'PUT',
            url: `${apiUrl}/saveEntry`,
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

(
    function () {
        let entriesTemplate;

        function prepareTemplates() {
            entriesTemplate = Handlebars.compile($('#entries-template').html()
            );
        }

        // retrieve entries and update the UI
        function loadEntries() {
            $('#entries').html('Loading entries...');
            survey.get().done(function (result) {
                if (!result.entries) {
                    $('#entries').html('No entries');
                }

                const context = {
                    entries: result.entries,
                    avgQuestion1: Number(result.avgQuestion1).toFixed(2),
                    avgQuestionPercent1: Number(result.avgQuestion1 * 20).toFixed(2),
                    avgQuestion2: Number(result.avgQuestion2).toFixed(2),
                    avgQuestionPercent2: Number(result.avgQuestion2 * 20).toFixed(2)
                }
                $('#entries').html(entriesTemplate(context));
            });
        }

        // intercept the click on the submit button, add the survey entry and reload entries on success

        $(document).on('submit', '#addEntry', function (e) {
            e.preventDefault();

            var question1 = parseInt($('#question1 input:radio:checked').val().trim(), 10);
            if (!question1 || question1 < 1 || question1 > 5) {
                question1 = 0;
            }

            var question2 = parseInt($('#question2 input:radio:checked').val().trim(), 10);
            if (!question2 || question2 < 1 || question2 > 5) {
                question2 = 0;
            }

            var question3 = $('#question3').val().trim();

            survey.add(question1, question2, question3)
                .done(function (result) {
                    loadEntries();
                    alert("Thank you for your feedback");
                });
        });

        $(document).ready(function () {
            prepareTemplates();
            loadEntries();
        });
    }
)();
