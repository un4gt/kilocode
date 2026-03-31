import * as vscode from "vscode"

export class KiloCodeActionProvider implements vscode.CodeActionProvider {
  static readonly metadata: vscode.CodeActionProviderMetadata = {
    providedCodeActionKinds: [vscode.CodeActionKind.QuickFix, vscode.CodeActionKind.RefactorRewrite],
  }

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
  ): vscode.CodeAction[] {
    if (range.isEmpty) return []

    const actions: vscode.CodeAction[] = []

    const add = new vscode.CodeAction("Add to kilocode--", vscode.CodeActionKind.RefactorRewrite)
    add.command = { command: "kilocode-lite.new.addToContext", title: "Add to kilocode--" }
    actions.push(add)

    const hasDiagnostics = context.diagnostics.length > 0

    if (hasDiagnostics) {
      const fix = new vscode.CodeAction("Fix with kilocode--", vscode.CodeActionKind.QuickFix)
      fix.command = { command: "kilocode-lite.new.fixCode", title: "Fix with kilocode--" }
      fix.isPreferred = true
      actions.push(fix)
    }

    if (!hasDiagnostics) {
      const explain = new vscode.CodeAction("Explain with kilocode--", vscode.CodeActionKind.RefactorRewrite)
      explain.command = { command: "kilocode-lite.new.explainCode", title: "Explain with kilocode--" }
      actions.push(explain)

      const improve = new vscode.CodeAction("Improve with kilocode--", vscode.CodeActionKind.RefactorRewrite)
      improve.command = { command: "kilocode-lite.new.improveCode", title: "Improve with kilocode--" }
      actions.push(improve)
    }

    return actions
  }
}
