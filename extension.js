// Thin wrapper: each command runs the workbench CLI in a VS Code terminal.
// It does not reimplement any logic, so the CLI stays the single source of behaviour.
const vscode = require("vscode");
const path = require("path");

function workbenchTerminal(context) {
  const cfg = vscode.workspace.getConfiguration("lawb");
  const repo = cfg.get("repoPath");
  if (!repo) {
    vscode.window.showErrorMessage("Set lawb.repoPath to the workbench folder (the one with src/lawb).");
    return null;
  }
  const python = cfg.get("pythonPath") || "python";
  const srcDir = path.join(repo, "src");
  const cwd = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : repo;
  const terminal = vscode.window.createTerminal({
    name: "Local Agent Workbench",
    cwd,
    env: { PYTHONPATH: srcDir },
  });
  terminal.show();
  return { terminal, python };
}

function run(context, args) {
  const t = workbenchTerminal(context);
  if (!t) return;
  t.terminal.sendText(`${t.python} -m lawb ${args}`);
}

function activeFile() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("Open the file first.");
    return null;
  }
  return editor.document.uri.fsPath;
}

function quote(p) {
  return `"${p.replace(/"/g, '\\"')}"`;
}

function activate(context) {
  const reg = (id, fn) => context.subscriptions.push(vscode.commands.registerCommand(id, fn));

  reg("lawb.doctor", () => run(context, "doctor"));
  reg("lawb.setup", () => run(context, "setup"));
  reg("lawb.skillsList", () => run(context, "skills list"));

  reg("lawb.pdfExtract", () => {
    const f = activeFile();
    if (f) run(context, `pdf ${quote(f)} -o ${quote(f.replace(/\.pdf$/i, ".md"))}`);
  });

  reg("lawb.diagramBuild", () => {
    const f = activeFile();
    if (f) run(context, `diagram ${quote(f)} -o ${quote(path.join(path.dirname(f), "diagrams"))}`);
  });

  reg("lawb.prismaCounts", () => {
    const f = activeFile();
    if (f) run(context, `review ${quote(f)} -o ${quote(f.replace(/\.csv$/i, "_counts.md"))}`);
  });

  reg("lawb.loopRun", () => {
    const f = activeFile();
    if (!f) return;
    const model = vscode.workspace.getConfiguration("lawb").get("model");
    run(context, `loop ${quote(path.dirname(f))} --model ${model}`);
  });
}

function deactivate() {}

module.exports = { activate, deactivate };
