import { Expression } from '@cucumber/cucumber-expressions'
import { parseGherkinDocument, Suggestion } from '@cucumber/language-service'
import Blockly from 'blockly'
import { BlocklyOptions } from 'core/blockly_options'

import { defineBlocks } from './defineBlocks.js'
import { gherkinDocumentToBlocklyXml } from './gherkinDocumentToBlocklyXml.js'
import { makeGenerator } from './makeGenerator.js'
import { toolbox } from './toolbox.js'

/**
 * Mounts a Cucumber Blockly editor
 *
 * @param $parent the DOM element where the Blockly UI is added
 * @param suggestions suggestions built by @cucumber/language-service
 * @param expressions all the expressions from step definitions
 * @param gherkinSource the gherkin source used to build the initial blocks
 * @param onBlocklyChanged called with an error, new generated Gherkin source and the Blockly XML whenever the blockly
 * editor has changed. All parameteers may be undefined
 */
export function mount(
  $parent: Element,
  gherkinSource: string,
  suggestions: readonly Suggestion[],
  expressions: readonly Expression[],
  onBlocklyChanged: (
    error: Error | undefined,
    gherkinSource: string | undefined,
    blocklyXml: string | undefined
  ) => void
): () => void {
  defineBlocks(suggestions)
  const options: BlocklyOptions = {
    readOnly: false,
    trashcan: true,
    media: 'media/',
    move: {
      scrollbars: true,
      drag: true,
      wheel: true,
    },
    toolbox: toolbox(suggestions),
  }
  $parent.classList.add('cucumber-blockly')
  // @ts-ignore
  const blocklyWorkspace = Blockly.inject($parent, options)
  const generator = makeGenerator(suggestions)
  generator.init(blocklyWorkspace)

  let err: Error | undefined

  const { gherkinDocument, error } = parseGherkinDocument(gherkinSource)
  if (error) {
    err = error
  }
  if (gherkinDocument) {
    const $xml = document.createElement('xml')
    gherkinDocumentToBlocklyXml(expressions, gherkinDocument, $xml)
    Blockly.Xml.domToWorkspace($xml, blocklyWorkspace)
  }

  blocklyWorkspace.addChangeListener(() => {
    let workspaceXml: string | undefined
    let gherkinSource: string | undefined
    try {
      gherkinSource = generator.workspaceToCode(blocklyWorkspace)
      const xml = Blockly.Xml.workspaceToDom(blocklyWorkspace)
      workspaceXml = Blockly.Xml.domToPrettyText(xml)
    } catch (error) {
      err = error
    }
    onBlocklyChanged(err, gherkinSource, workspaceXml)
  })

  return () => blocklyWorkspace.dispose()
}
