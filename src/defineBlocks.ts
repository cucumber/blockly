import { Blocks, FieldTextInput } from 'blockly'
import { FieldNumber } from 'blockly/blockly'

Blocks['scenario'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Scenario:')
      .appendField(new FieldTextInput('The one where...'), 'SCENARIO_NAME')
    this.appendStatementInput('STEPS')
      .setCheck('STEP_KEYWORD')
    this.setColour(135)
    this.setTooltip('')
    this.setHelpUrl('')
  }
}

Blocks['given'] = {
  init: function () {
    this.appendValueInput('NAME')
      .setCheck('STEP_TEXT')
      .appendField('Given')
    this.setPreviousStatement(true, 'STEP_KEYWORD')
    this.setNextStatement(true, 'STEP_KEYWORD')
    this.setColour(270)
    this.setTooltip('')
    this.setHelpUrl('')
  }
}

Blocks['when'] = {
  init: function () {
    this.appendValueInput('NAME')
      .setCheck('STEP_TEXT')
      .appendField('When')
    this.setPreviousStatement(true, 'STEP_KEYWORD')
    this.setNextStatement(true, 'STEP_KEYWORD')
    this.setColour(270)
    this.setTooltip('')
    this.setHelpUrl('')
  }
}

Blocks['i_have__int__cukes_in_my__word_'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("I have")
      .appendField(new FieldNumber(42), "ARG1")
      .appendField("cukes in my")
      .appendField(new FieldTextInput("belly"), "ARG2");
    this.setOutput(true, "STEP_TEXT");
    this.setColour(180);
    this.setTooltip("I have {int} cukes in my {word}");
    this.setHelpUrl("");
  }
};
