/**
 *
 * main() will be run when you invoke this action
 *
 * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
 *
 * @return The output of this action, which must be a JSON object.
 *
 */

function main(params) {
    var RESULT1 = 0;
    for (var i in params.rows) {
        RESULT1 += parseInt(params.rows[i].doc.question1, 10);
    }
    RESULT1 = RESULT1 / params.rows.length;

    var RESULT2 = 0;
    for (var i in params.rows) {
        RESULT2 += parseInt(params.rows[i].doc.question2, 10);
    }
    RESULT2 = RESULT2 / params.rows.length;

    return {
        entries: params.rows.map((row) => { return {
            question1: row.doc.question1,
            question2: row.doc.question2,
            question3: row.doc.question3
        }}),
        avgQuestion1: RESULT1,
        avgQuestion2: RESULT2
    };
}