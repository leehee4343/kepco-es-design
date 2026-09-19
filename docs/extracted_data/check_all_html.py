import glob
import re
import sys

MIN_FONT_SIZE_PX = 13

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

for html_path in sorted(glob.glob('*.html')):
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    classes = set()
    for m in re.findall(r'class=["\']([^"\']+)["\']', html):
        classes.update(m.split())
    missing = [c for c in classes if '.' + c not in css]
    if missing:
        print(f'{html_path}: {len(missing)} missing classes -> {sorted(missing)[:10]}')
    else:
        print(f'{html_path}: OK (All classes exist in style.css)')


def to_pixels(value, unit):
    value = float(value)
    return {
        'px': value,
        'rem': value * 16,
        'pt': value * (96 / 72),
    }[unit.lower()]


font_violations = []
font_pattern = re.compile(
    r'font-size\s*:\s*(\d+(?:\.\d+)?)\s*(px|rem|pt)'
    r'|font\s*:\s*(\d+(?:\.\d+)?)\s*(px|rem|pt)(?:\s*/[^;\s]+)?',
    re.IGNORECASE,
)

source_paths = sorted(
    glob.glob('*.html')
    + glob.glob('css/**/*.css', recursive=True)
    + glob.glob('js/**/*.js', recursive=True)
)

for source_path in source_paths:
    with open(source_path, 'r', encoding='utf-8') as source_file:
        for line_number, line in enumerate(source_file, start=1):
            for match in font_pattern.finditer(line):
                value = match.group(1) or match.group(3)
                unit = match.group(2) or match.group(4)
                if to_pixels(value, unit) < MIN_FONT_SIZE_PX:
                    font_violations.append(
                        f'{source_path}:{line_number}: {value}{unit}'
                    )

if font_violations:
    print(f'ERROR: font sizes below {MIN_FONT_SIZE_PX}px were found:')
    for violation in font_violations:
        print(f'  - {violation}')
    sys.exit(1)

print(f'Font size check: OK (minimum {MIN_FONT_SIZE_PX}px)')
