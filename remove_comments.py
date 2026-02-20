#!/usr/bin/env python3
"""Remove all comments from JS, CSS, and HTML files in frontend/ and backend/."""

import re
import os
import glob

PROJECT = os.path.dirname(os.path.abspath(__file__))

def remove_js_comments(code):
    """Remove single-line (//) and multi-line (/* */) comments from JS, preserving URLs."""
    result = []
    i = 0
    in_single_quote = False
    in_double_quote = False
    in_template = False

    while i < len(code):
        # Handle string literals
        if code[i] == "'" and not in_double_quote and not in_template:
            in_single_quote = not in_single_quote
            result.append(code[i])
            i += 1
        elif code[i] == '"' and not in_single_quote and not in_template:
            in_double_quote = not in_double_quote
            result.append(code[i])
            i += 1
        elif code[i] == '`' and not in_single_quote and not in_double_quote:
            in_template = not in_template
            result.append(code[i])
            i += 1
        elif code[i] == '\\' and (in_single_quote or in_double_quote or in_template):
            # Escape character inside string
            result.append(code[i])
            if i + 1 < len(code):
                result.append(code[i+1])
                i += 2
            else:
                i += 1
        elif not in_single_quote and not in_double_quote and not in_template:
            # Check for single-line comment
            if code[i:i+2] == '//':
                # Skip to end of line
                while i < len(code) and code[i] != '\n':
                    i += 1
            # Check for multi-line comment
            elif code[i:i+2] == '/*':
                end = code.find('*/', i + 2)
                if end != -1:
                    # Count newlines in the comment to preserve line structure
                    comment = code[i:end+2]
                    newlines = comment.count('\n')
                    result.append('\n' * newlines)
                    i = end + 2
                else:
                    i += 2
            else:
                result.append(code[i])
                i += 1
        else:
            result.append(code[i])
            i += 1
    
    return ''.join(result)


def remove_css_comments(code):
    """Remove /* */ comments from CSS."""
    result = []
    i = 0
    in_single_quote = False
    in_double_quote = False

    while i < len(code):
        if code[i] == "'" and not in_double_quote:
            in_single_quote = not in_single_quote
            result.append(code[i])
            i += 1
        elif code[i] == '"' and not in_single_quote:
            in_double_quote = not in_double_quote
            result.append(code[i])
            i += 1
        elif not in_single_quote and not in_double_quote and code[i:i+2] == '/*':
            end = code.find('*/', i + 2)
            if end != -1:
                comment = code[i:end+2]
                newlines = comment.count('\n')
                result.append('\n' * newlines)
                i = end + 2
            else:
                i += 2
        else:
            result.append(code[i])
            i += 1

    return ''.join(result)


def remove_html_comments(code):
    """Remove <!-- --> comments from HTML. Preserve conditional comments."""
    # Remove standard HTML comments but not conditional ones like <!--[if ...]>
    result = re.sub(r'<!--(?!\[).*?-->', '', code, flags=re.DOTALL)
    return result


def clean_empty_lines(code):
    """Remove excessive blank lines (more than 2 consecutive)."""
    lines = code.split('\n')
    cleaned = []
    blank_count = 0
    for line in lines:
        if line.strip() == '':
            blank_count += 1
            if blank_count <= 2:
                cleaned.append(line)
        else:
            blank_count = 0
            cleaned.append(line)
    return '\n'.join(cleaned)


def process_file(filepath, file_type):
    """Process a single file to remove comments."""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    original = content
    
    if file_type == 'js':
        content = remove_js_comments(content)
    elif file_type == 'css':
        content = remove_css_comments(content)
    elif file_type == 'html':
        content = remove_html_comments(content)
    
    content = clean_empty_lines(content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ {os.path.relpath(filepath, PROJECT)}")
        return True
    else:
        return False


def main():
    total = 0
    
    # Frontend JS files
    print("Frontend JS files:")
    for f in sorted(glob.glob(os.path.join(PROJECT, 'frontend', 'js', '*.js'))):
        if process_file(f, 'js'):
            total += 1
    
    # Frontend CSS files
    print("\nFrontend CSS files:")
    for f in sorted(glob.glob(os.path.join(PROJECT, 'frontend', 'css', '*.css'))):
        if process_file(f, 'css'):
            total += 1
    
    # Frontend HTML files
    print("\nFrontend HTML files:")
    for f in sorted(glob.glob(os.path.join(PROJECT, 'frontend', '*.html'))):
        if process_file(f, 'html'):
            total += 1
    
    # Backend JS files (excluding node_modules)
    print("\nBackend JS files:")
    for root, dirs, files in os.walk(os.path.join(PROJECT, 'backend')):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        for fname in sorted(files):
            if fname.endswith('.js'):
                fpath = os.path.join(root, fname)
                if process_file(fpath, 'js'):
                    total += 1
    
    print(f"\n✅ Done! Modified {total} files.")


if __name__ == '__main__':
    main()
