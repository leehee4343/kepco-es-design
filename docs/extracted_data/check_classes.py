import re

with open('SRMDashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

classes = set(re.findall(r'class=["\']([^"\']+)["\']', text))
all_cls = set()
for c in classes:
    all_cls.update(c.split())

with open('css/style.css', 'r', encoding='utf-8') as f:
    css_text = f.read()

missing = [c for c in all_cls if '.' + c not in css_text]
print('Total classes in SRMDashboard:', len(all_cls))
print('Missing classes in style.css:', len(missing))
print('List of missing:', sorted(missing))
