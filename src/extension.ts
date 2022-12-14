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
	vscode.commands.registerCommand('vscode-diary.addEntry', () => nodeDependenciesProvider.create_a_new_file_for_todays_diary());
	vscode.commands.registerCommand('vscode-diary.takeNotesEntry', () => nodeDependenciesProvider.take_notes_entry());

	vscode.commands.registerCommand('vscode-diary.addNewFileEntry', (node: Dependency) => nodeDependenciesProvider.create_a_file_by_taking_userinput_filename(node));
	vscode.commands.registerCommand('vscode-diary.renameEntry', (node: Dependency) => nodeDependenciesProvider.rename(node));
	vscode.commands.registerCommand('vscode-diary.deleteEntry', (node: Dependency) => nodeDependenciesProvider.delete_a_file_when_user_click_it(node));

	nodeDependenciesProvider.root_path = rootPath
}