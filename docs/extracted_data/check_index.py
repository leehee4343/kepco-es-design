import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

classes = set()
for m in re.findall(r'class=["\']([^"\']+)["\']', html):
    classes.update(m.split())

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

missing = [c for c in classes if '.' + c not in css]
print('Total classes in index.html:', len(classes))
print('Missing classes in index.html:', sorted(missing))
