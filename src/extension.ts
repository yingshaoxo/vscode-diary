'use strict';

import * as vscode from 'vscode';

import { DepNodeProvider, Dependency } from './nodeDependencies';

export function activate(context: vscode.ExtensionContext) {
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

	// Samples of `window.registerTreeDataProvider`
	const nodeDependenciesProvider = new DepNodeProvider(rootPath);
	vscode.window.registerTreeDataProvider('vscode-diary', nodeDependenciesProvider);
	vscode.commands.registerCommand('vscode-diary.refreshEntry', () => nodeDependenciesProvider.refresh());
	vscode.commands.registerCommand('vscode-diary.addEntry', () => nodeDependenciesProvider.createANewFileForTodaysDiary());
	// vscode.commands.registerCommand('vscode-diary.editEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`));
	// vscode.commands.registerCommand('vscode-diary.deleteEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called delete entry on ${node.label}.`));

	// Test View
	// new TestView(context);
}