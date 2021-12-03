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

                var RESULT1 = 0;
                for (var i in result.entries) {
                    RESULT1 += parseInt(result.entries[i].question1, 10);
                }
                RESULT1 = Number(RESULT1 / result.entries.length).toFixed(2);

                var RESULT2 = 0;
                for (var i in result.entries) {
                    RESULT2 += parseInt(result.entries[i].question2, 10);
                }
                RESULT2 = Number(RESULT2 / result.entries.length).toFixed(2);

                const context = {
                    entries: result.entries,
                    avgQuestion1: RESULT1,
                    avgQuestionPercent1: RESULT1 * 20,
                    avgQuestion2: RESULT2,
                    avgQuestionPercent2: RESULT2 * 20
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
