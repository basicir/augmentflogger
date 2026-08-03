with open('src/app/layout.tsx', 'r') as f:
    content = f.read()

import_statement = "import type { Metadata, Viewport } from 'next'"
content = content.replace("import type { Metadata } from 'next'", import_statement)

viewport_config = """export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content',
}

export const metadata"""

content = content.replace("export const metadata", viewport_config)

with open('src/app/layout.tsx', 'w') as f:
    f.write(content)

print("Done")
