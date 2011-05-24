
function createInputElement(id, definition, type) {
    var $input = (type != "select") ? jQuery("<input />") : jQuery("<select />");
    var _type = type || "hidden";

    if(type != "select") {
       $input.attr("type", _type);
    }

    $input.attr("id", id);
    $input.attr("class", "regula-validation");
    $input.attr("data-constraints", definition);
    $input.hide();

    jQuery("body").append($input);

    return $input;
}

function createFormElement(id, definition) {
    var $form = jQuery("<form />");
    $form.attr("id", id);
    $form.attr("class", "regula-validation");
    $form.attr("data-constraints", definition);
    $form.hide();

    jQuery("body").append($form);

    return $form;
}

function deleteElement(id) {
    jQuery("#" + id).remove();
}

/*
 The constraint-definition-parsing (success) tests make sure that no exceptions are raised. Since there is
 no return value from a successful bind(), I check to see that the return value is undefined. If there is
 any error during binding, an exception is raised.
 */
module("Constraint-definition parsing tests");

test('Test empty definition', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "");

    equals(regula.bind(), undefined, "Calling bind() on an element with no constraints must not return anything");

    deleteElement(inputElementId);
});

test('Test definition with one space', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, " ");

    equals(regula.bind(), undefined, "Calling bind() on an element where the constraint definition is just a space, must not return anything");

    deleteElement(inputElementId);
});

test('Test definition with only spaces', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "   ");

    equals(regula.bind(), undefined, "Calling bind() on an element where the constraint definition just has spaces, must not return anything");

    deleteElement(inputElementId);
});

test('Test definition without a name throws an exception', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@");

    var expectedExceptionMessage =  new RegExp(inputElementId + ": Invalid constraint name in constraint definition " +
                                               inputElementId + ": Invalid starting character for constraint name. Can only include A-Z, a-z, and _ " +
                                               inputElementId + ": Invalid starting character");
    raises(regula.bind, expectedExceptionMessage, "'@' should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition that does not start with @ throws an exception', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "ThisShouldFail");

    var expectedExceptionMessage =  new RegExp(inputElementId + ": Invalid constraint. Constraint definitions need to start with '@'");
    raises(regula.bind, expectedExceptionMessage, "'ThisShouldFail' should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with invalid starting-character 3 throws an exception', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@3ThisShouldFail");

    var expectedExceptionMessage =  new RegExp(inputElementId + ": Invalid constraint name in constraint definition " +
                                               inputElementId + ": Invalid starting character for constraint name. Can only include A-Z, a-z, and _ " +
                                               inputElementId + ": Invalid starting character");
    raises(regula.bind, expectedExceptionMessage, "'@3ThisShouldFail' should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with invalid starting-character + throws an exception', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@+ThisShouldFail");

    var expectedExceptionMessage =  new RegExp(inputElementId + ": Invalid constraint name in constraint definition " +
                                               inputElementId + ": Invalid starting character for constraint name. Can only include A-Z, a-z, and _ " +
                                               inputElementId + ": Invalid starting character");
    raises(regula.bind, expectedExceptionMessage, "'@+ThisShouldFail' should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition containing invalid character + throws an exception', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@This+ShouldFail");

    var expectedExceptionMessage =  new RegExp(inputElementId + ": Invalid constraint name in constraint definition " +
                                               inputElementId + ": Invalid character in identifier. Can only include 0-9, A-Z, a-z, and _");
    raises(regula.bind, expectedExceptionMessage, "'@This+ShouldFail' should not be a valid definition");

    deleteElement(inputElementId);
});


//We use raises here because the constraint names we are using aren't defined. So we expect an exception.

test('Test definition with one starting character', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@_");

    var expectedExceptionMessage =  new RegExp(inputElementId + "._: I cannot find the specified constraint name. If this is a custom constraint, you need to define it before you bind to it");
    raises(regula.bind, expectedExceptionMessage, "'@_' should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with valid characters', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@_This3Isavalid__Constraint");

    var expectedExceptionMessage =  new RegExp(inputElementId + "._This3Isavalid__Constraint: I cannot find the specified constraint name. If this is a custom constraint, you need to define it before you bind to it");
    raises(regula.bind, expectedExceptionMessage, "'@_This3Isavalid__' should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with no parentheses and no parameters', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank");

    equals(regula.bind(), undefined, "@NotBlank should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition without closing parenthesis', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(");

    var expectedExceptionMessage =  new RegExp(inputElementId + ".NotBlank: Invalid parameter definition " +
                                               inputElementId + ".NotBlank: Invalid parameter name. You might have unmatched parentheses " +
                                               inputElementId + ".NotBlank: Invalid starting character for parameter name. Can only include A-Z, a-z, and _");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(' should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition without opening parenthesis', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank)");

    var expectedExceptionMessage =  new RegExp(inputElementId + ".NotBlank: Unexpected character '\\)' after constraint definition");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank)' should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with balanced parentheses and no parameters', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank()");

    equals(regula.bind(), undefined, "@NotBlank() should be a valid definition");

    deleteElement(inputElementId);
});


test('Test definition with malformed parameters (1)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Invalid parameter definition " +
                                              inputElementId + ".NotBlank: '=' expected after parameter name");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param) should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (2)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Invalid parameter value " +
                                              inputElementId + ".NotBlank: Parameter value expected");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=) should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (3)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=value)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Invalid parameter definition " +
                                              inputElementId + ".NotBlank: Invalid parameter value " +
                                              inputElementId + ".NotBlank: Parameter value must be a number, quoted string, regular expression, or a boolean " +
                                              inputElementId + ".NotBlank: Not a valid group definition " +
                                              inputElementId + ".NotBlank: Not a boolean " +
                                              inputElementId + ".NotBlank: Not a regular expression " +
                                              inputElementId + ".NotBlank: Invalid quoted string " +
                                              inputElementId + ".NotBlank: Parameter value is not a number " +
                                              inputElementId + ".NotBlank: Not a positive number " +
                                              inputElementId + ".NotBlank: Not a valid integer " +
                                              inputElementId + ".NotBlank: Not a valid digit");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=value) should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (4)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=12a)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Parameter value is not a number");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=12a) should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (5)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=-12a)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Parameter value is not a number");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=-12a) should not be a valid definition");

    deleteElement(inputElementId);
});


test('Test definition with malformed parameters (6)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=-a)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Invalid parameter definition " +
                                              inputElementId + ".NotBlank: Invalid parameter value " +
                                              inputElementId + ".NotBlank: Parameter value must be a number, quoted string, regular expression, or a boolean " +
                                              inputElementId + ".NotBlank: Not a valid group definition " +
                                              inputElementId + ".NotBlank: Not a boolean " +
                                              inputElementId + ".NotBlank: Not a regular expression " +
                                              inputElementId + ".NotBlank: Invalid quoted string " +
                                              inputElementId + ".NotBlank: Parameter value is not a number " +
                                              inputElementId + ".NotBlank: Not a positive number " +
                                              inputElementId + ".NotBlank: Not a valid integer " +
                                              inputElementId + ".NotBlank: Not a valid digit");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=-a) should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (7)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Unterminated string literal");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=\") should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (8)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=\"\\\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Unterminated string literal");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=\"\\\") should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (9)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=\\\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Invalid parameter definition " +
                                              inputElementId + ".NotBlank: Invalid parameter value " +
                                              inputElementId + ".NotBlank: Parameter value must be a number, quoted string, regular expression, or a boolean " +
                                              inputElementId + ".NotBlank: Not a valid group definition " +
                                              inputElementId + ".NotBlank: Not a boolean " +
                                              inputElementId + ".NotBlank: Not a regular expression " +
                                              inputElementId + ".NotBlank: Invalid quoted string " +
                                              inputElementId + ".NotBlank: Parameter value is not a number " +
                                              inputElementId + ".NotBlank: Not a positive number " +
                                              inputElementId + ".NotBlank: Not a valid integer " +
                                              inputElementId + ".NotBlank: Not a valid digit");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=\\\") should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (10)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=/)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Unterminated regex literal");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=/) should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (11)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=/\\/)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Unterminated regex literal");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=/\\/) should not be a valid definition");

    deleteElement(inputElementId);
});


test('Test definition with malformed parameters (12)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=\\/)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Invalid parameter definition " +
                                              inputElementId + ".NotBlank: Invalid parameter value " +
                                              inputElementId + ".NotBlank: Parameter value must be a number, quoted string, regular expression, or a boolean " +
                                              inputElementId + ".NotBlank: Not a valid group definition " +
                                              inputElementId + ".NotBlank: Not a boolean " +
                                              inputElementId + ".NotBlank: Not a regular expression " +
                                              inputElementId + ".NotBlank: Invalid quoted string " +
                                              inputElementId + ".NotBlank: Parameter value is not a number " +
                                              inputElementId + ".NotBlank: Not a positive number " +
                                              inputElementId + ".NotBlank: Not a valid integer " +
                                              inputElementId + ".NotBlank: Not a valid digit");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=\\/) should not be a valid definition");

    deleteElement(inputElementId);
});


test('Test definition with malformed parameters (13)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=[)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Invalid group definition ");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=[) should not be a valid definition");

    deleteElement(inputElementId);
});


test('Test definition with malformed parameters (14)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=[0)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Invalid group definition ");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=[0) should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (15)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=[G)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Cannot find matching closing ] in group definition ");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=[G)' should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (16)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=[Group)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Cannot find matching closing ] in group definition ");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=[Group)' should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (17)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=[Group,)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Cannot find matching closing ] in group definition ");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=[Group,)' should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (18)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=[Group,G)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Cannot find matching closing ] in group definition ");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=[Group,G)' should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (19)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=[Group,Group)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Cannot find matching closing ] in group definition ");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=[Group,Group)' should not be a valid definition");

    deleteElement(inputElementId);
});


test('Test definition with malformed parameters (20)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param,)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Invalid parameter definition " +
                                              inputElementId + ".NotBlank: '=' expected after parameter name");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param,) should not be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with malformed parameters (21)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=10,)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Invalid parameter name. You might have unmatched parentheses " +
                                              inputElementId + ".NotBlank: Invalid starting character for parameter name. Can only include A-Z, a-z, and _ " +
                                              inputElementId + ".NotBlank: Invalid starting character");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=10,) should not be a valid definition");

    deleteElement(inputElementId);
});


test('Test definition with malformed parameters (21)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=10,param2)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: '=' expected after parameter name");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=10,param2) should not be a valid definition");

    deleteElement(inputElementId);
});


test('Test definition with malformed parameters (22)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(2)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Invalid parameter definition " +
                                              inputElementId + ".NotBlank: Invalid parameter name. You might have unmatched parentheses " +
                                              inputElementId + ".NotBlank: Invalid starting character for parameter name. Can only include A-Z, a-z, and _ " +
                                              inputElementId + ".NotBlank: Invalid starting character");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(2) should not be a valid definition");

    deleteElement(inputElementId);
});


test('Test definition with malformed parameters (23)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=12.)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Not a valid fraction");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=12.) should not be a valid definition");
    deleteElement(inputElementId);
});


test('Test definition with malformed parameters (24)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=12.a)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Not a valid fraction");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=12.a) should not be a valid definition");
    deleteElement(inputElementId);
});


test('Test definition with malformed parameters (25)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(groups=[10])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".NotBlank: Invalid starting character for group name");
    raises(regula.bind, expectedExceptionMessage, "'@NotBlank(param=12.a) should not be a valid definition");
    deleteElement(inputElementId);
});

test('Test definition with valid boolean parameter-value (true)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=true)");

    equals(regula.bind(), undefined, "@NotBlank(param=true) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with valid boolean parameter-value (false)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=false)");

    equals(regula.bind(), undefined, "@NotBlank(param=false) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with positive integer as a parameter', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=2)");

    equals(regula.bind(), undefined, "@NotBlank(param=2) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with negative integer as a parameter', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=-2)");

    equals(regula.bind(), undefined, "@NotBlank(param=-2) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with positive real number as a parameter', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=2.5)");

    equals(regula.bind(), undefined, "@NotBlank(param=2.5) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with negative real number as a parameter', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=-2.5)");

    equals(regula.bind(), undefined, "@NotBlank(param=-2.5) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with positive real number (with only fractional part) as a parameter', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=.5)");

    equals(regula.bind(), undefined, "@NotBlank(param=.5) should be a valid definition");

    deleteElement(inputElementId);
});


test('Test definition with negative real number (with only fractional part) as a parameter', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=-.5)");

    equals(regula.bind(), undefined, "@NotBlank(param=-.5) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with empty string as a parameter', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=\"\")");

    equals(regula.bind(), undefined, "@NotBlank(param=\"\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with non-empty string as a parameter', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=\"some text here\")");

    equals(regula.bind(), undefined, "@NotBlank(param=\"some text here\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with string containing escaped quotes as a parameter (1)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=\"\\\"\")");

    equals(regula.bind(), undefined, "@NotBlank(param=\"\\\"\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with string containing escaped quotes as a parameter (2)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param=\"this is a\\\"test\")");

    equals(regula.bind(), undefined, "@NotBlank(param=\"this is a\\\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with empty group-definition as a parameter', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(groups=[])");

    equals(regula.bind(), undefined, "@NotBlank(groups=[]) should be a valid definition");

    deleteElement(inputElementId);
});


test('Test definition with group-definition (with one group) as a parameter', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(groups=[MyGroup])");

    equals(regula.bind(), undefined, "@NotBlank(groups=[MyGroup]) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with group-definition (with more than one group) as a parameter (1)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(groups=[MyGroup, MyOtherGroup])");

    equals(regula.bind(), undefined, "@NotBlank(groups=[MyGroup, MyOtherGroup]) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with group-definition (with more than one group) as a parameter (2)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(groups=[MyGroup, MyOtherGroup, AndAnotherGroup])");

    equals(regula.bind(), undefined, "@NotBlank(groups=[MyGroup, MyOtherGroup, AndAnotherGroup]) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test definition with multiple valid parameters', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(param1=10, param2=\"text\\\"\", regex=/[a-b]\\//, param3=false, groups=[MyGroup, MyOtherGroup, AndAnotherGroup])");

    equals(regula.bind(), undefined, "@NotBlank(param1=10, param2=\"text\\\"\", regex=/[a-b]\\//, param3=false, groups=[MyGroup, MyOtherGroup, AndAnotherGroup]) should be a valid definition");

    deleteElement(inputElementId);
});

module("Test binding pre-defined constraints to elements, via HTML");

test('Test binding @Checked through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@Checked");

    var expectedExceptionMessage = new RegExp(formElementId + ".Checked: @Checked is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@Checked cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @Checked through markup to a non-checkbox/non-radio-button element', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Checked");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Checked: @Checked is only applicable to checkboxes and radio buttons. You are trying to bind it to an input element that is neither a checkbox nor a radio button");
    raises(regula.bind, expectedExceptionMessage, "@Checked should not be bound to a non-checkbox/non-radio-button element");

    deleteElement(inputElementId);
});

test('Test binding @Checked (without parameters) through markup to a checkbox', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Checked", "checkbox");

    equals(regula.bind(), undefined, "@Checked should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Checked (without parameters) through markup to a radio', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Checked", "radio");

    equals(regula.bind(), undefined, "@Checked should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Checked (with label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Checked(label=\"test\")", "checkbox");

    equals(regula.bind(), undefined, "@Checked(label=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Checked (with message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Checked(message=\"This is a test\")", "checkbox");

    equals(regula.bind(), undefined, "@Checkbox(message=\"This is a test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Checked (with groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Checked(groups=[Test])", "checkbox");

    equals(regula.bind(), undefined, "@Checkbox(groups=[Test]) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Checked (with groups, message and label parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Checked(label=\"test\", message=\"This is a test\", groups=[Test])", "checkbox");

    equals(regula.bind(), undefined, "@Checkbox(label=\"test\", message=\"This is a test\", groups=[Test]) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Selected through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@Selected");

    var expectedExceptionMessage = new RegExp(formElementId + ".Selected: @Selected is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@Selected cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @Selected through markup to a non-select element', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Selected");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Selected: @Selected is only applicable to select boxes. You are trying to bind it to an input element that is not a select box");
    raises(regula.bind, expectedExceptionMessage, "@Selected should not be bound to a non-select-box element");

    deleteElement(inputElementId);
});

test('Test binding @Selected (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Selected", "select");

    equals(regula.bind(), undefined, "@Selected should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Selected (with label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Selected(label=\"test\")", "select");

    equals(regula.bind(), undefined, "@Selected(label=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Selected (with message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Selected(message=\"This is a test\")", "select");

    equals(regula.bind(), undefined, "@Selected(message=\"This is a test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Selected (with groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Selected(groups=[Test])", "select");

    equals(regula.bind(), undefined, "@Selected(groups=[Test]) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Selected (with groups, message and label parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Selected(label=\"test\", message=\"This is a test\", groups=[Test])", "select");

    equals(regula.bind(), undefined, "@Selected(label=\"test\", message=\"This is a test\", groups=[Test]) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Required through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@Required");

    var expectedExceptionMessage = new RegExp(formElementId + ".Required: @Required is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@Required cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @Required (without parameters) through markup to an input element', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Required");

    equals(regula.bind(), undefined, "@Required should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Required (without parameters) through markup to a checkbox', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Required", "checkbox");

    equals(regula.bind(), undefined, "@Required should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Required (without parameters) through markup to a radio', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Required", "checkbox");

    equals(regula.bind(), undefined, "@Required should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Required (without parameters) through markup to a select', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Required", "select");

    equals(regula.bind(), undefined, "@Required should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Max through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@Max");

    var expectedExceptionMessage = new RegExp(formElementId + ".Max: @Max is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@Max cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @Max (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Max");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Max: You seem to have provided some optional or required parameters for @Max, but you are still missing the following 1 required parameters\\(s\\): value");
    raises(regula.bind, expectedExceptionMessage, "@Max cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Max (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Max(label=\"test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Max: You seem to have provided some optional or required parameters for @Max, but you are still missing the following 1 required parameters\\(s\\): value");
    raises(regula.bind, expectedExceptionMessage, "@Max cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Max (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Max(message=\"this is a test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Max: You seem to have provided some optional or required parameters for @Max, but you are still missing the following 1 required parameters\\(s\\): value");
    raises(regula.bind, expectedExceptionMessage, "@Max cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Max (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Max(groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Max: You seem to have provided some optional or required parameters for @Max, but you are still missing the following 1 required parameters\\(s\\): value");
    raises(regula.bind, expectedExceptionMessage, "@Max cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Max (with optional groups, label and message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Max(label=\"test\", message=\"this is a test\", groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Max: You seem to have provided some optional or required parameters for @Max, but you are still missing the following 1 required parameters\\(s\\): value");
    raises(regula.bind, expectedExceptionMessage, "@Max cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Max (with required parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Max(value=10)");

    equals(regula.bind(), undefined, "@Max(value=10) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Max (with required parameter and optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Max(value=10, label=\"test\")");

    equals(regula.bind(), undefined, "@Max(value=10, label=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Max (with required parameter and optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Max(value=10, message=\"this is a test\")");

    equals(regula.bind(), undefined, "@Max(value=10, message=\"this is a test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Max (with required parameter and optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Max(value=10, groups=[Test])");

    equals(regula.bind(), undefined, "@Max(value=10, groups=[Test]) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Max (with required parameter and optional groups, label and message parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Max(value=10, label=\"test\", message=\"This is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@Max(value=10, label=\"test\", message=\"This is a test\", groups=[Test]) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Min through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@Min");

    var expectedExceptionMessage = new RegExp(formElementId + ".Min: @Min is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@Min cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @Min (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Min");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Min: You seem to have provided some optional or required parameters for @Min, but you are still missing the following 1 required parameters\\(s\\): value");
    raises(regula.bind, expectedExceptionMessage, "@Min cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Min (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Min(label=\"test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Min: You seem to have provided some optional or required parameters for @Min, but you are still missing the following 1 required parameters\\(s\\): value");
    raises(regula.bind, expectedExceptionMessage, "@Min cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Min (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Min(message=\"this is a test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Min: You seem to have provided some optional or required parameters for @Min, but you are still missing the following 1 required parameters\\(s\\): value");
    raises(regula.bind, expectedExceptionMessage, "@Min cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Min (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Min(groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Min: You seem to have provided some optional or required parameters for @Min, but you are still missing the following 1 required parameters\\(s\\): value");
    raises(regula.bind, expectedExceptionMessage, "@Min cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Min (with optional groups, label and message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Min(label=\"test\", message=\"this is a test\", groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Min: You seem to have provided some optional or required parameters for @Min, but you are still missing the following 1 required parameters\\(s\\): value");
    raises(regula.bind, expectedExceptionMessage, "@Min cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Min (with required parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Min(value=10)");

    equals(regula.bind(), undefined, "@Min(value=10) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Min (with required parameter and optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Min(value=10, label=\"test\")");

    equals(regula.bind(), undefined, "@Min(value=10, label=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Min (with required parameter and optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Min(value=10, message=\"this is a test\")");

    equals(regula.bind(), undefined, "@Min(value=10, message=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Min (with required parameter and optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Min(value=10, groups=[Test])");

    equals(regula.bind(), undefined, "@Min(value=10, message=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Min (with required parameter and optional label, message, and groups parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Min(value=10, label=\"test\", message=\"This is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@Min(value=10, label=\"test\", message=\"This is a test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Range through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@Range");

    var expectedExceptionMessage = new RegExp(formElementId + ".Range: @Range is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@Range cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @Range (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Range");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 2 required parameters\\(s\\): max, min");
    raises(regula.bind, expectedExceptionMessage, "@Range cannnot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Range (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Range(label=\"test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 2 required parameters\\(s\\): max, min");
    raises(regula.bind, expectedExceptionMessage, "@Range cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Range (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Range(message=\"this is a test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 2 required parameters\\(s\\): max, min");
    raises(regula.bind, expectedExceptionMessage, "@Range cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Range (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Range(groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 2 required parameters\\(s\\): max, min");
    raises(regula.bind, expectedExceptionMessage, "@Range cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Range (with optional label, message, and groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Range(label=\"test\", message=\"this is a test\", groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 2 required parameters\\(s\\): max, min");
    raises(regula.bind, expectedExceptionMessage, "@Range cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Range (with one required parameter) through markup (1)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Range(max=5)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 1 required parameters\\(s\\): min");
    raises(regula.bind, expectedExceptionMessage, "@Range cannot be bound without its required parameter");

    deleteElement(inputElementId);
});


test('Test binding @Range (with one required parameter) through markup (2)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Range(min=5)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 1 required parameters\\(s\\): max");
    raises(regula.bind, expectedExceptionMessage, "@Range cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Range (with both required parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Range(min=5, max=10)");

    equals(regula.bind(), undefined, "@Range(min=5, max=10) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Range (with both required parameters and optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Range(min=5, max=10, label=\"test\")");

    equals(regula.bind(), undefined, "@Range(min=5, max=10, label=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Range (with both required parameters and optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Range(min=5, max=10, message=\"test message\")");

    equals(regula.bind(), undefined, "@Range(min=5, max=10, message=\"test message\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Range (with both required parameters and optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Range(min=5, max=10, groups=[Test])");

    equals(regula.bind(), undefined, "@Range(min=5, max=10, message=\"test message\", groups=[Test]) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Range (with both required parameters and optional message, label, and groups parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Range(min=5, max=10, label=\"test\", message=\"test message\", groups=[Test])");

    equals(regula.bind(), undefined, "@Range(min=5, max=10, label=\"test\", message=\"test message\", groups=[Test]) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Between through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@Between");

    var expectedExceptionMessage = new RegExp(formElementId + ".Range: @Range is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@Between cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @Between (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Between");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 2 required parameters\\(s\\): max, min");
    raises(regula.bind, expectedExceptionMessage, "@Between cannnot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Between (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Between(label=\"test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 2 required parameters\\(s\\): max, min");
    raises(regula.bind, expectedExceptionMessage, "@Between cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Between (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Between(message=\"this is a test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 2 required parameters\\(s\\): max, min");
    raises(regula.bind, expectedExceptionMessage, "@Between cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Between (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Between(groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 2 required parameters\\(s\\): max, min");
    raises(regula.bind, expectedExceptionMessage, "@Between cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Between (with optional label, message, and groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Between(label=\"test\", message=\"this is a test\", groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 2 required parameters\\(s\\): max, min");
    raises(regula.bind, expectedExceptionMessage, "@Between cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Between (with one required parameter) through markup (1)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Between(max=5)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 1 required parameters\\(s\\): min");
    raises(regula.bind, expectedExceptionMessage, "@Between cannot be bound without its required parameter");

    deleteElement(inputElementId);
});


test('Test binding @Between (with one required parameter) through markup (2)', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Between(min=5)");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Range: You seem to have provided some optional or required parameters for @Range, but you are still missing the following 1 required parameters\\(s\\): max");
    raises(regula.bind, expectedExceptionMessage, "@Between cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Between (with both required parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Between(min=5, max=10)");

    equals(regula.bind(), undefined, "@Between(min=5, max=10) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Between (with both required parameters and optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Between(min=5, max=10, label=\"test\")");

    equals(regula.bind(), undefined, "@Between(min=5, max=10, label=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Between (with both required parameters and optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Between(min=5, max=10, message=\"test message\")");

    equals(regula.bind(), undefined, "@Between(min=5, max=10, message=\"test message\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Between (with both required parameters and optional message, label, group parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Between(min=5, max=10, label=\"test\", message=\"test message\", groups=[Test])");

    equals(regula.bind(), undefined, "@Between(min=5, max=10, label=\"test\", message=\"test message\", groups=[Test]) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @NotBlank through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@NotBlank");

    var expectedExceptionMessage = new RegExp(formElementId + ".NotBlank: @NotBlank is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@NotBlank cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @NotBlank (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank");

    equals(regula.bind(), undefined, "@NotBlank should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @NotBlank (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(label=\"test\")");

    equals(regula.bind(), undefined, "@NotBlank(label=\"test\")");

    deleteElement(inputElementId);
});

test('Test binding @NotBlank (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(message=\"this is a test\")");

    equals(regula.bind(), undefined, "@NotBlank(message=\"this is a test\")");

    deleteElement(inputElementId);
});

test('Test binding @NotBlank (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(groups=[Test])");

    equals(regula.bind(), undefined, "@NotBlank(groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @NotBlank (with optional label, message, and groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotBlank(label=\"test\", message=\"this is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@NotBlank(label=\"test\", message=\"this is a test\", groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @NotEmpty through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@NotEmpty");

    var expectedExceptionMessage = new RegExp(formElementId + ".NotBlank: @NotBlank is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@NotEmpty cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @NotEmpty (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotEmpty");

    equals(regula.bind(), undefined, "@NotEmpty should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @NotEmpty (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotEmpty(label=\"test\")");

    equals(regula.bind(), undefined, "@NotEmpty(label=\"test\")");

    deleteElement(inputElementId);
});

test('Test binding @NotEmpty (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotEmpty(message=\"this is a test\")");

    equals(regula.bind(), undefined, "@NotEmpty(message=\"this is a test\")");

    deleteElement(inputElementId);
});

test('Test binding @NotEmpty (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotEmpty(groups=[Test])");

    equals(regula.bind(), undefined, "@NotEmpty(groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @NotEmpty (with optional label, message, groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@NotEmpty(label=\"test\", message=\"this is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@NotEmpty(label=\"test\", message=\"this is a test\", groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @Empty through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@Empty");

    var expectedExceptionMessage = new RegExp(formElementId + ".Blank: @Blank is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@Empty cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @Empty (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Empty");

    equals(regula.bind(), undefined, "@Empty should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Empty (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Empty(label=\"test\")");

    equals(regula.bind(), undefined, "@Empty(label=\"test\")");

    deleteElement(inputElementId);
});

test('Test binding @Empty (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Empty(message=\"this is a test\")");

    equals(regula.bind(), undefined, "@Empty(message=\"this is a test\")");

    deleteElement(inputElementId);
});

test('Test binding @Empty (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Empty(groups=[Test])");

    equals(regula.bind(), undefined, "@Empty(groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @Empty (with optional label, message, and groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Empty(label=\"test\", message=\"this is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@Empty(label=\"test\", message=\"this is a test\", groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @Blank through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@Blank");

    var expectedExceptionMessage = new RegExp(formElementId + ".Blank: @Blank is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@Blank cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @Blank (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Blank");

    equals(regula.bind(), undefined, "@Blank should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Blank (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Blank(label=\"test\")");

    equals(regula.bind(), undefined, "@Blank(label=\"test\")");

    deleteElement(inputElementId);
});

test('Test binding @Blank (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Blank(message=\"this is a test\")");

    equals(regula.bind(), undefined, "@Blank(message=\"this is a test\")");

    deleteElement(inputElementId);
});

test('Test binding @Blank (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Blank(groups=[Test])");

    equals(regula.bind(), undefined, "@Blank(groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @Blank (with optional label, message, and groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Blank(label=\"test\", message=\"this is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@Blank(label=\"test\", message=\"this is a test\", groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @Pattern through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@Pattern");

    var expectedExceptionMessage = new RegExp(formElementId + ".Pattern: @Pattern is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@Pattern cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @Pattern (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Pattern cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(label=\"test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Pattern cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(message=\"this is a test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Pattern cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Pattern cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with optional groups, label and message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(label=\"test\", message=\"this is a test\", groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Pattern cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with required parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(regex=/[a-z]/)");

    equals(regula.bind(), undefined, "@Pattern(regex=/[a-z]/) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with required parameter and optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(regex=/[a-z]/, label=\"test\")");

    equals(regula.bind(), undefined, "@Pattern(regex=/[a-z]/, label=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with required parameter and optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(regex=/[a-z]/, message=\"this is a test\")");

    equals(regula.bind(), undefined, "@Pattern(regex=/[a-z]/, message=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with required parameter and optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(regex=/[a-z]/, groups=[Test])");

    equals(regula.bind(), undefined, "@Pattern(regex=/[a-z]/, message=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with required parameter and optional label, message, and groups parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(regex=/[a-z]/, label=\"test\", message=\"This is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@Pattern(regex=/[a-z]/, label=\"test\", message=\"This is a test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with optional flags parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(flags=\"ig\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Pattern cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with optional flags and label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(flags=\"ig\", label=\"test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Pattern cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with optional flags and message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(flags=\"ig\", message=\"this is a test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Pattern cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with optional flags and groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(flags=\"ig\", groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Pattern cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with optional flags, groups, label and message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(flags=\"ig\", label=\"test\", message=\"this is a test\", groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Pattern cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with required parameter and optional flags parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(regex=/[a-z]/, flags=\"ig\")");

    equals(regula.bind(), undefined, "@Pattern(regex=/[a-z]/, flags=\"ig\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with required parameter and optional flags and label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(regex=/[a-z]/, flags=\"ig\", label=\"test\")");

    equals(regula.bind(), undefined, "@Pattern(regex=/[a-z]/, flags=\"ig\", label=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with required parameter and optional flags and message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(regex=/[a-z]/, flags=\"ig\", message=\"this is a test\")");

    equals(regula.bind(), undefined, "@Pattern(regex=/[a-z]/, flags=\"ig\", message=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with required parameter and optional flags and groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(regex=/[a-z]/, flags=\"ig\", groups=[Test])");

    equals(regula.bind(), undefined, "@Pattern(regex=/[a-z]/, flags=\"ig\", message=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Pattern (with required parameter and optional flags, label, message, and groups parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Pattern(regex=/[a-z]/, flags=\"ig\", label=\"test\", message=\"This is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@Pattern(regex=/[a-z]/, flags=\"ig\", label=\"test\", message=\"This is a test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Matches through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@Matches");

    var expectedExceptionMessage = new RegExp(formElementId + ".Pattern: @Pattern is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@Matches cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @Matches (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Matches cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(label=\"test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Matches cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(message=\"this is a test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Matches cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Matches cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with optional groups, label and message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(label=\"test\", message=\"this is a test\", groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Matches cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with required parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(regex=/[a-z]/)");

    equals(regula.bind(), undefined, "@Matches(regex=/[a-z]/) should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with required parameter and optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(regex=/[a-z]/, label=\"test\")");

    equals(regula.bind(), undefined, "@Matches(regex=/[a-z]/, label=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with required parameter and optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(regex=/[a-z]/, message=\"this is a test\")");

    equals(regula.bind(), undefined, "@Matches(regex=/[a-z]/, message=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with required parameter and optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(regex=/[a-z]/, groups=[Test])");

    equals(regula.bind(), undefined, "@Matches(regex=/[a-z]/, message=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with required parameter and optional label, message, and groups parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(regex=/[a-z]/, label=\"test\", message=\"This is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@Matches(regex=/[a-z]/, label=\"test\", message=\"This is a test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with optional flags parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(flags=\"ig\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Matches cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with optional flags and label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(flags=\"ig\", label=\"test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Matches cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with optional flags and message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(flags=\"ig\", message=\"this is a test\")");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Matches cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with optional flags and groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(flags=\"ig\", groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Matches cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with optional flags, groups, label and message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(flags=\"ig\", label=\"test\", message=\"this is a test\", groups=[Test])");

    var expectedExceptionMessage = new RegExp(inputElementId + ".Pattern: You seem to have provided some optional or required parameters for @Pattern, but you are still missing the following 1 required parameters\\(s\\): regex");
    raises(regula.bind, expectedExceptionMessage, "@Matches cannot be bound without its required parameter");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with required parameter and optional flags parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(regex=/[a-z]/, flags=\"ig\")");

    equals(regula.bind(), undefined, "@Matches(regex=/[a-z]/, flags=\"ig\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with required parameter and optional flags and label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(regex=/[a-z]/, flags=\"ig\", label=\"test\")");

    equals(regula.bind(), undefined, "@Matches(regex=/[a-z]/, flags=\"ig\", label=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with required parameter and optional flags and message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(regex=/[a-z]/, flags=\"ig\", message=\"this is a test\")");

    equals(regula.bind(), undefined, "@Matches(regex=/[a-z]/, flags=\"ig\", message=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with required parameter and optional flags and groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(regex=/[a-z]/, flags=\"ig\", groups=[Test])");

    equals(regula.bind(), undefined, "@Matches(regex=/[a-z]/, flags=\"ig\", message=\"test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Matches (with required parameter and optional flags, label, message, and groups parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Matches(regex=/[a-z]/, flags=\"ig\", label=\"test\", message=\"This is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@Matches(regex=/[a-z]/, flags=\"ig\", label=\"test\", message=\"This is a test\") should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Email through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@Email");

    var expectedExceptionMessage = new RegExp(formElementId + ".Email: @Email is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@Email cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @Email (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Email");

    equals(regula.bind(), undefined, "@Email should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @Email (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Email(label=\"test\")");

    equals(regula.bind(), undefined, "@Email(label=\"test\")");

    deleteElement(inputElementId);
});

test('Test binding @Email (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Email(message=\"this is a test\")");

    equals(regula.bind(), undefined, "@Email(message=\"this is a test\")");

    deleteElement(inputElementId);
});

test('Test binding @Email (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Email(groups=[Test])");

    equals(regula.bind(), undefined, "@Email(groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @Email (with optional label, message, and groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@Email(label=\"test\", message=\"this is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@Email(label=\"test\", message=\"this is a test\", groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @IsAlpha through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@IsAlpha");

    var expectedExceptionMessage = new RegExp(formElementId + ".IsAlpha: @IsAlpha is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@IsAlpha cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @IsAlpha (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsAlpha");

    equals(regula.bind(), undefined, "@IsAlpha should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @IsAlpha (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsAlpha(label=\"test\")");

    equals(regula.bind(), undefined, "@IsAlpha(label=\"test\")");

    deleteElement(inputElementId);
});

test('Test binding @IsAlpha (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsAlpha(message=\"this is a test\")");

    equals(regula.bind(), undefined, "@IsAlpha(message=\"this is a test\")");

    deleteElement(inputElementId);
});

test('Test binding @IsAlpha (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsAlpha(groups=[Test])");

    equals(regula.bind(), undefined, "@IsAlpha(groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @IsAlpha (with optional label, message, and groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsAlpha(label=\"test\", message=\"this is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@IsAlpha(label=\"test\", message=\"this is a test\", groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @IsNumeric through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@IsNumeric");

    var expectedExceptionMessage = new RegExp(formElementId + ".IsNumeric: @IsNumeric is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@IsNumeric cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @IsNumeric (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsNumeric");

    equals(regula.bind(), undefined, "@IsNumeric should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @IsNumeric (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsNumeric(label=\"test\")");

    equals(regula.bind(), undefined, "@IsNumeric(label=\"test\")");

    deleteElement(inputElementId);
});

test('Test binding @IsNumeric (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsNumeric(message=\"this is a test\")");

    equals(regula.bind(), undefined, "@IsNumeric(message=\"this is a test\")");

    deleteElement(inputElementId);
});

test('Test binding @IsNumeric (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsNumeric(groups=[Test])");

    equals(regula.bind(), undefined, "@IsNumeric(groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @IsNumeric (with optional label, message, and groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsNumeric(label=\"test\", message=\"this is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@IsNumeric(label=\"test\", message=\"this is a test\", groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @IsAlphaNumeric through markup to a form element', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@IsAlphaNumeric");

    var expectedExceptionMessage = new RegExp(formElementId + ".IsAlphaNumeric: @IsAlphaNumeric is not a form constraint, but you are trying to bind it to a form");
    raises(regula.bind, expectedExceptionMessage, "@IsAlphaNumeric cannot be bound to a form element");

    deleteElement(formElementId);
});

test('Test binding @IsAlphaNumeric (without parameters) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsAlphaNumeric");

    equals(regula.bind(), undefined, "@IsAlphaNumeric should be a valid definition");

    deleteElement(inputElementId);
});

test('Test binding @IsAlphaNumeric (with optional label parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsAlphaNumeric(label=\"test\")");

    equals(regula.bind(), undefined, "@IsAlphaNumeric(label=\"test\")");

    deleteElement(inputElementId);
});

test('Test binding @IsAlphaNumeric (with optional message parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsAlphaNumeric(message=\"this is a test\")");

    equals(regula.bind(), undefined, "@IsAlphaNumeric(message=\"this is a test\")");

    deleteElement(inputElementId);
});

test('Test binding @IsAlphaNumeric (with optional groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsAlphaNumeric(groups=[Test])");

    equals(regula.bind(), undefined, "@IsAlphaNumeric(groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @IsAlphaNumeric (with optional label, message, and groups parameter) through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@IsAlphaNumeric(label=\"test\", message=\"this is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@IsAlphaNumeric(label=\"test\", message=\"this is a test\", groups=[Test])");

    deleteElement(inputElementId);
});

test('Test binding @CompletelyFilled (without parameters) through markup', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@CompletelyFilled");

    equals(regula.bind(), undefined, "@CompletelyFilled should be a valid definition");

    deleteElement(formElementId);
});

test('Test binding @CompletelyFilled (with optional label parameter) through markup', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@CompletelyFilled(label=\"test\")");

    equals(regula.bind(), undefined, "@CompletelyFilled(label=\"test\")");

    deleteElement(formElementId);
});

test('Test binding @CompletelyFilled (with optional message parameter) through markup', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@CompletelyFilled(message=\"this is a test\")");

    equals(regula.bind(), undefined, "@CompletelyFilled(message=\"this is a test\")");

    deleteElement(formElementId);
});

test('Test binding @CompletelyFilled (with optional groups parameter) through markup', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@CompletelyFilled(groups=[Test])");

    equals(regula.bind(), undefined, "@CompletelyFilled(groups=[Test])");

    deleteElement(formElementId);
});

test('Test binding @CompletelyFilled (with optional label, message, and groups parameter) through markup', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@CompletelyFilled(label=\"test\", message=\"this is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@CompletelyFilled(label=\"test\", message=\"this is a test\", groups=[Test])");

    deleteElement(formElementId);
});

test('Test binding @CompletelyFilled (without parameters) through markup', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@CompletelyFilled");

    equals(regula.bind(), undefined, "@CompletelyFilled should be a valid definition");

    deleteElement(formElementId);
});

test('Test binding @CompletelyFilled (with optional label parameter) through markup', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@CompletelyFilled(label=\"test\")");

    equals(regula.bind(), undefined, "@CompletelyFilled(label=\"test\")");

    deleteElement(formElementId);
});

test('Test binding @CompletelyFilled (with optional message parameter) through markup', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@CompletelyFilled(message=\"this is a test\")");

    equals(regula.bind(), undefined, "@CompletelyFilled(message=\"this is a test\")");

    deleteElement(formElementId);
});

test('Test binding @CompletelyFilled (with optional groups parameter) through markup', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@CompletelyFilled(groups=[Test])");

    equals(regula.bind(), undefined, "@CompletelyFilled(groups=[Test])");

    deleteElement(formElementId);
});

test('Test binding @CompletelyFilled (with optional label, message, and groups parameter) through markup', function() {
    var formElementId = "hiddenForm";
    var $form = createFormElement(formElementId, "@CompletelyFilled(label=\"test\", message=\"this is a test\", groups=[Test])");

    equals(regula.bind(), undefined, "@CompletelyFilled(label=\"test\", message=\"this is a test\", groups=[Test])");

    deleteElement(formElementId);
});

test('Test binding @CompletelyFilled to a non-form element through markup', function() {
    var inputElementId = "hiddenInput";
    var $input = createInputElement(inputElementId, "@CompletelyFilled");

    var expectedExceptionMessage = new RegExp(inputElementId + ".CompletelyFilled: @CompletelyFilled is a form constraint, but you are trying to bind it to a non-form element");
    raises(regula.bind, expectedExceptionMessage, "@CompletelyFilled cannot be bound to a non-form element");

    deleteElement(inputElementId);
});

