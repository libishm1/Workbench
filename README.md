# Local Agent Workbench (VS Code)

A thin wrapper that runs the workbench commands in a terminal. It needs the workbench folder, set in `lawb.repoPath`.

Install for local development: open this folder in VS Code and press F5 (Run Extension). Commands are in the Command Palette under "LAWB".

The extension has no logic of its own: each command runs `python -m lawb ...` with `PYTHONPATH` set to the workbench `src` folder.

## Installing in Antigravity and other VS Code forks

Antigravity is a VS Code fork and, per public third-party reports, installs extensions from the
Open VSX registry rather than the Microsoft Marketplace. Publish this extension to Open VSX
(`npx ovsx publish`) with your own publisher name, or install the packaged `.vsix` file with the
Extensions view's "Install from VSIX" command. Google's official Antigravity documentation was not
checked for this, so verify the install path there first.

## Packaging

```bash
npx @vscode/vsce package     # creates local-agent-workbench-0.1.0.vsix
```
