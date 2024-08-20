# Log Color Cleaner 🧹🎨

![npm version](https://img.shields.io/npm/v/log-color-cleaner.svg)
![license](https://img.shields.io/npm/l/log-color-cleaner.svg)
![downloads](https://img.shields.io/npm/dt/log-color-cleaner.svg)

Log Color Cleaner is a powerful CLI tool designed to remove ANSI color codes from log files, making them easier to read and process.

## 🌟 Features

- 🗂️ Process single log files or entire directories
- 🔄 Recursive directory scanning
- 🌈 Removes all ANSI color codes
- 🔄 Preserves original file structure
- 🌍 Supports multiple languages (currently English and Korean)
- 📊 Displays progress bar for bulk operations

## 🚀 Installation

Install Log Color Cleaner globally using npm:

```bash  npm install -g log-color-cleaner ```


## 📘 Usage

### Basic Usage
```bash clean-log <path-to-log-file-or-directory>```

Examples
Clean a single log file:

```bash
clean-log /path/to/your/logfile.log
```
Clean all log files in a directory:
```bash
clean-log /path/to/your/log/directory
```
Language Support
The tool automatically detects your system language. To manually set the language, use the LANG environment variable:
```bash
LANG=ko clean-log /path/to/logs  # Korean
LANG=en clean-log /path/to/logs  # English
```
## 🛠️ How It Works

The tool scans the given file or directory for .log files.
It reads each log file and removes all ANSI color codes.
A new file is created with the suffix '_cleaned' for each processed log file.
Original files are left untouched.

## 📋 Requirements

Node.js 12.0.0 or higher

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📜 License
This project is MIT licensed.

## 👨‍💻 Author
Alex Kang

GitHub: @yourusername
LinkedIn: @yourlinkedin


💡 If you find this tool helpful, please consider giving it a star on GitHub and sharing it with others!