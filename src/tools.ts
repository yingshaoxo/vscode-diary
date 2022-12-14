import * as fs from 'fs';
import * as path from 'path';

import ignore from 'ignore'


export const print = (anything: any) => {
	console.log(anything)
}


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
	// git_ignore_file_path = path_join(current_path, git_ignore_file_path)

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
    folder: string
    name: string
    level: number
    children: _FileInfoNode[] | null = null
   
	constructor(a_dict:{
			path: string, 
			is_folder: boolean, 
			is_file: boolean, 
			folder: string,
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

// export function get_folder_and_files_tree(folder: string): _FileInfoNode {
// 	let root = new _FileInfoNode({
// 		path: folder,
// 		is_folder: true,
// 		is_file: false,
// 		folder: get_directory_name(folder),
// 		name: get_file_name(folder),
// 		level: 0,
// 		children: null
// 	})

// 	return root
// }

/*
def get_folder_and_files_tree(
	self, 
	folder: str, 
	reverse: bool = False,
	type_limiter: List[str] | None = None,
	gitignore_text: str|None = None,
) -> _FileInfo:
	"""
	Get files recursively under a folder.

	Parameters
	----------
	folder: string
	type_limiter: List[str]
		a list used to do a type filter, like [".mp3", ".epub"]
	gitignore_text: str
		similar to git's .gitignore file, if any file matchs any rule, it won't be inside of the 'return file list'
	"""
	root = _FileInfo(
		path=folder,
		is_folder=True,
		is_file=False,
		folder=self.get_directory_name(folder),
		name=self.get_file_name(folder),
		level=0,
		children=None
	)

	ignore_pattern_list = []
	if gitignore_text != None:
		ignore_pattern_list = self._parse_gitignore_text_to_list(gitignore_text=gitignore_text)

	def dive(node: _FileInfo):
		folder = node.path

		if not os.path.isdir(folder):
			return None

		items = os.listdir(folder)
		if len(items) == 0:
			return []
		
		files_and_folders: list[_FileInfo] = []
		for filename in items:
			file_path = os.path.join(folder, filename)
			if (os.path.isdir(file_path)) or (type_limiter == None) or (Path(file_path).suffix in type_limiter):
				# save
				#absolute_file_path = os.path.abspath(file_path)

				if gitignore_text != None:
					if self._file_match_the_gitignore_rule_list(
						start_folder=node.path, 
						file_path=file_path,
						ignore_pattern_list=ignore_pattern_list,
					):
						continue
				
				new_node = _FileInfo(
					path=file_path,
					is_folder=os.path.isdir(file_path),
					is_file=os.path.isfile(file_path),
					folder=self.get_directory_name(file_path),
					name=self.get_file_name(file_path),
					level=node.level + 1,
					children=None
				)
				dive(node=new_node)
				files_and_folders.append(
					new_node
				)
			else:
				# drop
				continue
		files_and_folders.sort(key=lambda node_: self._super_sort_key_function(node_.name), reverse=reverse)
		node.children = files_and_folders
	
	dive(root)
	
	return root
	*/
