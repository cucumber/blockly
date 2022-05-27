import { Suggestion } from '@cucumber/language-service'
import Blockly from 'blockly'

export function makeGenerator(suggestions: readonly Suggestion[]) {
  const generator = new Blockly.Generator('Gherkin')

  generator['feature'] = (block: Blockly.Block) => {
    const children = generator.statementToCode(block, 'CHILDREN')
    const keyword = 'Feature:'
    const name = block.getFieldValue('NAME')
    return `${keyword} ${name}\n${children}`
  }
  generator['scenario'] = (block: Blockly.Block) => {
    const children = generator.statementToCode(block, 'CHILDREN')
    const keyword = 'Scenario:'
    const name = block.getFieldValue('NAME')
    return `${keyword} ${name}\n${children}`
  }

  // https://blocklycodelabs.dev/codelabs/custom-generator/index.html?index=..%2F..index#8
  generator.scrub_ = (block: Blockly.Block, code: string, opt_thisOnly: boolean | undefined) => {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock()
    if (nextBlock && !opt_thisOnly) {
      return code + generator.blockToCode(nextBlock)
    }
    return code
  }

  for (const suggestion of suggestions) {
    generator[suggestion.label] = (block: Blockly.Block) => {
      const keyword = block.getFieldValue('STEP_KEYWORD')
      let code = `${keyword} `

      let i = 1
      for (const segment of suggestion.segments) {
        if (typeof segment === 'string') {
          code += block.getFieldValue(`STEP_FIELD_${i++}`)
        } else {
          code += block.getFieldValue(`STEP_FIELD_${i++}`)
        }
      }
      code += '\n'

      let childBlock = (block.childBlocks_ || [])[0]
      while (childBlock) {
        code += generator[childBlock.type](childBlock)
        childBlock = childBlock.getNextBlock()
      }

      return code
    }
  }

  return generator
}
