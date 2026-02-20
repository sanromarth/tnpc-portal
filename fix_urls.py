import os, re, glob

frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")

for filepath in glob.glob(os.path.join(frontend_dir, "*.html")):
    with open(filepath, "r") as f:
        lines = f.readlines()

    fixed_lines = []
    i = 0
    preconnect_count = 0
    while i < len(lines):
        line = lines[i]

        # Fix preconnect lines ending with just "https: or https://fonts.googleapis.com"
        if 'rel="preconnect"' in line and ('href="https:' in line or "href='https:" in line):
            preconnect_count += 1
            if preconnect_count == 1:
                fixed_lines.append('<link rel="preconnect" href="https://fonts.googleapis.com">\n')
            else:
                fixed_lines.append('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n')
            # Skip the closing > if it was on this line
            i += 1
            continue

        # Fix Google Fonts CSS link
        if '<link href="https:' in line and i + 1 < len(lines) and 'fonts' not in line and 'googleapis' not in line:
            # Line just has "https:" - broken
            fixed_lines.append('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">\n')
            i += 1
            continue

        # Also catch the line if it already has the partial googleapis from first fix
        if '<link href="https://fonts.googleapis.com">' in line:
            fixed_lines.append('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">\n')
            i += 1
            continue

        # Fix Chart.js script
        if '<script src="https:' in line and 'chart' not in line.lower() and 'cdn' not in line.lower():
            fixed_lines.append('<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n')
            i += 1
            continue

        # Fix placeholder URL
        if 'placeholder="https:' in line and line.strip().endswith('https:'):
            fixed_lines.append(line.replace('placeholder="https:', 'placeholder="https://example.com"'))
            i += 1
            continue

        fixed_lines.append(line)
        i += 1

    with open(filepath, "w") as f:
        f.writelines(fixed_lines)
    print(f"Fixed: {os.path.basename(filepath)} ({preconnect_count} preconnects)")

print("\nDone! All HTML files fixed.")
