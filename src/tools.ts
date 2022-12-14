import * as fs from 'fs';
import * as path from 'path';

import ignore from 'ignore'


export const print = (...args) => {
	console.log(...args)
}

export const create_a_text_file = (rootPath: string, fileName: string, content: string) => {
	if (fileName) {
		const filePath = path.join(rootPath, fileName);
		fs.writeFileSync(filePath, content);
	}
};

export function is_path_exists(p: string): boolean {
	try {
		fs.accessSync(p);
	} catch (err) {
		return false;
	}

	return true;
}

export const get_files_and_folders_under_a_path = (rootPath: string) => {
	const filesAndFolders = [];
	if (rootPath) {
		const fileNames = fs.readdirSync(rootPath);
		fileNames.forEach(fileName => {
			filesAndFolders.push(fileName);
		});
	}
	return filesAndFolders;
};


export const is_it_a_file = (path: string) => {
	if (fs.statSync(path).isFile()) {
		return true;
	}
	return false;
};


export const is_it_a_directory = (path: string) => {
	if (fs.statSync(path).isDirectory()) {
		return true;
	}
	return false;
};

export const get_path_seperator = () => {
	if (process.platform === 'win32') {
		return '\\';
	} else {
		return '/';
	}
};


export const get_directory_name = (path: string) => {
	const pathSeperator = get_path_seperator();
	const pathArray = path.split(pathSeperator);
	pathArray.pop();
	return pathArray.join(pathSeperator);
};


export const get_file_name = (path: string) => {
	const parts = path.split(get_path_seperator());
	return parts[parts.length - 1];
};


export function path_join(path1: string, path2: string) {
	return path.join(path1, path2);
}


export const read_gitignore_file_and_convert_it_to_rule_list = () => {
	let current_path = process.cwd();
	let git_ignore_file_path = "./.gitignore";

	if (is_path_exists(git_ignore_file_path)) {
		let text = fs.readFileSync(git_ignore_file_path).toString().trim();
		let lines = text.split("\n").filter((value) => {return value.trim() != ""})
		return lines
	} else {
		return []
	}
}

function remove_forward_slash_at_the_end_of_string(text: string) {
	if (text.endsWith("/")) {
		text= text.slice(0, text.length - 1)
	}
	return text
}

export function get_files_after_gitignore_filtering(files: string[], more_ignore_rules: string[] = []) {
	let gitignore_rule_list = read_gitignore_file_and_convert_it_to_rule_list()

	if (gitignore_rule_list.length == 0) {
		return files
	} 

	let gitignore_tool = ignore().add(gitignore_rule_list.map(value => remove_forward_slash_at_the_end_of_string(value)))

	if (more_ignore_rules??[].length != 0) {
		gitignore_tool.add(more_ignore_rules.map(value => remove_forward_slash_at_the_end_of_string(value)))
	}

	return gitignore_tool.filter(files)
}

export class _FileInfoNode {
	path: string
    is_folder: boolean
    is_file: boolean
    parent_folder: string
    name: string
    level: number
    children: _FileInfoNode[] | null = null
   
	constructor(a_dict:{
			path: string, 
			is_folder: boolean, 
			is_file: boolean, 
			parent_folder: string,
			name: string,
			level: number,
			children: _FileInfoNode[] | null
		}) {
			Object.keys(a_dict).forEach(key => {
				this[key] = a_dict[key]
			})
	}
   
	greet() {
		return "Hello, yingshaoxo!"
	}
}

function get_number_from_string(text: string) {
    const num = text.toString().replace(/[^0-9]/g, ''); 
	let result = 0.0
	try {
		result = parseFloat(num)
	} catch {
		result = 0.0
	}
    return result
}

export function get_folder_and_files_tree(
	folder: string,
	reverse: boolean = false,
	type_limiter: string[]  = [],
	gitignore_rules: string[] = [], // it will use cwd folder's .gitignore file + your rules
	): _FileInfoNode {
	let root = new _FileInfoNode({
		path: folder,
		is_folder: true,
		is_file: false,
		parent_folder: get_directory_name(folder),
		name: get_file_name(folder),
		level: 0,
		children: null
	})

	const travel = (node: _FileInfoNode) => {
		if (node.is_file) {
			node.children = null
			return
		}

		if (node.is_folder) {
			let files_and_folders = get_files_and_folders_under_a_path(node.path)
			let children: _FileInfoNode[] = []
			for (let index = 0; index < files_and_folders.length; index++) {
				let a_path = path_join(node.path, files_and_folders[index]) 
				let is_folder = is_it_a_directory(a_path)

				let should_it_get_filter_out = true
				if (is_folder == false) {
					if (type_limiter.length != 0) {
						let suffix = "." + a_path.split(".").pop()
						if (type_limiter.includes(suffix)) {
							should_it_get_filter_out = false
						}
					} else {
						should_it_get_filter_out = false
					}
				} else {
					should_it_get_filter_out = false
				}

				if (should_it_get_filter_out == true) {
					continue
				}

				let new_node = new _FileInfoNode({
					path: a_path,
					is_folder: is_folder,
					is_file: !is_folder,
					parent_folder: get_directory_name(a_path),
					name: get_file_name(a_path),
					level: node.level + 1,
					children: null
				})
				travel(new_node)
				children.push(new_node)
			}

			let new_files = get_files_after_gitignore_filtering(children.map(value => value.name), gitignore_rules)
			children = children.filter((a_node) => {
				return new_files.includes(a_node.name)
			})

			children.sort((a: _FileInfoNode, b: _FileInfoNode) => {
				const aa = get_number_from_string(a.name)
				const bb = get_number_from_string(b.name)
				if (reverse == false) {
					return aa-bb
				} else {
					return bb-aa
				}
			})
			node.children = children
		}
	}

	travel(root)

	return root
}


export function generate_summary_readme_file(folder_path: string, generated_file_name: string = "SUMMARY.md") {
    let node = get_folder_and_files_tree(
        folder_path,
        false,
        [".md"],
        [".git"]
    )

    let text = `
# Table of contents
	`.trim()
	text += "\n\n"

    const travel = (node: _FileInfoNode) => {
		let relative_path = node.path.slice(folder_path.length+1, node.path.length)
        if (node.is_file) {
            if (![0, 1, 2].includes(node.level)) {
                if (node.level == 3) {
                    // day note
					let splits = node.path.split(get_path_seperator())
					splits.reverse()
                    let date_string = splits[2] + "/" + get_file_name(node.parent_folder).padStart(2, '0') + "/" + node.name.slice(0, node.name.length - ".md".length).padStart(2, '0')
                    text += "* ".repeat(node.level - 1) + `[${date_string}](${relative_path})` + "\n"
                } else {
                    // other notes
					text += "* ".repeat(node.level - 1) + `[${node.name.slice(0, node.name.length - '.md'.length)}](${relative_path})` + "\n"
                }
            }
        } else {
			if (node.level != 0) {
				if (node.level == 1) {
					// year
					text += "* ".repeat(node.level - 1) + `[${node.name}](${relative_path})` + "\n"
				}
				if (node.level == 2) {
					// month
					text += "* ".repeat(node.level - 1) + `[${node.name}](${relative_path})` + "\n"
				}
				if (node.level == 3) {
					// day
					let splits = node.path.split(get_path_seperator())
					splits.reverse()
                    let date_string = splits[2] + "/" + get_file_name(node.parent_folder).padStart(2, '0') + "/" + node.name.slice(0, node.name.length - ".md".length).padStart(2, '0')
                    text += "* ".repeat(node.level - 1) + `${date_string}` + "\n"
				}
			}

            node.children?.forEach((node) => {
                travel(node)
            })
        }
    }

	travel(node)

	create_a_text_file(folder_path, "./" + generated_file_name, text)
}