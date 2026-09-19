import glob
import re

count = 0
for html in sorted(glob.glob('*.html')):
    with open(html, 'r', encoding='utf-8') as f:
        content = f.read()

    # footer-demo-text div 블록 제거
    new_content = re.sub(r'\s*<div class="footer-demo-text">[\s\S]*?</div>', '', content)

    # footer-copyright 통일
    new_content = re.sub(
        r'<div class="footer-copyright">[\s\S]*?</div>',
        '<div class="footer-copyright">&copy; 2026 KEPCO Energy Solution Co., Ltd. All Rights Reserved.</div>',
        new_content
    )

    if new_content != content:
        with open(html, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated footer in: {html}')
        count += 1
    else:
        print(f'No change needed: {html}')

print(f'Total {count} files updated.')
