import Blockly from 'blockly'

Blockly.Blocks['scenario'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Scenario:')
      .appendField(new Blockly.FieldTextInput('The one where...'), 'SCENARIO_NAME')
    this.appendStatementInput('STEPS').setCheck('STEP')
    this.setColour(135)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}

Blockly.Blocks['step'] = {
  init: function (this: Blockly.Block) {
    const input = this.appendDummyInput()

    const stepTextInput = new Blockly.FieldTextInput('')
    // https://github.com/google/blockly/issues/4350
    // https://github.com/google/blockly/issues/2496
    // https://groups.google.com/g/blockly/c/UWoFiv3hvk0
    // @ts-ignore
    stepTextInput.onFinishEditing_ = (stepText: string) => {
      // @ts-ignore
      this.setWarningText(null)
      if (stepText === 'warn') {
        this.setWarningText('Here is a warning!')
      }
      if (stepText === 'cukes') {
        const blockName = 'step_cukes_in_belly'

        const childBlock = this.workspace.newBlock(blockName)
        childBlock.setFieldValue(this.getFieldValue('STEP_KEYWORD'), 'STEP_KEYWORD')
        // @ts-ignore
        childBlock.initSvg()
        // @ts-ignore
        childBlock.render()

        // Replace this block with the new one
        this.previousConnection.targetBlock().nextConnection.connect(childBlock.previousConnection)
        this.dispose(true)
      }
    }

    input
      .appendField(
        new Blockly.FieldDropdown([
          ['Given', 'GIVEN'],
          ['When', 'WHEN'],
          ['Then', 'THEN'],
        ]),
        'STEP_KEYWORD'
      )
      .appendField(stepTextInput, 'STEP_TEXT')
    this.setPreviousStatement(true, 'STEP')
    this.setNextStatement(true, 'STEP')
    this.setColour(270)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}

Blockly.Blocks['step_cukes_in_belly'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ['Given', 'GIVEN'],
          ['When', 'WHEN'],
          ['Then', 'THEN'],
        ]),
        'STEP_KEYWORD'
      )
      .appendField(new Blockly.FieldLabelSerializable('I have '), 'TEXT1')
      .appendField(new Blockly.FieldTextInput('42'), 'ARG1')
      .appendField(new Blockly.FieldLabelSerializable(' cukes in my '), 'TEXT2')
      .appendField(new Blockly.FieldTextInput('belly'), 'ARG2')
    this.setPreviousStatement(true, 'STEP')
    this.setNextStatement(true, 'STEP')
    this.setColour(270)
    this.setTooltip('I have {int} cukes in my {word}')
    this.setHelpUrl('')
  },
}
