import { jsSearchIndex, StepDocument } from '@cucumber/suggest'
import { StepSegments } from '@cucumber/suggest/src/types'
import autocomplete, { AutocompleteItem } from 'autocompleter'
import Blockly from 'blockly'

type SuggestAutocompleteItem = AutocompleteItem & {
  segments: StepSegments
}

export function defineBlocks(stepDocuments: readonly StepDocument[]) {
  const index = jsSearchIndex(stepDocuments)

  const stepDocumentIds = new Map(
    stepDocuments.map((stepDocument, i) => [stepDocument.segments, `_cucumber_${i}`])
  )

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
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const block = this
      const blocklyInput = this.appendDummyInput()

      const stepTextInput = new Blockly.FieldTextInput('')

      const widgetCreate_ = stepTextInput.widgetCreate_.bind(stepTextInput)
      stepTextInput.widgetCreate_ = function () {
        const input = widgetCreate_()

        const autocompleteResult = autocomplete<SuggestAutocompleteItem>({
          input,
          minLength: 1,
          showOnFocus: true,
          preventSubmit: false,
          // https://github.com/kraaden/autocomplete/issues/31
          customize(input, inputRect, container) {
            container.style.width = '250px'
          },
          fetch: function (text, update) {
            const stepDocuments = index(text) || []
            const suggestions: SuggestAutocompleteItem[] = stepDocuments.map((stepDocument) => ({
              label: stepDocument.suggestion,
              segments: stepDocument.segments,
            }))
            update(suggestions)
          },
          onSelect: function (item) {
            input.value = item.label

            const blockId = stepDocumentIds.get(item.segments)
            if (!blockId) throw new Error(`No id for stepDocument ${item.label}`)
            const newBlock = block.workspace.newBlock(blockId)
            newBlock.setFieldValue(block.getFieldValue('STEP_KEYWORD'), 'STEP_KEYWORD')
            // @ts-ignore
            newBlock.initSvg()
            // @ts-ignore
            newBlock.render()

            // Replace this block with the new one
            block.previousConnection
              .targetBlock()
              .nextConnection.connect(newBlock.previousConnection)
            block.dispose(true)
            autocompleteResult.destroy()

            Blockly.WidgetDiv.hide()
            Blockly.DropDownDiv.hideWithoutAnimation()
          },
        })

        return input
      }

      blocklyInput
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

  for (const stepDocument of stepDocuments) {
    const blockId = stepDocumentIds.get(stepDocument.segments)
    if (!blockId) throw new Error(`No id for stepDocument ${stepDocument.suggestion}`)
    Blockly.Blocks[blockId] = {
      init: function (this: Blockly.Block) {
        const dummyInput = this.appendDummyInput()
        dummyInput.appendField(
          new Blockly.FieldDropdown([
            ['Given', 'GIVEN'],
            ['When', 'WHEN'],
            ['Then', 'THEN'],
          ]),
          'STEP_KEYWORD'
        )
        let i = 1
        for (const segment of stepDocument.segments) {
          if (typeof segment === 'string') {
            dummyInput.appendField(new Blockly.FieldLabelSerializable(segment), `STEP_FIELD_${i++}`)
          } else {
            dummyInput.appendField(new Blockly.FieldTextInput(segment[0]), `STEP_FIELD_${i++}`)
          }
        }

        this.setPreviousStatement(true, 'STEP')
        this.setNextStatement(true, 'STEP')
        this.setColour(270)
        this.setTooltip('I have {int} cukes in my {word}')
        this.setHelpUrl('')
      },
    }
  }
}
