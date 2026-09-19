import glob, re

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
